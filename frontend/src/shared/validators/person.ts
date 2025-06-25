import { EditDataType, PersonDetailsType } from '../types'
import { Validators, validator } from './validator'


export const validatePerson = (
  editData: EditDataType<PersonDetailsType>,
  fieldName: keyof EditDataType<PersonDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<PersonDetailsType>>> = {
    initials: {
      name: 'initials',
      required: true,
      asString: true,
      minLength: 2,
      maxLength: 8,
  },
    first_name: {
      name: 'First Name',
      required: true,
      asString: true,
      minLength: 2,
      maxLength: 20,

    },
    surname: {
      name: 'Surname',
      required: true,
      asString: true,
      minLength: 2,
      maxLength: 20,
    },
    email: { 
      name: 'Email',
      required: true,
      asString: true,
      minLength: 5,
      maxLength: 30,
    },
    organization: {
      name: 'Organization',
      required: true,
      asString: true,
      minLength: 2,
      maxLength: 30,
    },
    country: {
      name: 'Country',
      required: true,
    },

  }

  return validator<EditDataType<PersonDetailsType>>(validators, editData, fieldName)
}
