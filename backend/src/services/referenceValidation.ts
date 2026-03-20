import { EditDataType, ReferenceDetailsType } from '../../../frontend/src/shared/types'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import {
  ReferenceDisplayLabelMap,
  ReferenceFieldDisplayNames,
  validateReference,
} from '../../../frontend/src/shared/validators/reference'

type ReferenceTypeFieldName = { field_name: string | null; ref_field_name: string | null }

export type ReferenceTypeWithFieldNames = { ref_type_id: number; ref_field_name: ReferenceTypeFieldName[] }

export const buildReferenceDisplayLabelMap = (
  referenceTypes: ReferenceTypeWithFieldNames[]
): ReferenceDisplayLabelMap => {
  const labelMap: ReferenceDisplayLabelMap = {}

  referenceTypes.forEach(referenceType => {
    const labelsForType = referenceType.ref_field_name.reduce<ReferenceFieldDisplayNames>((typeLabels, field) => {
      if (field.field_name && field.ref_field_name) {
        typeLabels[field.field_name as keyof ReferenceFieldDisplayNames] = field.ref_field_name
      }

      return typeLabels
    }, {})

    if (Object.keys(labelsForType).length > 0) {
      labelMap[referenceType.ref_type_id] = labelsForType
    }
  })

  return labelMap
}

export const validateEntireReference = (
  editedFields: EditDataType<ReferenceDetailsType>,
  options?: { displayLabelMap?: ReferenceDisplayLabelMap }
) => {
  const keys = Object.keys(editedFields as Record<string, unknown>) as (keyof EditDataType<ReferenceDetailsType>)[]
  const errors: ValidationObject[] = []

  for (const key of keys) {
    const error = validateReference(editedFields, key, options)
    if (error.error) errors.push(error)
  }

  return errors
}
