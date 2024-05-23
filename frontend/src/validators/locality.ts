/* eslint-disable @typescript-eslint/no-unused-vars */
import { LocalityDetails } from '../backendTypes'

export const validateLocality = (editData: LocalityDetails, fieldName: keyof LocalityDetails) => {
  const getValidator: {
    [K in keyof LocalityDetails]?: (arg: unknown) => string | null
  } = {
    bfa_max_abs: (value: unknown) => {
      if (!value) return null
      if (typeof value !== 'string') return 'error'
      if (Number.isNaN(parseInt(value))) return 'Must be a number'
      const number = parseInt(value)
      if (number < parseInt(editData.bfa_min_abs ?? '0')) return 'Value cannot be smaller'
      return null
    },
    bfa_min_abs: (_value: unknown) => {
      return null
    },
    min_age: (value: unknown) => {
      if (!value) return null
      if (typeof value !== 'string') return 'error'
      if (Number.isNaN(parseInt(value))) return 'Must be a number'
      const number = parseInt(value)
      if (number > editData.max_age) return 'Min age must be smaller than max age'
      return null
    },
  }

  const validator = getValidator[fieldName]
  if (!validator) return null
  return validator(editData[fieldName])
}
