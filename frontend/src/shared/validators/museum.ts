import { EditDataType, Museum } from '../types'
import { Validators, validator } from './validator'

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

export const validateMuseum = (editData: EditDataType<Museum>, fieldName: keyof EditDataType<Museum>) => {
  const validators: Validators<Partial<EditDataType<Museum>>> = {
    museum: {
      name: 'Museum',
      required: true,
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
  }

  return validator<EditDataType<Museum>>(validators, editData, fieldName)
}
