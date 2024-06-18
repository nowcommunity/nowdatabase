import { EditDataType, TimeBoundDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateTimeBound = (
  editData: EditDataType<TimeBoundDetailsType>,
  fieldName: keyof TimeBoundDetailsType
) => {
  const validators: Validators<EditDataType<TimeBoundDetailsType>> = {
    b_name: {
      name: 'Locality name',
    },
  }

  const returnval = validator<EditDataType<TimeBoundDetailsType>>(validators, editData, fieldName)
  return returnval
}
