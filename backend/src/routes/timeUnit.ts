import { Router } from 'express'
import { getAllTimeUnits, getTimeUnitDetails, getTimeUnitLocalities } from '../services/timeUnit'
import { fixBigInt } from '../utils/common'

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

router.get('/localities/:id', async (req, res) => {
  const id = req.params.id
  const localities = await getTimeUnitLocalities(id)
  return res.status(200).send(fixBigInt(localities))
})

export default router
