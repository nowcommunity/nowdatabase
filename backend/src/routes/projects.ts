import { Router } from 'express'
import { createProjectHandler, updateProjectHandler } from '../controllers/projectsController'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'

const router = Router()

router.post('/', requireOneOf([Role.Admin]), createProjectHandler)
router.put('/:id', requireOneOf([Role.Admin]), updateProjectHandler)

export default router
