import { EditDataType, LocalityDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateLocality = (
  editData: EditDataType<LocalityDetailsType>,
  fieldName: keyof EditDataType<LocalityDetailsType>,
  isNew: boolean
) => {
  const validators: Validators<Partial<EditDataType<LocalityDetailsType>>> = {
    max_age: {
      name: 'Age (max)',
      asNumber: (num: number) => {
        // eslint-disable-next-line no-console
        if (isNew) console.log('Is new') // TODO remove
        if (editData.min_age && num < editData.min_age) return 'Max value cannot be lower than min'
        return
      },
    },
    min_age: {
      name: 'Age (min)',
      asNumber: (num: number) => {
        if (editData.max_age && num > editData.max_age) return 'Min value cannot be higher than max'
        return
      },
    },
    loc_name: {
      name: 'Locality name',
    },
    date_meth: {
      name: 'Dating method',
    },
  }

  return validator<EditDataType<LocalityDetailsType>>(validators, editData, fieldName)
}
