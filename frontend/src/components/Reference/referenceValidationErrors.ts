import type { EditDataType, ReferenceDetailsType, ValidationErrors } from '@/shared/types'
import type { ReferenceDisplayLabelMap } from '@/shared/validators/reference'

const GENERIC_REFERENCE_SAVE_ERROR = 'Could not edit item. Error happened.'
const GROUPED_REQUIRED_PREFIX = 'At least one of the following fields is required:'

const isValidationErrors = (error: unknown): error is ValidationErrors => {
  if (typeof error !== 'object' || error === null || !('data' in error)) {
    return false
  }

  const possibleError = error as { data?: unknown }
  return Array.isArray(possibleError.data)
}

const getReferenceFieldDisplayLabel = (
  fieldName: string,
  refTypeId: number | null | undefined,
  displayLabelMap?: ReferenceDisplayLabelMap
) => {
  if (!refTypeId) return fieldName

  const fieldLabels = displayLabelMap?.[refTypeId]
  return fieldLabels?.[fieldName as keyof EditDataType<ReferenceDetailsType>] ?? fieldName
}

export const formatReferenceValidationErrorMessage = (
  error: unknown,
  refTypeId: number | null | undefined,
  displayLabelMap?: ReferenceDisplayLabelMap
) => {
  if (!isValidationErrors(error) || error.data.length === 0) {
    return GENERIC_REFERENCE_SAVE_ERROR
  }

  const messages = error.data.map(validationError => {
    const errorText = validationError.error.trim()

    if (errorText.startsWith(GROUPED_REQUIRED_PREFIX)) {
      return errorText
    }

    const fieldLabel = getReferenceFieldDisplayLabel(validationError.name, refTypeId, displayLabelMap)
    return errorText.length > 0 ? `${fieldLabel}: ${errorText}` : fieldLabel
  })

  return `Following validators failed: ${[...new Set(messages)].join(', ')}`
}
