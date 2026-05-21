import { RequestHandler } from 'express'
import { query, validationResult, ValidationChain } from 'express-validator'

type TabListQueryValidationOptions = {
  allowedSortingColumns: string[]
  allowServerColumnFilters?: boolean
}

const getSingleQueryValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return undefined
}

const parseJsonQueryValue = (value: unknown, errorMessage: string) => {
  const singleValue = getSingleQueryValue(value)
  if (!singleValue) return undefined

  try {
    return JSON.parse(singleValue) as unknown
  } catch {
    throw new Error(errorMessage)
  }
}

const validateWholeNumber = (fieldName: 'limit' | 'offset', value: unknown) => {
  const singleValue = getSingleQueryValue(value)
  if (!singleValue) return true
  if (!/^\d+$/.test(singleValue)) throw new Error(`${fieldName} must be a non-negative integer.`)

  const parsedValue = parseInt(singleValue, 10)
  if (fieldName === 'limit' && (parsedValue < 1 || parsedValue > 500)) {
    throw new Error('limit must be between 1 and 500.')
  }

  return true
}

const validateSorting = (value: unknown, allowedSortingColumns: string[]) => {
  const parsedValue = parseJsonQueryValue(value, 'sorting must be valid JSON.')
  if (parsedValue === undefined) return true
  if (!Array.isArray(parsedValue)) throw new Error('sorting must be a JSON array.')

  for (const entry of parsedValue) {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error('sorting entries must be objects.')
    }

    const candidate = entry as { id?: unknown; desc?: unknown }
    if (typeof candidate.id !== 'string' || !allowedSortingColumns.includes(candidate.id)) {
      throw new Error(`sorting.id must be one of: ${allowedSortingColumns.join(', ')}.`)
    }

    if (candidate.desc !== undefined && typeof candidate.desc !== 'boolean') {
      throw new Error('sorting.desc must be boolean when provided.')
    }
  }

  return true
}

const validateColumnFilters = (value: unknown, allowServerColumnFilters: boolean) => {
  const parsedValue = parseJsonQueryValue(value, 'columnfilters must be valid JSON.')
  if (parsedValue === undefined) return true
  if (!Array.isArray(parsedValue)) throw new Error('columnfilters must be a JSON array.')

  if (!allowServerColumnFilters && parsedValue.length > 0) {
    throw new Error('Server-side columnfilters are not supported for this endpoint. Use client-side filtering.')
  }

  return true
}

const validatePagination = (value: unknown) => {
  const parsedValue = parseJsonQueryValue(value, 'pagination must be valid JSON.')
  if (parsedValue === undefined) return true
  if (typeof parsedValue !== 'object' || parsedValue === null) throw new Error('pagination must be a JSON object.')

  const candidate = parsedValue as { pageIndex?: unknown; pageSize?: unknown }
  if (!Number.isInteger(candidate.pageIndex) || (candidate.pageIndex as number) < 0) {
    throw new Error('pagination.pageIndex must be a non-negative integer.')
  }

  if (
    !Number.isInteger(candidate.pageSize) ||
    (candidate.pageSize as number) < 1 ||
    (candidate.pageSize as number) > 500
  ) {
    throw new Error('pagination.pageSize must be an integer between 1 and 500.')
  }

  return true
}

const handleTabListValidationErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  return res.status(400).send({
    message: 'Invalid query parameters',
    errors: errors.array().map(error => String(error.msg)),
  })
}

export const validateTabListQuery = ({
  allowedSortingColumns,
  allowServerColumnFilters = false,
}: TabListQueryValidationOptions): Array<ValidationChain | RequestHandler> => [
  query('sorting').custom(value => validateSorting(value, allowedSortingColumns)),
  query('columnfilters').custom(value => validateColumnFilters(value, allowServerColumnFilters)),
  query('columnFilters').custom(value => validateColumnFilters(value, allowServerColumnFilters)),
  query('limit').custom(value => validateWholeNumber('limit', value)),
  query('offset').custom(value => validateWholeNumber('offset', value)),
  query('pagination').custom(validatePagination),
  handleTabListValidationErrors,
]
