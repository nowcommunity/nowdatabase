import { Router } from 'express'
import { pipeline } from 'stream'
import { getOccurrenceDetail, updateOccurrenceDetail } from '../controllers/occurrenceController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'
import {
  buildDwcOccurrenceArchiveZipStream,
  type DwcOccurrenceExportProgress,
} from '../services/dwcArchiveExportOccurrences'
import { buildDwcDataPackageZipBuffer } from '../services/dwcDataPackageExport'
import { currentDateAsString } from '../../../frontend/src/shared/currentDateAsString'
import { logger } from '../utils/logger'

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

router.get('/export/dwc-archive/progress/:exportId', requireOneOf([Role.Admin]), (req, res) => {
  const progress = occurrenceExportProgress.get(req.params.exportId)
  if (!progress) return res.status(404).send({ message: 'Occurrence export progress not found.' })
  return res.status(200).send(progress)
})

router.get('/export/dwc-archive', requireOneOf([Role.Admin]), async (req, res, next) => {
  const exportId = typeof req.query.exportId === 'string' ? req.query.exportId : undefined
  const reportProgress = exportId
    ? (progress: DwcOccurrenceExportProgress) => {
        occurrenceExportProgress.set(exportId, progress)
      }
    : undefined

  const archive = await buildDwcOccurrenceArchiveZipStream({ reportProgress }).catch(error => {
    if (exportId) scheduleProgressCleanup(exportId)
    throw error
  })
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="now_dwc_occurrences_test_export_${currentDateAsString()}.zip"`
  )
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
})

router.get('/export/dwc-data-package', requireOneOf([Role.Admin]), async (_req, res) => {
  const zipBuffer = await buildDwcDataPackageZipBuffer()
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="now_dwc_dp_test_export_${currentDateAsString()}.zip"`)
  return res.status(200).send(zipBuffer)
})

router.get('/:lid/:speciesId', getOccurrenceDetail)
router.put(
  '/:lid/:speciesId',
  requireOneOf([Role.Admin, Role.EditUnrestricted, Role.EditRestricted]),
  updateOccurrenceDetail
)

export default router
