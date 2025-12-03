import { Request, Response } from 'express'
import { createProject, CreateProjectInput, updateProject, UpdateProjectInput } from '../services/projectsService'

export const createProjectHandler = async (req: Request<object, object, CreateProjectInput>, res: Response) => {
  const createdProject = await createProject(req.body)

  return res.status(201).json(createdProject)
}

export const updateProjectHandler = async (req: Request<{ id: string }, object, UpdateProjectInput>, res: Response) => {
  const updatedProject = await updateProject(Number(req.params.id), req.body)

  return res.status(200).json(updatedProject)
}
