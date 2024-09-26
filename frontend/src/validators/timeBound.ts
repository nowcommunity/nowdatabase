import { EditDataType, TimeBoundDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateTimeBound = (
  editData: EditDataType<TimeBoundDetailsType>,
  fieldName: keyof TimeBoundDetailsType
) => {
  const validators: Validators<EditDataType<Partial<TimeBoundDetailsType>>> = {
    b_name: {
      name: 'Name',
      required: true,
    },
    age: {
      name: 'Age (Ma)',
      required: true,
      asNumber: true,
    },
  }

  return validator<EditDataType<TimeBoundDetailsType>>(validators, editData, fieldName)
}
