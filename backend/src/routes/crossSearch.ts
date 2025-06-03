import { Router } from 'express'
import {
  getCrossSearchRawSql,
  getCrossSearchLocalitiesRawSql,
  parseAndValidateCrossSearchRouteParameters,
} from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { format, FormatterRow, FormatterRowTransformFunction } from 'fast-csv'
import { pipeline } from 'stream'
import { logger } from '../utils/logger'
import { currentDateAsString } from '../../../frontend/src/shared/currentDateAsString'
import { CrossSearch } from '../../../frontend/src/shared/types'

const router = Router()

const transformFunction = (row: CrossSearch) => {
  const transformedRow: { [key: string]: string | number | boolean | null } = {}
  const keys = Object.keys(row) as Array<keyof CrossSearch>
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string') {
      transformedRow[key] = value.replace(/[\r\n]+/g, ' ')
    } else {
      transformedRow[key] = row[key]
    }
  }
  return transformedRow
}

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
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
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
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }
})

router.get(`/localities/:columnfilters/:sorting`, async (req, res) => {
  let validatedValues
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
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }

  try {
    const result = await getCrossSearchLocalitiesRawSql(
      req.user,
      validatedValues.validatedColumnFilters,
      validatedValues.validatedSorting
    )
    return res.status(200).send(fixBigInt(result))
  } catch (error) {
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }
})

router.get(`/export/:columnfilters/:sorting`, async (req, res) => {
  let validatedValues
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
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }

  let data
  try {
    data = await getCrossSearchRawSql(
      req.user,
      undefined,
      undefined,
      validatedValues.validatedColumnFilters,
      validatedValues.validatedSorting
    )
  } catch (error) {
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }

  res.attachment(`cross_search${currentDateAsString()}.csv`) // filename will get overwritten in frontend when fetching data from this route
  res.on('finish', () => {
    logger.info('Cross search export sent.')
  })
  // quoteColumns is needed to make sure linebreaks do not mess up the data
  const stream = format({ headers: true, quoteColumns: true }).transform(
    transformFunction as FormatterRowTransformFunction<FormatterRow, FormatterRow>
  )

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
