import { Router } from 'express'
import { getCrossSearchRawSql, parseAndValidateCrossSearchRouteParameters } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { format } from '@fast-csv/format'
import { pipeline } from 'stream'
import { logger } from '../utils/logger'

const router = Router()

router.get(`/all/:limit/:offset/:columnfilters/:sorting`, async (req, res) => {
  let validatedValues
  try {
    const { validationErrors, ...values } = parseAndValidateCrossSearchRouteParameters({
      limit: req.params.limit,
      offset: req.params.offset,
      columnFilters: req.params.columnfilters,
      sorting: req.params.sorting,
    })
    validatedValues = values
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
  } catch (error) {
    return res.status(403).send({ error: error })
  }
  try {
    const result = await getCrossSearchRawSql(
      req.user,
      validatedValues.validatedLimit,
      validatedValues.validatedOffset,
      validatedValues.validatedColumnFilters,
      validatedValues.validatedSorting
    )
    return res.status(200).send(fixBigInt(result))
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }
})

router.get(`/export/:columnfilters/:sorting`, async (req, res) => {
  let validatedValues
  let data
  try {
    const { validationErrors, ...values } = parseAndValidateCrossSearchRouteParameters({
      columnFilters: req.params.columnfilters,
      sorting: req.params.sorting,
    })
    validatedValues = values
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
  } catch (error) {
    return res.status(403).send({ error: error })
  }
  try {
    data = await getCrossSearchRawSql(
      req.user,
      undefined,
      undefined,
      validatedValues.validatedColumnFilters,
      validatedValues.validatedSorting
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
