import { ValidationObject } from '@/shared/validators/validator'
import { FieldsWithErrorsType, SetFieldsWithErrorsType } from '../DetailView'

export const checkFieldErrors = (
  field: string,
  errorObject: ValidationObject,
  fieldsWithErrors: FieldsWithErrorsType,
  setFieldsWithErrors: SetFieldsWithErrorsType
) => {
  const fieldAsString = String(field)
  if (errorObject.error) {
    if (
      !(fieldAsString in fieldsWithErrors) ||
      fieldsWithErrors[fieldAsString].name !== errorObject.name ||
      fieldsWithErrors[fieldAsString].error !== errorObject.error
    ) {
      setFieldsWithErrors(prevFieldsWithErrors => {
        return { ...prevFieldsWithErrors, [fieldAsString]: errorObject }
      })
    }
  } else if (!errorObject.error && fieldAsString in fieldsWithErrors) {
    setFieldsWithErrors(prevFieldsWithErrors => {
      const newFieldsWithErrors = { ...prevFieldsWithErrors }
      delete newFieldsWithErrors[fieldAsString]
      return newFieldsWithErrors
    })
  }
}
