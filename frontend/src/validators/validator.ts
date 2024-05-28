const isValidNumber = (value: string) => !Number.isNaN(parseInt(value))

type ValidationReturn = string | null | undefined

type Validator = {
  name: string
  required?: boolean
  minLength?: number
  maxLength?: number
  asNumber?: ((num: number) => ValidationReturn) | boolean
  asString?: ((str: string) => ValidationReturn) | boolean
}

export type Validators<T> = { [field in keyof T]: Validator }

const validate: (validator: Validator, value: unknown) => ValidationReturn = (validator: Validator, value: unknown) => {
  const { required, minLength, maxLength, asNumber, asString } = validator
  if (value === null || value === undefined) return required ? 'This field is required' : null
  if (asNumber) {
    if (typeof value !== 'string') return 'Error in type' // TODO: How to do this...
    if (!isValidNumber(value)) return 'Value must be a valid number'
    if (typeof asNumber === 'function') return asNumber(parseInt(value))
    return isValidNumber(value) ? 'Value must be a valid number' : null
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

export const validator = <T>(validators: Validators<T>, editData: T, fieldName: keyof T) => {
  const validator = validators[fieldName]
  if (validator === undefined) return null
  const validationError = validate(validator, editData[fieldName])
  if (!validationError) return null
  return `Field validation failed for ${validator.name}: ${validationError}`
}
