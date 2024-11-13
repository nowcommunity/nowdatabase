export type ValidationError = string | null | undefined
export type ValidationObject = { name: string; error: ValidationError }

type Validator = {
  name: string
  required?: (() => ValidationError) | boolean
  minLength?: number
  maxLength?: number
  asNumber?: ((num: number) => ValidationError) | boolean
  asString?: ((str: string) => ValidationError) | boolean
  miscCheck?: (obj: object) => ValidationError
  miscArray?: (data: object[]) => ValidationError
  regexCheck?: (str: string) => ValidationError
  condition?: (data: object) => boolean // Validator is run if condition returns true, example in ./reference
  useEditData?: boolean
}

export type Validators<T> = { [field in keyof T]: Validator } & { [key: string]: Validator }

const validate: (validator: Validator, value: unknown) => ValidationError = (validator: Validator, value: unknown) => {
  const { required, minLength, maxLength, asNumber, asString, miscCheck, miscArray } = validator

  if ((value === null || value === undefined || value === '') && required) {
    if (typeof required === 'boolean') return 'This field is required'
    if (typeof required === 'function') return required()
  }
  if (asNumber) {
    if (typeof value !== 'number' && value !== null) return 'Value must be a valid number' // If this happens, code is broken somewhere
    if (typeof asNumber === 'function' && typeof value == 'number') return asNumber(value)
  }
  if (asString) {
    if (typeof value !== 'string') return 'Value must be of type string'
    if (minLength && value.length < minLength) return `Value must be at least ${minLength} characters long`
    if (maxLength && value.length > maxLength) return `Value must be at most ${maxLength} characters long`
    if (typeof asString === 'function') return asString(value)
  }
  if (miscCheck && value && typeof value == 'object') {
    return miscCheck(value)
  } else if (miscCheck) {
    return 'You are using a check intended for objects on values that are not objects'
  }
  if (miscArray && Array.isArray(value)) {
    //Typescript
    const valueAsArray = value as object[]

    for (let i = 0; i < valueAsArray.length; i++) {
      if (typeof valueAsArray[i] !== 'object' || valueAsArray[i] === null || Array.isArray(valueAsArray[i])) {
        return `Element at index ${i} must be an object`
      }
    }
    return miscArray(valueAsArray)
  } else if (miscArray) {
    return 'You are using a check intended for arrays on values that are not arrays'
  }
  return null
}

export const validator = <T>(
  validators: Validators<Partial<T>>,
  editData: Partial<T>,
  fieldName: keyof T
): ValidationObject => {
  const fieldValidator = validators[fieldName]

  if (!fieldValidator || (fieldValidator.condition && !fieldValidator.condition(editData))) {
    return { name: fieldName as string, error: null }
  }

  const validationError = validate(fieldValidator, fieldValidator.useEditData ? editData : editData[fieldName])
  return { name: fieldValidator.name, error: validationError }
}
