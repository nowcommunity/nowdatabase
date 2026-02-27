import { Request, Response } from 'express'
import { getOccurrenceByCompositeKey, parseOccurrenceRouteParams } from '../services/occurrenceService'
import { fixBigInt } from '../utils/common'

export const getOccurrenceDetail = async (req: Request, res: Response) => {
  const { lid, speciesId } = parseOccurrenceRouteParams(req.params.lid, req.params.speciesId)
  const occurrence = await getOccurrenceByCompositeKey(lid, speciesId, req.user)

  if (!occurrence) {
    return res.status(404).json({ message: 'Occurrence not found' })
  }

  return res.status(200).send(fixBigInt(occurrence))
}
