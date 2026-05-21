import { Request, Response, Router } from 'express'
import {
  getCrossSearchRawSql,
  getCrossSearchLocalitiesRawSql,
  parseAndValidateCrossSearchRouteParameters,
  CrossSearchRequestParameters,
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

const getValidatedValues = (parameters: CrossSearchRequestParameters) => {
  const { validationErrors, ...values } = parseAndValidateCrossSearchRouteParameters(parameters)
  const validatedValues = values
  if (validationErrors.length > 0) {
    return { validationErrors }
  }
  return { validatedValues }
}

const handleCrossSearchValidationError = (error: unknown, res: Response) => {
  if (error instanceof Error) return res.status(403).send({ error: error.message })
  return res.status(403).send('Unknown error')
}

const sendCrossSearchRows = async (req: Request, res: Response, parameters: CrossSearchRequestParameters) => {
  let parsedValues
  try {
    parsedValues = getValidatedValues(parameters)
  } catch (error) {
    return handleCrossSearchValidationError(error, res)
  }
  if ('validationErrors' in parsedValues) {
    return res.status(403).send(parsedValues.validationErrors)
  }

  try {
    const result = await getCrossSearchRawSql(
      req.user,
      parsedValues.validatedValues.validatedLimit,
      parsedValues.validatedValues.validatedOffset,
      parsedValues.validatedValues.validatedColumnFilters,
      parsedValues.validatedValues.validatedSorting
    )
    return res.status(200).send(fixBigInt(result))
  } catch (error) {
    return handleCrossSearchValidationError(error, res)
  }
}

const sendCrossSearchLocalities = async (req: Request, res: Response, parameters: CrossSearchRequestParameters) => {
  let parsedValues
  try {
    parsedValues = getValidatedValues(parameters)
  } catch (error) {
    return handleCrossSearchValidationError(error, res)
  }
  if ('validationErrors' in parsedValues) {
    return res.status(403).send(parsedValues.validationErrors)
  }

  try {
    const result = await getCrossSearchLocalitiesRawSql(
      req.user,
      parsedValues.validatedValues.validatedColumnFilters,
      parsedValues.validatedValues.validatedSorting
    )
    return res.status(200).send(fixBigInt(result))
  } catch (error) {
    return handleCrossSearchValidationError(error, res)
  }
}

router.post(`/all`, async (req, res) => {
  return sendCrossSearchRows(req, res, req.body as CrossSearchRequestParameters)
})

router.get(`/all/:limit/:offset/:columnfilters/:sorting`, async (req, res) => {
  return sendCrossSearchRows(req, res, {
    limit: req.params.limit,
    offset: req.params.offset,
    columnFilters: req.params.columnfilters,
    sorting: req.params.sorting,
  })
})

router.post(`/localities`, async (req, res) => {
  return sendCrossSearchLocalities(req, res, req.body as CrossSearchRequestParameters)
})

router.get(`/localities/:columnfilters/:sorting`, async (req, res) => {
  return sendCrossSearchLocalities(req, res, {
    columnFilters: req.params.columnfilters,
    sorting: req.params.sorting,
  })
})

const streamCrossSearchExport = async (req: Request, res: Response, parameters: CrossSearchRequestParameters) => {
  let parsedValues
  try {
    parsedValues = getValidatedValues(parameters)
  } catch (error) {
    return handleCrossSearchValidationError(error, res)
  }
  if ('validationErrors' in parsedValues) {
    return res.status(403).send(parsedValues.validationErrors)
  }

  let dataArray: Partial<CrossSearch[][]>
  try {
    dataArray = (await getCrossSearchRawSql(
      req.user,
      undefined,
      undefined,
      parsedValues.validatedValues.validatedColumnFilters,
      parsedValues.validatedValues.validatedSorting
    )) as Partial<CrossSearch[][]>
  } catch (error) {
    return handleCrossSearchValidationError(error, res)
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
}

router.post(`/export`, async (req, res) => {
  return streamCrossSearchExport(req, res, req.body as CrossSearchRequestParameters)
})

router.get(`/export/:columnfilters/:sorting`, async (req, res) => {
  return streamCrossSearchExport(req, res, {
    columnFilters: req.params.columnfilters,
    sorting: req.params.sorting,
  })
})

export default router
