import { Router } from 'express'
import { getAllTimeUnits, getTimeUnitDetails } from '../services/timeUnit'

const router = Router()

router.get('/all', async (_req, res) => {
  const time_units = await getAllTimeUnits()
  return res.status(200).send(time_units)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const time_unit = await getTimeUnitDetails(id)
  res.status(200).send(time_unit)
})

export default router