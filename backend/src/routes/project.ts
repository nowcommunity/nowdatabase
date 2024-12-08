import { Router } from 'express'
import { getAllProjects, getProjectDetails } from '../services/project'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'

const router = Router()

router.get('/all', async (_req, res) => {
  const projects = await getAllProjects()
  return res.status(200).send(projects)
})

router.get('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  const project = await getProjectDetails(id)
  if (!project) return res.status(404).send()
  return res.status(200).send(project)
})

export default router
