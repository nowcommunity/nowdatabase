import { EditDataType, TimeBoundDetailsType } from '../types'
import { Validators, validator } from './validator'

export const validateTimeBound = (
  editData: EditDataType<TimeBoundDetailsType>,
  fieldName?: keyof TimeBoundDetailsType
) => {
  const validators: Validators<EditDataType<Partial<TimeBoundDetailsType>>> = {
    b_name: {
      name: 'Name',
      required: true,
    },
    age: {
      name: 'Age (Ma)',
      required: true,
      asNumber: (num: number) => {
        if (num < 0) return 'Age must be a positive number'
        return
      },
    },
  }

  return validator<EditDataType<TimeBoundDetailsType>>(validators, editData, fieldName)
}
