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
    },
    first_name: {
      name: 'First Name',
      required: true,
    },
    surname: {
      name: 'Surname',
      required: true,
    },
    email: {
      name: 'Email',
      required: true,
    },
    organization: {
      name: 'Organization',
      required: true,
    },
    country: {
      name: 'Country',
      required: true,
    },
  }

  return validator<EditDataType<PersonDetailsType>>(validators, editData, fieldName)
}
