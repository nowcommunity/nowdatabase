import { Router } from 'express'
import { getAllMuseums, getMuseumDetails } from '../services/museum'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (_req, res) => {
  const museums = await getAllMuseums()
  return res.status(200).send(museums)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const museum = await getMuseumDetails(id)
  if (!museum) return res.status(404).send()
  return res.status(200).send(fixBigInt(museum))
})

export default router
