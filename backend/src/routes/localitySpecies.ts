import { Request, Router } from 'express'
import { getLocalitySpeciesList } from '../services/localitySpeciesExport'

const router = Router()

router.post('/', async (req: Request<object, object, { lids: number[] }>, res) => {
  const user = req.user
  const lids = req.body.lids
  if (!lids) return res.status(400).send({ message: 'Missing lids' })
  const exportList = await getLocalitySpeciesList(lids, user, res)
  return res.status(200).json(exportList)
})

export default router
