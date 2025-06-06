import { Router } from 'express'
import { getAllSedimentaryStructures } from '../services/sedimentaryStructure'

const router = Router()

router.get('/all', async (_req, res) => {
  const sedimentaryStructures = await getAllSedimentaryStructures()
  return res.status(200).send(sedimentaryStructures)
})

export default router
