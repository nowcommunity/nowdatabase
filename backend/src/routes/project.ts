import { Request, Router } from 'express'
import { deleteProject, getAllProjects, getProjectDetails, validateEntireProject } from '../services/project'
import { requireOneOf } from '../middlewares/authorizer'
import { EditDataType, EditMetaData, ProjectDetailsType, Role } from '../../../frontend/src/shared/types'
import { writeProject } from '../services/write/project'

const router = Router()

router.get('/all', async (req, res) => {
  const projects = await getAllProjects(req.user)
  return res.status(200).send(projects)
})

router.get('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  const project = await getProjectDetails(id)
  if (!project) return res.status(404).send()
  return res.status(200).send(project)
})

router.put(
  '/',
  requireOneOf([Role.Admin]),
  async (req: Request<object, object, { project: EditDataType<ProjectDetailsType> & EditMetaData }>, res) => {
    try {
      const { ...editedProject } = req.body.project
      const validationErrors = validateEntireProject({ ...editedProject })
      if (validationErrors.length > 0) {
        return res.status(403).send(validationErrors)
      }
      const pid = await writeProject(editedProject)
      return res.status(200).send({ pid })
    } catch (error) {
      return res.status(500).send({ message: 'Failed to write project' })
    }
  }
)

router.delete('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  const deleted = await deleteProject(id)

  if (!deleted) return res.status(404).send()

  return res.status(200).send()
})

export default router
