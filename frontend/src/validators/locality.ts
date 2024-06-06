import { EditDataType, LocalityDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateLocality = (
  editData: EditDataType<LocalityDetailsType>,
  fieldName: keyof EditDataType<LocalityDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<LocalityDetailsType>>> = {
    max_age: {
      name: 'Age (max)',
      asNumber: (num: number) => {
        const min_age = editData.min_age
        if (!min_age) return
        if (num < parseInt(min_age)) return 'Max value cannot be lower than min'
        return null
      },
    },
    min_age: {
      name: 'Age (min)',
      asNumber: (num: number) => {
        const max_age = editData.max_age
        if (!max_age) return
        if (num > parseInt(max_age)) return 'Min value cannot be higher than max'
        return null
      },
    },
    loc_name: {
      name: 'Locality name',
    },
    date_meth: {
      name: 'Dating method',
    },
  }

  const returnval = validator<EditDataType<LocalityDetailsType>>(validators, editData, fieldName)
  return returnval
}
