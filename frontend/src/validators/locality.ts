import { EditDataType, LocalityDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateLocality = (
  editData: EditDataType<LocalityDetailsType>,
  fieldName: keyof EditDataType<LocalityDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<LocalityDetailsType>>> = {
    // const isNew = editData.lid === undefined
    max_age: {
      name: 'Age (max)',
      required: true,
      asNumber: (num: number) => {
        if (editData.min_age && num < editData.min_age) return 'Max value cannot be lower than min'
        if (num < 0) return 'Max value must be a positive real value'
        return
      },
    },
    min_age: {
      name: 'Age (min)',
      required: true,
      asNumber: (num: number) => {
        if (editData.max_age && num > editData.max_age) return 'Min value cannot be higher than max'
        if (num < 0) return 'Min value must be a positive real value'
        return
      },
    },
    loc_name: {
      name: 'Locality name',
      required: true,
    },
    country: {
      name: 'Country',
      required: true,
    },
    date_meth: {
      name: 'Dating method',
    },
    dms_lat: {
      name: 'Latitude',
      required: true,
    },
    dec_lat: {
      name: 'Latitude',
      required: true,
    },
    dms_long: {
      name: 'Longitude',
      required: true,
    },
    dec_long: {
      name: 'Latitude',
      required: true,
    },
  }

  return validator<EditDataType<LocalityDetailsType>>(validators, editData, fieldName)
}
