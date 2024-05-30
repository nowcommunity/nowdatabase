import { EditDataType } from '../backendTypes'

const isValidNumber = (value: string) => !Number.isNaN(parseInt(value))

export type ValidationError = string | null | undefined
export type ValidationObject = { name: string; error: ValidationError }
type Validator = {
  name: string
  required?: boolean
  minLength?: number
  maxLength?: number
  asNumber?: ((num: number) => ValidationError) | boolean
  asString?: ((str: string) => ValidationError) | boolean
}

export type Validators<T> = { [field in keyof T]: Validator }

const validate: (validator: Validator, value: unknown) => ValidationError = (validator: Validator, value: unknown) => {
  const { required, minLength, maxLength, asNumber, asString } = validator
  if (value === null || value === undefined) return required ? 'This field is required' : null
  if (asNumber) {
    if (typeof value !== 'string') return 'Error in type' // Shouldn't happen due to editdata being all string
    if (!isValidNumber(value)) return 'Value must be a valid number'
    if (typeof asNumber === 'function') return asNumber(parseInt(value))
    return null
  }
  if (asString) {
    if (typeof value !== 'string') return 'Value must be of type string'
    if (minLength && value.length < minLength) return `Value must be at least ${minLength} characters long`
    if (maxLength && value.length > maxLength) return `Value must be at most ${maxLength} characters long`
    if (typeof asString === 'function') return asString(value)
    return null
  }
  return null
}

export const validator = <T>(
  validators: Validators<Partial<T>>,
  editData: EditDataType<T>,
  fieldName: keyof T
): ValidationObject => {
  const validator = validators[fieldName]
  if (validator === undefined) return { name: fieldName as string, error: null }
  const validationError = validate(validator, editData[fieldName])
  return { name: validator.name, error: validationError }
}
