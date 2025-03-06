import { Router } from 'express'
import { getCrossSearchRawSql, validateCrossSearchRouteParameters } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { ColumnFilter, SortingState } from '../utils/sql'

const router = Router()

router.get(`/all/:limit/:offset/:columnfilters/:sorting`, async (req, res) => {
  const limit = parseInt(req.params.limit)
  const offset = parseInt(req.params.offset)
  const columnFilters = JSON.parse(req.params.columnfilters) as unknown
  const sorting = JSON.parse(req.params.sorting) as unknown
  const validationErrors = validateCrossSearchRouteParameters({ limit, offset, columnFilters, sorting })
  if (validationErrors.length > 0) {
    return res.status(403).send(validationErrors)
  }
  const result = await getCrossSearchRawSql(
    req.user,
    limit,
    offset,
    columnFilters as ColumnFilter[],
    sorting as SortingState[]
  )
  return res.status(200).send(fixBigInt(result))
})

router.get(`/all`, async (req, res) => {
  const result = await getCrossSearchRawSql(req.user)
  return res.status(200).send(fixBigInt(result))
})

export default router
