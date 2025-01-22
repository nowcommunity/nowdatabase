import { Editable, Reference } from '../types'

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

export type ValidatorFunction = <T>(
  validators: Validators<Partial<T>>,
  editData: Partial<T>,
  isNew: boolean,
  fieldName?: keyof T
) => ValidationObject[]

export const validator: ValidatorFunction = (validators, editData, isNew, fieldName) => {
  const validateSingleField = (field: keyof typeof editData) => {
    const fieldValidator = validators[field]

    if (!fieldValidator || (fieldValidator.condition && !fieldValidator.condition(editData))) {
      return null
    }

    const validationError = validate(fieldValidator, fieldValidator.useEditData ? editData : editData[field])
    if (!validationError) return null
    return { name: fieldValidator.name, error: validationError }
  }

  const errorList: ValidationObject[] = []

  // Validate only one field
  if (fieldName !== undefined) {
    const error = validateSingleField(fieldName)
    if (error) {
      errorList.push(error)
    }
    return errorList
  }

  /* This part is run if we are validating multiple fields.
  However, we want it to act differently on create or update:

  Updating doesn't require all fields to exist in the sent object, 
  only the edited fields.

  For create, we want to check that all required fields exist,
  so we validate every field for which we have a validator. */
  const fieldsToValidate = isNew ? Object.keys(validators) : Object.keys(editData)

  for (const field of fieldsToValidate as Array<keyof typeof editData>) {
    const error = validateSingleField(field)
    if (error?.error) errorList.push(error)
  }
  return errorList
}

export const referenceValidator: (references: Editable<Reference>[]) => ValidationError = (
  references: Editable<Reference>[]
) => {
  if (references.length === 0) {
    return 'There must be at least one reference'
  }

  // new references have rowState = 'new', old ones don't have a rowState and references that will be deleted have rowstate='removed'
  // so checking the update has at least one reference that's not queued for removal
  const nonRemovedReferences = references.some(ref => !ref.rowState || ref.rowState !== 'removed')
  if (!nonRemovedReferences) {
    return 'There must be at least one reference'
  }
  return null
}
