import { Router } from 'express'
import { getOccurrenceDetail, updateOccurrenceDetail } from '../controllers/occurrenceController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'

const router = Router()

router.get('/:lid/:speciesId', getOccurrenceDetail)
router.put(
  '/:lid/:speciesId',
  requireOneOf([Role.Admin, Role.EditUnrestricted, Role.EditRestricted]),
  updateOccurrenceDetail
)

export default router
