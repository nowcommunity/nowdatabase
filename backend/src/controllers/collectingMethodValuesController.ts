import { Request, Response } from 'express'
import { getAllCollectingMethodValues } from '../services/collectingMethodValues'

export const getAllCollectingMethodValuesHandler = async (_req: Request, res: Response) => {
  const values = await getAllCollectingMethodValues()
  return res.status(200).send(values)
}
