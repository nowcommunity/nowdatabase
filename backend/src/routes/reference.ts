import { Request, Router } from 'express'
import { getAllReferences, getReferenceDetails, getReferenceTypes } from '../services/reference'
import { EditDataType, TimeBoundDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'

const router = Router()

router.get('/all', async (_req, res) => {
  const references = await getAllReferences()
  return res.status(200).send(references)
})

router.get('/types', async (_req, res) => {
  const referenceTypes = await getReferenceTypes()
  res.status(200).send(referenceTypes)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const reference = await getReferenceDetails(id)
  res.status(200).send(reference)
})

router.put('/', async (req: Request<object, object, { reference: EditDataType<TimeBoundDetailsType> }>, res) => {
  const editedLocality = req.body.reference
  const result = await write(editedLocality, 'ref_ref')
  return res.status(200).send(result ? { result: result } : { error: 'error' })
})

export default router
