import { Router } from 'express'
import { getAllProjects, getProjectDetails } from '../services/project'

const router = Router()

router.get('/all', async (_req, res) => {
  const projects = await getAllProjects()
  return res.status(200).send(projects)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const project = await getProjectDetails(id)
  res.status(200).send(project)
})

export default router
