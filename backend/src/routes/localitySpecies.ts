import { Request, Router } from 'express'
import { getLocalitySpeciesList } from '../services/locality'

const router = Router()

router.post('/', async (req: Request<object, object, { lids: number[] }>, res) => {
  const user = req.user
  const lids = req.body.lids
  if (!lids) return res.status(400).send({ message: 'Missing lids' })
  await getLocalitySpeciesList(lids, user, res)
  return res.status(200).end()
})

export default router
