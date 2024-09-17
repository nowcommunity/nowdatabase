import { Router } from 'express'
import { getAllCrossSearch } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (req, res) => {
  const crossSearch = await getAllCrossSearch(req.user)
  return res.status(200).send(fixBigInt(crossSearch))
})

export default router
