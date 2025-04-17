import { CrossSearchRouteParameters } from '../types'
import { Validators, validator, ValidationError } from './validator'

const columnFilterCheck = (columnFilters: unknown) => {
  if (!Array.isArray(columnFilters)) return 'Column filters is not an array'
  for (const filter of columnFilters as Record<string, unknown>[]) {
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
  for (const sort of sorting as Record<string, unknown>[]) {
    if (!('id' in sort) || typeof sort.id !== 'string' || sort.id === '') {
      return 'Invalid or missing id field in sort object'
    }
    if (!('desc' in sort)) {
      return `Invalid or missing desc field in sort object`
    }
    if (typeof sort.desc !== 'boolean') {
      return 'desc field in sort object must be either true or false (boolean)'
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
      required: () => {
        // TODO: change this and offset to not use the parameters object, might not be possible without changing the way validators work
        if (typeof parameters.limit !== 'undefined' && typeof parameters.limit !== 'number')
          return 'Limit must be undefined or a number'

        return
      },
    },
    offset: {
      name: 'Offset',
      required: () => {
        if (typeof parameters.offset !== 'undefined' && typeof parameters.offset !== 'number')
          return 'Offset must be undefined or a number'
        return
      },
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
