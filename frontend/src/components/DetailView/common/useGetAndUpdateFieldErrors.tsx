import { useEffect, useState } from 'react'
import { useDetailContext } from '../Context/DetailContext'

/**
 * This hook does two things:
 * It returns an error which is a string that can be displayed
 * in editing components,
 * but also updates the error with setFieldsWithErrors
 * to be displayed to the user as a large list containing
 * all errors.
 */
export const useGetAndUpdateFieldErrors = <T extends Record<string, unknown>>(field: keyof T) => {
  const { editData, fieldsWithErrors, setFieldsWithErrors, validator } = useDetailContext<T>()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const errors = validator(editData, field as string)
    // If no errors were found, check if previously one existed, and if so, delete it
    if (errors.length === 0) {
      if (field in fieldsWithErrors) {
        setFieldsWithErrors(prevFieldsWithErrors => {
          const newFieldsWithErrors = { ...prevFieldsWithErrors }
          delete newFieldsWithErrors[field as string]
          return newFieldsWithErrors
        })
        setError('')
      }
      return
    }

    // Error was found: add it to fieldsWithErrors
    const errorObject = errors[0]

    if (!(field in fieldsWithErrors) && errorObject.error) {
      setFieldsWithErrors(prevFieldsWithErrors => {
        return { ...prevFieldsWithErrors, [field]: errorObject }
      })
      setError(errorObject.error)
    }
  }, [editData, field, fieldsWithErrors, setFieldsWithErrors, validator])
  return error
}
