import { NextFunction, Request, Response, Router } from 'express'
import { pipeline } from 'stream'
import { getOccurrenceDetail, updateOccurrenceDetail } from '../controllers/occurrenceController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'
import {
  buildDwcOccurrenceArchiveZipStream,
  type DwcOccurrenceKey,
  type DwcOccurrenceExportProgress,
} from '../services/dwcArchiveExportOccurrences'
import { buildDwcDataPackageZipBuffer, buildFullDarwinCoreExportZipBuffer } from '../services/dwcDataPackageExport'
import { currentDateAsString } from '../../../frontend/src/shared/currentDateAsString'
import { logger } from '../utils/logger'
import { getFilteredCrossSearchOccurrenceKeys, type CrossSearchRequestParameters } from '../services/crossSearch'

const router = Router()

const occurrenceExportProgress = new Map<string, DwcOccurrenceExportProgress>()

const scheduleProgressCleanup = (exportId: string) => {
  setTimeout(
    () => {
      occurrenceExportProgress.delete(exportId)
    },
    5 * 60 * 1000
  )
}

const defaultCrossSearchExportFilters = {
  columnFilters: [],
  sorting: [],
} satisfies CrossSearchRequestParameters

const resolveOccurrenceKeysForExport = async (req: Request): Promise<DwcOccurrenceKey[] | undefined> => {
  if (req.method === 'GET') return undefined
  const body = req.body as Partial<CrossSearchRequestParameters> | undefined
  const result = await getFilteredCrossSearchOccurrenceKeys(req.user, {
    columnFilters: body?.columnFilters ?? defaultCrossSearchExportFilters.columnFilters,
    sorting: body?.sorting ?? defaultCrossSearchExportFilters.sorting,
  })
  if ('validationErrors' in result) {
    throw new Error(JSON.stringify(result.validationErrors))
  }
  return result.occurrenceKeys
}

const handleExportFilterError = (error: unknown, res: Response) => {
  return res.status(403).send({ error: error instanceof Error ? error.message : 'Invalid export filters.' })
}

router.get('/export/dwc-archive/progress/:exportId', requireOneOf([Role.Admin]), (req, res) => {
  const progress = occurrenceExportProgress.get(req.params.exportId)
  if (!progress) return res.status(404).send({ message: 'Occurrence export progress not found.' })
  return res.status(200).send(progress)
})

const streamDwcOccurrenceArchive = async (
  req: Request,
  res: Response,
  next: NextFunction,
  occurrenceKeys?: DwcOccurrenceKey[]
) => {
  const exportId = typeof req.query.exportId === 'string' ? req.query.exportId : undefined
  const reportProgress = exportId
    ? (progress: DwcOccurrenceExportProgress) => {
        occurrenceExportProgress.set(exportId, progress)
      }
    : undefined

  const archive = await buildDwcOccurrenceArchiveZipStream({ reportProgress, occurrenceKeys }).catch(error => {
    if (exportId) scheduleProgressCleanup(exportId)
    throw error
  })
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="now_dwc_occurrences_export_${currentDateAsString()}.zip"`)
  pipeline(archive.stream, res, error => {
    archive.cleanup().catch(cleanupError => {
      logger.error(`Failed to clean up occurrence DwC export temp files: ${String(cleanupError)}`)
    })
    if (exportId) {
      occurrenceExportProgress.set(exportId, {
        stage: 'complete',
        generated: 1,
        total: 1,
        message: 'DwC-A ZIP export ready.',
      })
      scheduleProgressCleanup(exportId)
    }
    if (error) next(error)
  })
}

router.get('/export/dwc-archive', requireOneOf([Role.Admin]), async (req, res, next) => {
  return streamDwcOccurrenceArchive(req, res, next)
})

router.post('/export/dwc-archive', requireOneOf([Role.Admin]), async (req, res, next) => {
  let occurrenceKeys
  try {
    occurrenceKeys = await resolveOccurrenceKeysForExport(req)
  } catch (error) {
    return handleExportFilterError(error, res)
  }
  return streamDwcOccurrenceArchive(req, res, next, occurrenceKeys)
})

const sendDwcDataPackage = async (occurrenceKeys: DwcOccurrenceKey[] | undefined, res: Response) => {
  const zipBuffer = await buildDwcDataPackageZipBuffer(occurrenceKeys)
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="now_dwc_dp_export_${currentDateAsString()}.zip"`)
  return res.status(200).send(zipBuffer)
}

router.get('/export/dwc-data-package', requireOneOf([Role.Admin]), async (_req, res) => {
  return sendDwcDataPackage(undefined, res)
})

router.post('/export/dwc-data-package', requireOneOf([Role.Admin]), async (req, res) => {
  try {
    return await sendDwcDataPackage(await resolveOccurrenceKeysForExport(req), res)
  } catch (error) {
    return handleExportFilterError(error, res)
  }
})

const sendFullDarwinCorePackage = async (occurrenceKeys: DwcOccurrenceKey[] | undefined, res: Response) => {
  const zipBuffer = await buildFullDarwinCoreExportZipBuffer(occurrenceKeys)
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="now_dwc_full_export_${currentDateAsString()}.zip"`)
  return res.status(200).send(zipBuffer)
}

router.get('/export/dwc-full-package', requireOneOf([Role.Admin]), async (_req, res) => {
  return sendFullDarwinCorePackage(undefined, res)
})

router.post('/export/dwc-full-package', requireOneOf([Role.Admin]), async (req, res) => {
  try {
    return await sendFullDarwinCorePackage(await resolveOccurrenceKeysForExport(req), res)
  } catch (error) {
    return handleExportFilterError(error, res)
  }
})

router.get('/:lid/:speciesId', getOccurrenceDetail)
router.put(
  '/:lid/:speciesId',
  requireOneOf([Role.Admin, Role.EditUnrestricted, Role.EditRestricted]),
  updateOccurrenceDetail
)

export default router
