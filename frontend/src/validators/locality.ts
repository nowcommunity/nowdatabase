/* eslint-disable @typescript-eslint/no-unused-vars */
import { LocalityDetails } from '@/backendTypes'

export const validateLocality = (editData: LocalityDetails, fieldName: keyof LocalityDetails) => {
  const getValidator: { [K in keyof LocalityDetails]?: (arg: unknown) => string | null } = {
    bfa_max_abs: (_value: unknown) => {
      return 'ERROR'
    },
    bfa_min_abs: (_value: unknown) => {
      return null
    },
  }

  const validator = getValidator[fieldName]
  if (!validator) return null
  return validator(editData[fieldName])
}
