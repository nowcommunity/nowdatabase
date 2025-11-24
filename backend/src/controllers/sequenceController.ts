import { Request, Response } from 'express'
import { getAllSequences } from '../services/sequence'

const parseNumber = (value: unknown) => {
  if (typeof value !== 'string') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export const getSequences = async (req: Request, res: Response) => {
  const limit = parseNumber(req.query.limit)
  const offset = parseNumber(req.query.offset)

  const sequences = await getAllSequences({ limit, offset })
  return res.status(200).send(sequences)
}
