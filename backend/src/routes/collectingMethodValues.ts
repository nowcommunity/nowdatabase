import { Router } from 'express'
import { getAllCollectingMethodValuesHandler } from '../controllers/collectingMethodValuesController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'

const router = Router()

router.get('/all', requireOneOf([Role.Admin, Role.EditUnrestricted]), getAllCollectingMethodValuesHandler)

export default router
