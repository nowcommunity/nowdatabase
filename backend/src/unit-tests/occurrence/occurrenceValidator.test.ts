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
      'Reported Value must be between Scale Minimum and Scale Maximum.'
    )
  })
})
