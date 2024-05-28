import { LocalityDetails } from '../backendTypes'

export const validateLocality = (editData: LocalityDetails, fieldName: keyof LocalityDetails) => {
  const getValidator: {
    [K in keyof LocalityDetails]?: (val: unknown) => string | null
  } = {
    bfa_max_abs: (value: unknown) => {
      if (typeof value !== 'number') return 'Must be a number'
      if (value < parseInt(editData.bfa_min_abs ?? '0')) return 'Value cannot be smaller than basis for age (min)'
      return null
    },
    bfa_min_abs: (value: unknown) => {
      if (typeof value !== 'number') return 'Must be a number'
      if (value > parseInt(editData.bfa_min_abs ?? '99999999'))
        return 'Value cannot be greater than basis for age (max)'
      return null
    },
    min_age: (value: unknown) => {
      if (typeof value !== 'number') return 'Must be a number'
      if (value > editData.max_age) return 'Must be smaller than max age'
      return null
    },
    max_age: (value: unknown) => {
      if (typeof value !== 'number') return 'Must be a number'
      if (value < editData.min_age) return 'Must be greater than min_age'
      return null
    },
  }
  const validator = getValidator[fieldName]
  if (validator === undefined) return null
  return validator(editData[fieldName])
}
