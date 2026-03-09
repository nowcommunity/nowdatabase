import { EditableOccurrenceData } from '../types'
import { Validators, validator } from './validator'

export const occurrenceDropdownValues = {
  idStatus: ['family id uncertain', 'genus id uncertain', 'species id uncertain'] as const,
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

const validatePositiveInteger = (name: string, value: number) => {
  if (!Number.isInteger(value) || value <= 0) return `${name} must be a positive integer.`
  return
}

const validatePositiveDecimal = (name: string, value: number) => {
  if (!Number.isFinite(value) || value <= 0) return `${name} must be a positive number.`
  return
}

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
    nis: { name: 'NISP', asNumber: value => validatePositiveInteger('NISP', value) },
    quad: { name: 'Quadrate', asNumber: value => validatePositiveInteger('Quadrate', value) },
    mni: { name: 'MNI', asNumber: value => validatePositiveInteger('MNI', value) },
    body_mass: { name: 'Body mass', asNumber: value => validatePositiveInteger('Body mass', value) },
    dc13_n: { name: 'δ13C N', asNumber: value => validatePositiveInteger('δ13C N', value) },
    do18_n: { name: 'δ18O N', asNumber: value => validatePositiveInteger('δ18O N', value) },
    mw_or_high: { name: 'MW OR High', asNumber: value => validatePositiveInteger('MW OR High', value) },
    mw_or_low: { name: 'MW OR Low', asNumber: value => validatePositiveInteger('MW OR Low', value) },
    mw_cs_sharp: { name: 'MW CS Sharp', asNumber: value => validatePositiveInteger('MW CS Sharp', value) },
    mw_cs_round: { name: 'MW CS Round', asNumber: value => validatePositiveInteger('MW CS Round', value) },
    mw_cs_blunt: { name: 'MW CS Blunt', asNumber: value => validatePositiveInteger('MW CS Blunt', value) },
    mw_scale_min: {
      name: 'Scale Minimum',
      asNumber: value => {
        const positivityError = validatePositiveInteger('Scale Minimum', value)
        if (positivityError) return positivityError
        if (hasNumericValue(editData.mw_scale_max) && value > editData.mw_scale_max)
          return 'Scale Minimum cannot be greater than Scale Maximum.'
        return
      },
    },
    mw_scale_max: {
      name: 'Scale Maximum',
      asNumber: value => {
        const positivityError = validatePositiveInteger('Scale Maximum', value)
        if (positivityError) return positivityError
        if (hasNumericValue(editData.mw_scale_min) && value < editData.mw_scale_min)
          return 'Scale Maximum cannot be less than Scale Minimum.'
        return
      },
    },
    mw_value: {
      name: 'Reported Value',
      asNumber: value => {
        const positivityError = validatePositiveInteger('Reported Value', value)
        if (positivityError) return positivityError
        if (hasNumericValue(editData.mw_scale_min) && value < editData.mw_scale_min)
          return 'Reported Value must be between Scale Minimum and Scale Maximum.'
        if (hasNumericValue(editData.mw_scale_max) && value > editData.mw_scale_max)
          return 'Reported Value must be between Scale Minimum and Scale Maximum.'
        return
      },
    },
    pct: { name: 'Percent', asNumber: value => validatePositiveDecimal('Percent', value) },
    dc13_mean: { name: 'δ13C Mean', asNumber: value => validatePositiveInteger('δ13C Mean', value) },
    dc13_max: { name: 'δ13C Max', asNumber: value => validatePositiveInteger('δ13C Max', value) },
    dc13_min: { name: 'δ13C Min', asNumber: value => validatePositiveInteger('δ13C Min', value) },
    dc13_stdev: { name: 'δ13C Stdev', asNumber: value => validatePositiveInteger('δ13C Stdev', value) },
    do18_mean: { name: 'δ18O Mean', asNumber: value => validatePositiveInteger('δ18O Mean', value) },
    do18_max: { name: 'δ18O Max', asNumber: value => validatePositiveInteger('δ18O Max', value) },
    do18_min: { name: 'δ18O Min', asNumber: value => validatePositiveInteger('δ18O Min', value) },
    do18_stdev: { name: 'δ18O Stdev', asNumber: value => validatePositiveInteger('δ18O Stdev', value) },
  }

  return validator<EditableOccurrenceData>(validators, editData, fieldName)
}
