import { Router } from 'express'
import { getAllRegions, getRegionDetails } from '../services/region'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'

const router = Router()

router.get('/all', async (_req, res) => {
  const regions = await getAllRegions()
  return res.status(200).send(regions)
})

router.get('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  const region = await getRegionDetails(id)
  if (!region) return res.status(404).send()
  return res.status(200).send(region)
})

export default router
