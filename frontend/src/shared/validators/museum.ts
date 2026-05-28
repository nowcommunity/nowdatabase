import { EditDataType, Museum } from '../types'
import { Validators, validateFields, validator } from './validator'

/*
   museum: string;
    institution: string;
    alt_int_name: string | null;
    city: string | null;
    state_code: string | null;
    state: string | null;
    country: string | null;
    used_morph: boolean | null;
    used_now: boolean | null;
    used_gene: boolean | null;
  */

const museumValidators: Validators<Partial<EditDataType<Museum>>> = {
  museum: {
    name: 'Museum',
    required: true,
    asString: museumCode => {
      if (museumCode.indexOf(' ') !== -1) return 'Museum code must not contain a space'
      return null
    },
  },
  institution: {
    name: 'Institution',
    required: true,
  },
  city: {
    name: 'City',
    required: true,
  },
  country: {
    name: 'Country',
    required: true,
  },
  state_code: {
    name: 'State code',
    asString: value => {
      if (value.length > 5) return 'State code must contain a maximum of 5 characters'
      return null
    },
  },
}

export const validateMuseum = (editData: EditDataType<Museum>, fieldName: keyof EditDataType<Museum>) => {
  return validator<EditDataType<Museum>>(museumValidators, editData, fieldName)
}

export const validateMuseumFields = (editData: Partial<EditDataType<Museum>>) =>
  validateFields<EditDataType<Museum>>(museumValidators, editData)
