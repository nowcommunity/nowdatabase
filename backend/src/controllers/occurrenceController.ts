import { Request, Response } from 'express'
import { getOccurrenceByCompositeKey, parseOccurrenceRouteParams } from '../services/occurrenceService'
import { fixBigInt } from '../utils/common'
import { EditMetaData, EditableOccurrenceData } from '../../../frontend/src/shared/types'
import { updateOccurrenceByCompositeKey } from '../services/write/occurrence'

type OccurrenceRouteParams = {
  lid: string
  speciesId: string
}

export const getOccurrenceDetail = async (req: Request<OccurrenceRouteParams>, res: Response) => {
  let occurrence
  try {
    const { lid, speciesId } = parseOccurrenceRouteParams(req.params.lid, req.params.speciesId)
    occurrence = await getOccurrenceByCompositeKey(lid, speciesId, req.user)
  } catch (e) {
    return res.status(400).send({ message: 'Unknown error' })
  }

  if (!occurrence) {
    return res.status(404).json({ message: 'Occurrence not found' })
  }

  return res.status(200).send(fixBigInt(occurrence))
}

export const updateOccurrenceDetail = async (
  req: Request<OccurrenceRouteParams, object, { occurrence?: EditableOccurrenceData & EditMetaData }>,
  res: Response
) => {
  const { lid, speciesId } = parseOccurrenceRouteParams(req.params.lid, req.params.speciesId)

  const occurrencePayload: EditableOccurrenceData & EditMetaData = req.body.occurrence ?? {}
  const updatedOccurrence = await updateOccurrenceByCompositeKey(lid, speciesId, occurrencePayload, req.user)

  if (!updatedOccurrence) {
    return res.status(404).json({ message: 'Occurrence not found' })
  }

  return res.status(200).send(fixBigInt(updatedOccurrence))
}
