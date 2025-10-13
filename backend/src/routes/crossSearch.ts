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
import { once } from 'events'

const router = Router()

const transformFunction = (row: CrossSearch & { full_count?: number }) => {
  const transformedRow: { [key: string]: string | number | boolean | null } = {}
  const keys = Object.keys(row) as Array<keyof (CrossSearch & { full_count?: number })>
  for (const key of keys) {
    if (key === 'full_count') {
      delete row['full_count']
      continue
    }
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

  let dataArray: Partial<CrossSearch[][]>
  try {
    dataArray = (await getCrossSearchRawSql(
      req.user,
      undefined,
      undefined,
      validatedValues.validatedColumnFilters,
      validatedValues.validatedSorting
    )) as Partial<CrossSearch[][]>
  } catch (error) {
    if (error instanceof Error) return res.status(403).send({ error: error.message })
    return res.status(403).send('Unknown error')
  }

  res.on('finish', () => {
    logger.info('Cross search export sent.')
  })
  res.on('error', () => {
    logger.info('ERROR!')
  })
  res.attachment(`cross_search${currentDateAsString()}.csv`) // filename will get overwritten in frontend when fetching data from this route

  // this should match the csvConfig in frontend exportRows() function as closely as possible
  const stream = format({ delimiter: ',', headers: true, quoteColumns: true }).transform(
    transformFunction as FormatterRowTransformFunction<FormatterRow, FormatterRow>
  )

  pipeline(stream, res, err => {
    if (err) {
      logger.error(`Error in crosssearch/export pipeline: ${err.message}`)
    } else {
      logger.info('Cross search pipeline finished.')
    }
  })

  try {
    for (const data of dataArray) {
      if (data) {
        for (const row of data) {
          const ok = stream.write(row)
          if (!ok) {
            await once(stream, 'drain')
          }
        }
      }
    }
  } catch (error) {
    logger.error(
      'Error in crosssearch/export: Could not write to stream, user might have left the page or refreshed it.'
    )
  }

  return stream.end()
})

export default router
