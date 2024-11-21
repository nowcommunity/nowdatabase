import { Router } from 'express'
import { getCrossSearchRawSql } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get(`/all`, async (req, res) => {
  const result = await getCrossSearchRawSql(req.user)
  return res.status(200).send(fixBigInt(result))
})

export default router
