import { describe, expect, it } from '@jest/globals'
import { validateSpecies } from '@/shared/validators/species'
import type { EditDataType, SpeciesDetailsType } from '@/shared/types'

const createSpeciesEditData = (
  overrides: Partial<EditDataType<SpeciesDetailsType>> = {}
): EditDataType<SpeciesDetailsType> => {
  return {
    taxonomic_status: '',
    mw_scale_min: null,
    mw_scale_max: null,
    mw_value: null,
    ...overrides,
  } as EditDataType<SpeciesDetailsType>
}

describe('validateSpecies mesowear scale/value constraints', () => {
  it('rejects negative Scale Minimum', () => {
    const result = validateSpecies(createSpeciesEditData({ mw_scale_min: -1 }), 'mw_scale_min')
    expect(result.error).toBe('Scale Minimum cannot be negative.')
  })

  it('rejects Scale Minimum greater than Scale Maximum', () => {
    const result = validateSpecies(createSpeciesEditData({ mw_scale_min: 7, mw_scale_max: 6 }), 'mw_scale_min')
    expect(result.error).toBe('Scale Minimum cannot be greater than Scale Maximum.')
  })

  it('rejects negative Scale Maximum and values below Scale Minimum', () => {
    const negative = validateSpecies(createSpeciesEditData({ mw_scale_max: -1 }), 'mw_scale_max')
    expect(negative.error).toBe('Scale Maximum cannot be negative.')

    const lessThanMin = validateSpecies(createSpeciesEditData({ mw_scale_min: 4, mw_scale_max: 3 }), 'mw_scale_max')
    expect(lessThanMin.error).toBe('Scale Maximum cannot be less than Scale Minimum.')
  })

  it('rejects negative Reported Value', () => {
    const result = validateSpecies(createSpeciesEditData({ mw_value: -0.01 }), 'mw_value')
    expect(result.error).toBe('Reported Value cannot be negative.')
  })

  it('accepts valid non-negative and ordered values', () => {
    const min = validateSpecies(createSpeciesEditData({ mw_scale_min: 1, mw_scale_max: 5 }), 'mw_scale_min')
    const max = validateSpecies(createSpeciesEditData({ mw_scale_min: 1, mw_scale_max: 5 }), 'mw_scale_max')
    const value = validateSpecies(createSpeciesEditData({ mw_value: 3 }), 'mw_value')

    expect(min.error).toBeFalsy()
    expect(max.error).toBeFalsy()
    expect(value.error).toBeFalsy()
  })
})
