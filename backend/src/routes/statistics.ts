import { Router } from 'express'
import { getLocalityStatistics, getSpeciesStatistics, getStatistics } from '../services/statistics'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/', async (_req, res) => {
  const statistics = await getStatistics()
  return res.status(200).send(fixBigInt(statistics))
})

router.get('/locality', async (_req, res) => {
  const statistics = await getLocalityStatistics()
  return res.status(200).send(fixBigInt(statistics))
})

router.get('/species', async (_req, res) => {
  const statistics = await getSpeciesStatistics()
  return res.status(200).send(fixBigInt(statistics))
})

export default router
