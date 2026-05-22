import { Request, RequestHandler, Response, Router } from 'express'
import { body, param, validationResult, ValidationChain } from 'express-validator'
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
const lineBreakPattern = /[\r\n]+/
const globalLineBreakPattern = /[\r\n]+/g

const parseArrayRouteParameter = (value: string, message: string) => {
  const parsedValue = JSON.parse(value) as unknown
  if (!Array.isArray(parsedValue)) throw new Error(message)
  return true
}

const handleRequestValidationErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const firstError = errors.array()[0]
  return res.status(403).send({ error: String(firstError.msg) })
}

const crossSearchBodyValidators: ValidationChain[] = [
  body('limit').optional().isInt().withMessage('Limit is not a number.'),
  body('offset').optional().isInt().withMessage('Offset is not a number.'),
  body('columnFilters').isArray().withMessage('ColumnFilters is not an array.'),
  body('sorting').isArray().withMessage('Sorting is not an array.'),
]

const crossSearchRowsRouteValidators: ValidationChain[] = [
  param('limit').isInt().withMessage('Limit is not a number.'),
  param('offset').isInt().withMessage('Offset is not a number.'),
  param('columnfilters').custom(value => parseArrayRouteParameter(value as string, 'ColumnFilters is not an array.')),
  param('sorting').custom(value => parseArrayRouteParameter(value as string, 'Sorting is not an array.')),
]

const crossSearchLocalitiesRouteValidators: ValidationChain[] = [
  param('columnfilters').custom(value => parseArrayRouteParameter(value as string, 'ColumnFilters is not an array.')),
  param('sorting').custom(value => parseArrayRouteParameter(value as string, 'Sorting is not an array.')),
]

const transformFunction = (row: CrossSearch) => {
  const transformedRow: { [key: string]: string | number | boolean | null } = {}
  const keys = Object.keys(row) as Array<keyof CrossSearch>
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string') {
      transformedRow[key] = lineBreakPattern.test(value) ? value.replace(globalLineBreakPattern, ' ') : value
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

router.post(`/all`, ...crossSearchBodyValidators, handleRequestValidationErrors, async (req, res) => {
  return sendCrossSearchRows(req, res, req.body as CrossSearchRequestParameters)
})

router.get(
  `/all/:limit/:offset/:columnfilters/:sorting`,
  ...crossSearchRowsRouteValidators,
  handleRequestValidationErrors,
  async (req, res) => {
    return sendCrossSearchRows(req, res, {
      limit: req.params.limit,
      offset: req.params.offset,
      columnFilters: req.params.columnfilters,
      sorting: req.params.sorting,
    })
  }
)

router.post(`/localities`, ...crossSearchBodyValidators, handleRequestValidationErrors, async (req, res) => {
  return sendCrossSearchLocalities(req, res, req.body as CrossSearchRequestParameters)
})

router.get(
  `/localities/:columnfilters/:sorting`,
  ...crossSearchLocalitiesRouteValidators,
  handleRequestValidationErrors,
  async (req, res) => {
    return sendCrossSearchLocalities(req, res, {
      columnFilters: req.params.columnfilters,
      sorting: req.params.sorting,
    })
  }
)

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

router.post(`/export`, ...crossSearchBodyValidators, handleRequestValidationErrors, async (req, res) => {
  return streamCrossSearchExport(req, res, req.body as CrossSearchRequestParameters)
})

router.get(
  `/export/:columnfilters/:sorting`,
  ...crossSearchLocalitiesRouteValidators,
  handleRequestValidationErrors,
  async (req, res) => {
    return streamCrossSearchExport(req, res, {
      columnFilters: req.params.columnfilters,
      sorting: req.params.sorting,
    })
  }
)

export default router
