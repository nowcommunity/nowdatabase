import { Router } from 'express'
import { createProjectHandler } from '../controllers/projectsController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'

const router = Router()

router.post('/', requireOneOf([Role.Admin]), createProjectHandler)

export default router
