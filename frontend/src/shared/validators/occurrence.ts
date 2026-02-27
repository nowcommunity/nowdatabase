import { EditableOccurrenceData } from '../types'
import { Validators, validator } from './validator'

export const occurrenceDropdownValues = {
  idStatus: ['certain', 'uncertain', 'open nomenclature', 'indeterminate'] as const,
  quantity: ['a', 'c', 'r', 'v'] as const,
  mesowear: ['bil', 'mix', 'att', 'unw'] as const,
  microwear: ['pit_dom', 'pit_str', 'str_dom'] as const,
}

const validateOptionalStringSelect = (label: string, value: string, options: readonly string[]) => {
  if (!options.includes(value)) {
    return `${label} must be one of the following values: ${options.join(', ')}.`
  }

  return
}

const hasNumericValue = (value: unknown): value is number => typeof value === 'number'

export const validateOccurrence = (editData: EditableOccurrenceData, fieldName: keyof EditableOccurrenceData) => {
  const validators: Validators<Partial<EditableOccurrenceData>> = {
    id_status: {
      name: 'ID status',
      condition: () => editData.id_status !== null && editData.id_status !== undefined && editData.id_status !== '',
      asString: value => validateOptionalStringSelect('ID status', value, occurrenceDropdownValues.idStatus),
    },
    qua: {
      name: 'Quantity',
      condition: () => editData.qua !== null && editData.qua !== undefined && editData.qua !== '',
      asString: value => validateOptionalStringSelect('Quantity', value, occurrenceDropdownValues.quantity),
    },
    mesowear: {
      name: 'Mesowear',
      condition: () => editData.mesowear !== null && editData.mesowear !== undefined && editData.mesowear !== '',
      asString: value => validateOptionalStringSelect('Mesowear', value, occurrenceDropdownValues.mesowear),
    },
    microwear: {
      name: 'Microwear',
      condition: () => editData.microwear !== null && editData.microwear !== undefined && editData.microwear !== '',
      asString: value => validateOptionalStringSelect('Microwear', value, occurrenceDropdownValues.microwear),
    },
    mw_scale_min: {
      name: 'Scale Minimum',
      asNumber: value => {
        if (value < 0) return 'Scale Minimum cannot be negative.'
        if (hasNumericValue(editData.mw_scale_max) && value > editData.mw_scale_max)
          return 'Scale Minimum cannot be greater than Scale Maximum.'
        return
      },
    },
    mw_scale_max: {
      name: 'Scale Maximum',
      asNumber: value => {
        if (value < 0) return 'Scale Maximum cannot be negative.'
        if (hasNumericValue(editData.mw_scale_min) && value < editData.mw_scale_min)
          return 'Scale Maximum cannot be less than Scale Minimum.'
        return
      },
    },
    mw_value: {
      name: 'Reported Value',
      asNumber: value => {
        if (value < 0) return 'Reported Value cannot be negative.'
        if (hasNumericValue(editData.mw_scale_min) && value < editData.mw_scale_min)
          return 'Reported Value must be between Scale Minimum and Scale Maximum.'
        if (hasNumericValue(editData.mw_scale_max) && value > editData.mw_scale_max)
          return 'Reported Value must be between Scale Minimum and Scale Maximum.'
        return
      },
    },
  }

  return validator<EditableOccurrenceData>(validators, editData, fieldName)
}
