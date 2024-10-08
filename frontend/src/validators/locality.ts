import { EditDataType, LocalityDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'
import { validCountries } from './countryList'

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
    bfa_min_abs: {
      name: 'Basis for age (Absolute, min)',
      required: editData.date_meth === 'absolute',
    },
    bfa_max_abs: {
      name: 'Basis for age (Absolute, max)',
      required: editData.date_meth === 'absolute',
    },
    bfa_min: {
      name: 'Basis for age (Time unit, min)',
      required: editData.date_meth === 'time_unit',
    },
    bfa_max: {
      name: 'Basis for age (Time unit, max)',
      required: editData.date_meth === 'time_unit',
    },
    loc_name: {
      name: 'Locality name',
      required: true,
    },
    country: {
      name: 'Country',
      required: true,
      asString: (countryName: string) => {
        if (!validCountries.includes(countryName)) return 'Country is not valid'
        return
      },
    },
    date_meth: {
      name: 'Dating method',
    },
    dms_lat: {
      name: 'Latitude (dms)',
      required: true,
    },
    dec_lat: {
      name: 'Latitude (dec)',
      required: true,
      asNumber: (num: number) => {
        if (num < -90 || num > 90) return 'Latitude dec must be between -90 and 90'
        return
      },
    },
    dms_long: {
      name: 'Longitude (dms)',
      required: true,
    },
    dec_long: {
      name: 'Longitude (dec)',
      required: true,
      asNumber: (num: number) => {
        if (num < -180 || num > 180) return 'Longitude dec must be between -180 and 180'
        return
      },
    },
  }

  return validator<EditDataType<LocalityDetailsType>>(validators, editData, fieldName)
}
