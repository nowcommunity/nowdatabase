import { Router } from 'express'
import { getAllTimeBounds, getTimeBoundDetails, getTimeBoundTimeUnits } from '../services/timeBound'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (_req, res) => {
  const time_bounds = await getAllTimeBounds()
  return res.status(200).send(time_bounds)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const time_bound = await getTimeBoundDetails(id)
  res.status(200).send(time_bound)
})

router.get('/time-units/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const timeUnits = await getTimeBoundTimeUnits(id)
  return res.status(200).send(fixBigInt(timeUnits))
})

export default router
