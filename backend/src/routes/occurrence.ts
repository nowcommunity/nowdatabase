import { Router } from 'express'
import { getOccurrenceDetail, updateOccurrenceDetail } from '../controllers/occurrenceController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'
import { buildDwcOccurrenceArchiveZipBuffer } from '../services/dwcArchiveExportOccurrences'
import { currentDateAsString } from '../../../frontend/src/shared/currentDateAsString'

const router = Router()

router.get('/export/dwc-archive', requireOneOf([Role.Admin]), async (_req, res) => {
  const zipBuffer = await buildDwcOccurrenceArchiveZipBuffer()
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="now_dwc_occurrences_test_export_${currentDateAsString()}.zip"`
  )
  res.send(zipBuffer)
})

router.get('/:lid/:speciesId', getOccurrenceDetail)
router.put(
  '/:lid/:speciesId',
  requireOneOf([Role.Admin, Role.EditUnrestricted, Role.EditRestricted]),
  updateOccurrenceDetail
)

export default router
