import { Router } from 'express'
import { getAllReferences, getReferenceDetails, getReferenceTypes } from '../services/reference'

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
  if (!reference) return res.status(404).send()
  return res.status(200).send(reference)
})

export default router
