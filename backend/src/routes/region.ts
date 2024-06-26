import { Router } from 'express'
import { getAllRegions, getRegionDetails } from '../services/region'

const router = Router()

router.get('/all', async (_req, res) => {
  const regions = await getAllRegions()
  return res.status(200).send(regions)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const region = await getRegionDetails(id)
  res.status(200).send(region)
})

export default router
