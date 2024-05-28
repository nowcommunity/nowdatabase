import { LocalityDetails } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateLocality = (editData: LocalityDetails, fieldName: keyof LocalityDetails) => {
  const validators: Validators<Partial<LocalityDetails>> = {
    bfa_max_abs: {
      name: 'Basis for age (absolute)',
      asNumber: (num: number) => {
        if (num < parseInt(editData.bfa_min_abs ?? '0')) return 'Max value cannot be lower than min'
        return
      },
    },
    bfa_min_abs: {
      name: 'Basis for age (minimum)',
      asNumber: (num: number) => {
        const bfa_max_abs = editData.bfa_max_abs
        if (!bfa_max_abs) return
        if (parseInt(bfa_max_abs) > num) return 'Min value cannot be higher than max'
        return
      },
    },
  }

  return validator(validators, editData, fieldName)
}
