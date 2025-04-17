import { Router } from 'express'
import { getCrossSearchRawSql, validateCrossSearchRouteParameters } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { ColumnFilter, SortingState } from '../services/queries/crossSearchQuery'
import { format } from '@fast-csv/format'
import { pipeline } from 'stream'
import { logger } from '../utils/logger'

const router = Router()

router.get(`/all/:limit/:offset/:columnfilters/:sorting`, async (req, res) => {
  let limit
  let offset
  let columnFilters
  let sorting
  try {
    limit = parseInt(req.params.limit)
    if (isNaN(limit)) throw new Error('Limit is not a number')
    offset = parseInt(req.params.offset)
    if (isNaN(offset)) throw new Error('Offset is not a number')
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

router.get(`/export/:columnfilters/:sorting`, async (req, res) => {
  let columnFilters
  let sorting
  let data
  try {
    columnFilters = JSON.parse(req.params.columnfilters) as unknown
    sorting = JSON.parse(req.params.sorting) as unknown
  } catch (error) {
    return res.status(403).send({ error: 'Parsing URL parameters failed' })
  }
  const validationErrors = validateCrossSearchRouteParameters({
    columnFilters,
    sorting,
  })
  if (validationErrors.length > 0) {
    return res.status(403).send(validationErrors)
  }

  try {
    data = await getCrossSearchRawSql(
      req.user,
      undefined,
      undefined,
      columnFilters as ColumnFilter[],
      sorting as SortingState[]
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }

  res.attachment('cross_search_export.csv')
  res.on('finish', () => {
    logger.info('Cross search export sent.')
  })

  // quoteColumns is needed to make sure linebreaks do not mess up the data
  const stream = format({ headers: true, quoteColumns: true })
  pipeline(stream, res, err => {
    if (err) {
      logger.error(`Error in crosssearch/export pipeline: ${err.message}`)
    }
  })

  for (const row of data) {
    stream.write(row)
  }
  return stream.end()
})

export default router
