import { Request, Response } from 'express'
import { createProject, CreateProjectInput } from '../services/projectsService'

export const createProjectHandler = async (req: Request<object, object, CreateProjectInput>, res: Response) => {
  const createdProject = await createProject(req.body)

  return res.status(201).json(createdProject)
}
