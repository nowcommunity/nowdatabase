import { Router } from 'express'
import { getCrossSearchRawSql, validateCrossSearchRouteParameters } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { ColumnFilter, SortingState } from '../services/queries/crossSearchQuery'

const router = Router()

router.get(`/all/:limit/:offset/:columnfilters/:sorting`, async (req, res) => {
  let limit
  let offset
  let columnFilters
  let sorting
  try {
    limit = parseInt(req.params.limit)
    offset = parseInt(req.params.offset)
    columnFilters = JSON.parse(req.params.columnfilters) as unknown
    sorting = JSON.parse(req.params.sorting) as unknown
  } catch (error) {
    return res.status(403).send({ error: 'Parsing URL parameters failed' })
  }
  const validationErrors = validateCrossSearchRouteParameters({ limit, offset, columnFilters, sorting })
  if (validationErrors.length > 0) {
    return res.status(403).send(validationErrors)
  }
  try {
    const result = await getCrossSearchRawSql(
      req.user,
      limit,
      offset,
      columnFilters as ColumnFilter[],
      sorting as SortingState[]
    )
    return res.status(200).send(fixBigInt(result))
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }
})

router.get(`/all`, async (req, res) => {
  const result = await getCrossSearchRawSql(req.user)
  return res.status(200).send(fixBigInt(result))
})

export default router
