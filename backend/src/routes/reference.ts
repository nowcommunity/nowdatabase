import { Router } from 'express'
import { getAllReferences, getReferenceDetails } from '../services/reference'

const router = Router()

router.get('/all', async (_req, res) => {
  const references = await getAllReferences()
  return res.status(200).send(references)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const reference = await getReferenceDetails(id)
  res.status(200).send(reference)
})

export default router
