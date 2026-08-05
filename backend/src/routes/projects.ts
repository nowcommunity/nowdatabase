import { Request, Router } from 'express'
import { validateEntireProject } from '../services/project'
import { writeProject } from '../services/write/project'
import { EditDataType, EditMetaData, ProjectDetailsType, Role } from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'

const router = Router()

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

export default router
