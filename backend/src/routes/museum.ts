import { Router } from 'express'
import { getAllMuseums } from '../services/museum'

const router = Router()

router.get('/all', async (_req, res) => {
  const museums = await getAllMuseums()
  return res.status(200).send(museums)
})

export default router
