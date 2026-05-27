import { EditDataType, TimeBoundDetailsType } from '../types'
import { Validators, validateFields, validator } from './validator'

export const timeBoundValidators: Validators<EditDataType<Partial<TimeBoundDetailsType>>> = {
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

export const validateTimeBound = (
  editData: EditDataType<TimeBoundDetailsType>,
  fieldName: keyof TimeBoundDetailsType
) => validator<EditDataType<TimeBoundDetailsType>>(timeBoundValidators, editData, fieldName)

export const validateTimeBoundFields = (editData: Partial<EditDataType<TimeBoundDetailsType>>) =>
  validateFields<EditDataType<TimeBoundDetailsType>>(timeBoundValidators, editData)
