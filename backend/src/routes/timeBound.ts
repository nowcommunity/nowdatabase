import { Router } from 'express'
import { getAllTimeBounds, getTimeBoundDetails } from '../services/timeBound'

const router = Router()

router.get('/all', async (_req, res) => {
  const time_bounds = await getAllTimeBounds()
  return res.status(200).send(time_bounds)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const time_bound = await getTimeBoundDetails(id)
  res.status(200).send(time_bound)
})

export default router
