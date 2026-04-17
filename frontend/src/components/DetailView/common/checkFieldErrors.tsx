import { ValidationObject } from '@/shared/validators/validator'
import type { FieldsWithErrorsType, SetFieldsWithErrorsType } from '../DetailView'

export const checkFieldErrors = (
  field: string,
  errorObject: ValidationObject,
  _fieldsWithErrors: FieldsWithErrorsType,
  setFieldsWithErrors: SetFieldsWithErrorsType
) => {
  const fieldAsString = String(field)
  setFieldsWithErrors(prevFieldsWithErrors => {
    const previousError = prevFieldsWithErrors[fieldAsString]

    if (errorObject.error) {
      if (!previousError || previousError.name !== errorObject.name || previousError.error !== errorObject.error) {
        return { ...prevFieldsWithErrors, [fieldAsString]: errorObject }
      }
      return prevFieldsWithErrors
    }

    if (previousError) {
      const newFieldsWithErrors = { ...prevFieldsWithErrors }
      delete newFieldsWithErrors[fieldAsString]
      return newFieldsWithErrors
    }

    return prevFieldsWithErrors
  })
}
