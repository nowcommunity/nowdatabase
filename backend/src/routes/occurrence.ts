import { Router } from 'express'
import { pipeline } from 'stream'
import { getOccurrenceDetail, updateOccurrenceDetail } from '../controllers/occurrenceController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'
import { buildDwcOccurrenceArchiveZipStream } from '../services/dwcArchiveExportOccurrences'
import { currentDateAsString } from '../../../frontend/src/shared/currentDateAsString'
import { logger } from '../utils/logger'

const router = Router()

router.get('/export/dwc-archive', requireOneOf([Role.Admin]), async (_req, res, next) => {
  const archive = await buildDwcOccurrenceArchiveZipStream()
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="now_dwc_occurrences_test_export_${currentDateAsString()}.zip"`
  )
  pipeline(archive.stream, res, error => {
    archive.cleanup().catch(cleanupError => {
      logger.error(`Failed to clean up occurrence DwC export temp files: ${String(cleanupError)}`)
    })
    if (error) next(error)
  })
})

router.get('/:lid/:speciesId', getOccurrenceDetail)
router.put(
  '/:lid/:speciesId',
  requireOneOf([Role.Admin, Role.EditUnrestricted, Role.EditRestricted]),
  updateOccurrenceDetail
)

export default router
