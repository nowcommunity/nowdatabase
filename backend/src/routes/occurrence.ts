import { Router } from 'express'
import { getOccurrenceDetail } from '../controllers/occurrenceController'

const router = Router()

router.get('/:lid/:speciesId', getOccurrenceDetail)

export default router
