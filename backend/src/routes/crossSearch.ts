import { Router } from 'express'
import { getCrossSearchRawSql } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get(`/all/:limit/:offset`, async (req, res) => {
  const limit = parseInt(req.params.limit)
  const offset = parseInt(req.params.offset)
  const result = await getCrossSearchRawSql(req.user, limit, offset)
  return res.status(200).send(fixBigInt(result))
})

router.get(`/all`, async (req, res) => {
  const result = await getCrossSearchRawSql(req.user)
  return res.status(200).send(fixBigInt(result))
})

export default router
