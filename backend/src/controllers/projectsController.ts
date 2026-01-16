import { Request, Response } from 'express'
import { createProject, CreateProjectInput, updateProject, UpdateProjectInput } from '../services/projectsService'
import { NotFoundError, ValidationError } from '../validators/projectsValidator'

export const createProjectHandler = async (req: Request<object, object, CreateProjectInput>, res: Response) => {
  try {
    const createdProject = await createProject(req.body)
    return res.status(201).json(createdProject)
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.status).json({ message: error.message })
    }
    throw error
  }
}

export const updateProjectHandler = async (req: Request<{ id: string }, object, UpdateProjectInput>, res: Response) => {
  try {
    const updatedProject = await updateProject(Number(req.params.id), req.body)
    return res.status(200).json(updatedProject)
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return res.status(error.status).json({ message: error.message })
    }
    throw error
  }
}
