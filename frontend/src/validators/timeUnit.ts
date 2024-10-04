import { EditDataType, TimeUnitDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateTimeUnit = (editData: EditDataType<TimeUnitDetailsType>, fieldName: keyof TimeUnitDetailsType) => {
  const validators: Validators<EditDataType<Partial<TimeUnitDetailsType>>> = {
    tu_display_name: {
      name: 'Name',
      required: true,
    },
    sequence: {
      name: 'Sequence',
      required: true,
    },
    up_bnd: {
      name: 'New Upper Bound',
      required: true,
      asNumber: true,
    },
    low_bnd: {
      name: 'New Lower Bound',
      required: true,
      asNumber: true,
    },
  }

  return validator<EditDataType<TimeUnitDetailsType>>(validators, editData, fieldName)
}
