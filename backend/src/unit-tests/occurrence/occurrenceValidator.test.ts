import { describe, expect, it } from '@jest/globals'
import { validateOccurrence, occurrenceDropdownValues } from '../../../../frontend/src/shared/validators/occurrence'
import { EditableOccurrenceData } from '../../../../frontend/src/shared/types'

describe('validateOccurrence', () => {
  it('accepts valid dropdown values', () => {
    const payload: EditableOccurrenceData = {
      id_status: occurrenceDropdownValues.idStatus[0],
      qua: occurrenceDropdownValues.quantity[0],
      mesowear: occurrenceDropdownValues.mesowear[0],
      microwear: occurrenceDropdownValues.microwear[0],
    }

    const errors = (Object.keys(payload) as Array<keyof EditableOccurrenceData>)
      .map(field => validateOccurrence(payload, field))
      .filter(validation => validation.error)

    expect(errors).toEqual([])
  })

  it('returns errors for invalid dropdown values', () => {
    const payload: EditableOccurrenceData = {
      id_status: 'invalid',
      qua: 'x',
      mesowear: 'foo',
      microwear: 'bar',
    }

    const errors = (Object.keys(payload) as Array<keyof EditableOccurrenceData>)
      .map(field => validateOccurrence(payload, field))
      .filter(validation => validation.error)

    expect(errors).toHaveLength(4)
    expect(errors[0]?.error).toContain('must be one of the following values')
  })

  it('enforces mesowear scale consistency', () => {
    const payload: EditableOccurrenceData = {
      mw_scale_min: 5,
      mw_scale_max: 3,
      mw_value: 1,
    }

    expect(validateOccurrence(payload, 'mw_scale_min').error).toBe(
      'Scale Minimum cannot be greater than Scale Maximum.'
    )
    expect(validateOccurrence(payload, 'mw_scale_max').error).toBe('Scale Maximum cannot be less than Scale Minimum.')
    expect(validateOccurrence(payload, 'mw_value').error).toBe(
      'MW value must be between Scale Minimum and Scale Maximum.'
    )
  })

  it('enforces isotope min/max ordering', () => {
    const payload: EditableOccurrenceData = {
      dc13_min: 5,
      dc13_max: 4,
      do18_min: 9,
      do18_max: 8,
    }

    expect(validateOccurrence(payload, 'dc13_min').error).toBe('δ13C min cannot be greater than δ13C max.')
    expect(validateOccurrence(payload, 'dc13_max').error).toBe('δ13C min cannot be greater than δ13C max.')
    expect(validateOccurrence(payload, 'do18_min').error).toBe('δ18O min cannot be greater than δ18O max.')
    expect(validateOccurrence(payload, 'do18_max').error).toBe('δ18O min cannot be greater than δ18O max.')
  })

  it('requires positive decimals for requested fields', () => {
    const payload: EditableOccurrenceData = {
      mw_value: -1,
      dc13_mean: -0.1,
      dc13_stdev: 0,
      do18_mean: -2.5,
      do18_stdev: 0,
    }

    expect(validateOccurrence(payload, 'mw_value').error).toBe('MW value must be a positive decimal number.')
    expect(validateOccurrence(payload, 'dc13_mean').error).toBe('δ13C Mean must be a positive decimal number.')
    expect(validateOccurrence(payload, 'dc13_stdev').error).toBe('δ13C Stdev must be a positive decimal number.')
    expect(validateOccurrence(payload, 'do18_mean').error).toBe('δ18O Mean must be a positive decimal number.')
    expect(validateOccurrence(payload, 'do18_stdev').error).toBe('δ18O Stdev must be a positive decimal number.')
  })
})
