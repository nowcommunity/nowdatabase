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
    up_bound: {
      name: 'Upper Bound',
      required: true,
      miscCheck: () => {
        if (editData.low_bound && editData.low_bound.age! < editData.up_bound!.age!)
          return 'Upper bound age has to be lower than lower bound age'
        return
      },
    },
    low_bound: {
      name: 'Lower Bound',
      required: true,
      miscCheck: () => {
        if (editData.up_bound && editData.up_bound.age! > editData.low_bound!.age!)
          return 'Lower bound age has to be higher than upper bound age'
        return
      },
    },
  }
  return validator<EditDataType<TimeUnitDetailsType>>(validators, editData, fieldName)
}
