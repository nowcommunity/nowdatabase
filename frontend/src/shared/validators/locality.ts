import { EditDataType, LocalityDetailsType } from '../types'
import { Validators, validator } from './validator'
import { validCountries } from './countryList'

export const validateLocality = (
  editData: EditDataType<LocalityDetailsType>,
  fieldName?: keyof EditDataType<LocalityDetailsType>
) => {
  const compositeDatingMethodNoBases =
    editData.date_meth === 'composite' &&
    !editData.bfa_min &&
    !editData.bfa_min_abs &&
    !editData.bfa_max &&
    !editData.bfa_max_abs

  const compositeDatingMethodRequiredText = 'One age row must follow the rules for Absolute, the other for Time Unit'

  const isNew = editData.lid === undefined

  const validators: Validators<Partial<EditDataType<LocalityDetailsType>>> = {
    date_meth: {
      name: 'Dating method',
      required: true,
    },
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
      required: () => {
        if (editData.date_meth === 'absolute' || (editData.date_meth === 'composite' && !!editData.bfa_max))
          return 'This field is required'
        if (compositeDatingMethodNoBases) return compositeDatingMethodRequiredText
        return
      },
    },
    bfa_max_abs: {
      name: 'Basis for age (Absolute, max)',
      required: () => {
        if (editData.date_meth === 'absolute' || (editData.date_meth === 'composite' && !!editData.bfa_min))
          return 'This field is required'
        if (compositeDatingMethodNoBases) return compositeDatingMethodRequiredText
        return
      },
    },
    bfa_min: {
      name: 'Basis for age (Time unit, min)',
      required: () => {
        if (editData.date_meth === 'time_unit' || (editData.date_meth === 'composite' && !!editData.bfa_max_abs))
          return 'This field is required'
        if (compositeDatingMethodNoBases) return compositeDatingMethodRequiredText
        return
      },
    },
    bfa_max: {
      name: 'Basis for age (Time unit, max)',
      required: () => {
        if (editData.date_meth === 'time_unit' || (editData.date_meth === 'composite' && !!editData.bfa_min_abs))
          return 'This field is required'
        if (compositeDatingMethodNoBases) return compositeDatingMethodRequiredText
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
      asString: (countryName: string) => {
        if (!validCountries.includes(countryName)) return 'Country is not valid'
        return
      },
    },
    dms_lat: {
      name: 'Latitude (dms)',
      required: true,
      asString: (dms_lat: string) => {
        const dmsLatRegEx = /^(\d{1,3}) (\d{1,2}) (\d{1,2}) ([NS])$/
        if (!dmsLatRegEx.test(dms_lat)) return 'Must be in the format DD(D) M(M) S(S) N/S'
        return
      },
    },
    dec_lat: {
      name: 'Latitude (dec)',
      required: true,
      asNumber: (num: number) => {
        if (num < -90 || num > 90) return 'Must be between -90 and 90'
        return
      },
    },
    dms_long: {
      name: 'Longitude (dms)',
      required: true,
      asString: (dms_long: string) => {
        const dmsLongRegEx = /^(\d{1,3}) (\d{1,2}) (\d{1,2}) ([EW])$/
        if (!dmsLongRegEx.test(dms_long)) return 'Must be in the format DD(D) M(M) S(S) E/W'
        return
      },
    },
    dec_long: {
      name: 'Longitude (dec)',
      required: true,
      asNumber: (num: number) => {
        if (num < -180 || num > 180) return 'Must be between -180 and 180'
        return
      },
    },
  }

  return validator<EditDataType<LocalityDetailsType>>(validators, editData, isNew, fieldName)
}
