import { Router } from 'express'
import { getCrossSearchRawSql } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { ColumnFilter } from '../utils/sql'

const router = Router()

router.get(`/all/:limit/:offset/:columnfilters`, async (req, res) => {
  const limit = parseInt(req.params.limit)
  const offset = parseInt(req.params.offset)
  const columnFilters = JSON.parse(req.params.columnfilters) as ColumnFilter[]
  const result = await getCrossSearchRawSql(req.user, limit, offset, columnFilters)
  return res.status(200).send(fixBigInt(result))
})

router.get(`/all`, async (req, res) => {
  const result = await getCrossSearchRawSql(req.user)
  return res.status(200).send(fixBigInt(result))
})

export default router
