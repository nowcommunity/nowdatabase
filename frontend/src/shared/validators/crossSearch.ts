import { CrossSearchRouteParameters } from '../types'
import { Validators, validator, ValidationError } from './validator'

const columnFilterCheck = (columnFilters: unknown) => {
  if (!Array.isArray(columnFilters)) return 'Column filters is not an array'
  for (const filter of columnFilters) {
    if (!(typeof filter === 'object' && !Array.isArray(filter) && filter !== null)) return 'Filters have to be objects'
    if (!('id' in filter) || typeof filter.id !== 'string' || filter.id === '') {
      return 'Invalid or missing id field in filter'
    }
    if (!('value' in filter) || typeof filter.value !== 'string' || filter.value === '') {
      return 'Invalid or missing value field in filter'
    }
  }
  return null as ValidationError
}

const sortingCheck = (sorting: unknown) => {
  if (!Array.isArray(sorting)) return 'Sorting is not an array'
  for (const sort of sorting) {
    if (!(typeof sort === 'object' && !Array.isArray(sort) && sort !== null))
      return 'Items inside sorting list have to be objects'
    if (!('id' in sort) || typeof sort.id !== 'string' || sort.id === '') {
      return 'Invalid or missing id field in sort object'
    }
    if (!('desc' in sort)) {
      return `Invalid or missing desc field in sort object`
    }
    if (sort.desc !== 'false' && sort.desc !== 'true') {
      return 'desc field in must be either "true" or "false" (string)'
    }
  }
  return null as ValidationError
}

export const validateCrossSearchRouteParams = (
  parameters: CrossSearchRouteParameters,
  fieldName: keyof CrossSearchRouteParameters
) => {
  const validators: Validators<Partial<CrossSearchRouteParameters>> = {
    limit: {
      name: 'Limit',
      required: true,
    },
    offset: {
      name: 'Offset',
      required: true,
    },
    columnFilters: {
      name: 'Column Filters',
      miscArray: columnFilterCheck,
    },
    sorting: {
      name: 'Sorting',
      miscArray: sortingCheck,
    },
  }

  return validator<CrossSearchRouteParameters>(validators, parameters, fieldName)
}
