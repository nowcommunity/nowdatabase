import { describe, expect, it } from '@jest/globals'

import { validateLocalityFields } from '@/shared/validators/locality'
import { validateMuseumFields } from '@/shared/validators/museum'
import { validatePersonFields } from '@/shared/validators/person'
import { validateRegionFields } from '@/shared/validators/region'
import { validateSpeciesFields } from '@/shared/validators/species'
import { validateTimeBoundFields } from '@/shared/validators/timeBound'
import { validateTimeUnitFields } from '@/shared/validators/timeUnit'
import { validateFields, type Validators } from '@/shared/validators/validator'

type TestData = {
  id?: number
  requiredName?: string
  optionalComment?: string | null
}

describe('validateFields', () => {
  const validators: Validators<Partial<TestData>> = {
    requiredName: {
      name: 'Required name',
      required: true,
    },
    optionalComment: {
      name: 'Optional comment',
    },
  }

  it('runs validators for configured fields missing from editData', () => {
    const errors = validateFields<TestData>(validators, {})

    expect(errors).toEqual([{ name: 'Required name', error: 'This field is required' }])
  })

  it('allows callers to validate a focused field list', () => {
    const errors = validateFields<TestData>(validators, {}, ['optionalComment'])

    expect(errors).toEqual([])
  })
})

describe('validateTimeBoundFields', () => {
  it('reports missing required fields', () => {
    const errors = validateTimeBoundFields({})

    expect(errors).toEqual([
      { name: 'Name', error: 'This field is required' },
      { name: 'Age (Ma)', error: 'This field is required' },
    ])
  })
})

describe('entity full-field validators', () => {
  it('reports missing Time Unit required fields', () => {
    const errors = validateTimeUnitFields({})

    expect(errors).toEqual(
      expect.arrayContaining([
        { name: 'Name', error: 'This field is required' },
        { name: 'Sequence', error: 'This field is required' },
        { name: 'Upper Bound', error: 'This field is required' },
        { name: 'Lower Bound', error: 'This field is required' },
      ])
    )
  })

  it('does not require Time Unit helper bound ids when resolved bounds exist', () => {
    const errors = validateTimeUnitFields({
      tu_display_name: 'Test time unit',
      sequence: 'ALMA',
      up_bound: { bid: 11, b_name: 'C2N-y', age: 4.37, b_comment: '' },
      low_bound: { bid: 14, b_name: 'C2N-o', age: 4.631, b_comment: '' },
    })

    expect(errors).toEqual([])
  })

  it('reports missing simple entity required fields', () => {
    expect(validatePersonFields({})).toEqual(
      expect.arrayContaining([
        { name: 'initials', error: 'This field is required' },
        { name: 'First Name', error: 'This field is required' },
        { name: 'Country', error: 'This field is required' },
      ])
    )

    expect(validateMuseumFields({})).toEqual(
      expect.arrayContaining([
        { name: 'Museum', error: 'This field is required' },
        { name: 'Institution', error: 'This field is required' },
        { name: 'Country', error: 'This field is required' },
      ])
    )

    expect(validateRegionFields({})).toEqual(
      expect.arrayContaining([
        { name: 'reg_coord_id', error: 'This field is required' },
        { name: 'Region', error: 'This field is required' },
      ])
    )
  })

  it('reports missing Species taxonomy fields', () => {
    const errors = validateSpeciesFields({})

    expect(errors).toEqual(
      expect.arrayContaining([
        { name: 'Order', error: 'This field is required' },
        { name: 'Family', error: 'This field is required' },
        { name: 'Genus', error: 'This field is required' },
        { name: 'Species', error: 'This field is required' },
        { name: 'Unique Identifier', error: 'This field is required' },
      ])
    )
  })

  it('reports missing Locality required and conditional fields', () => {
    const errors = validateLocalityFields({ date_meth: 'time_unit' })

    expect(errors).toEqual(
      expect.arrayContaining([
        { name: 'Age (max)', error: 'This field is required' },
        { name: 'Age (min)', error: 'This field is required' },
        { name: 'Basis for age (Time unit, min)', error: 'This field is required' },
        { name: 'Basis for age (Time unit, max)', error: 'This field is required' },
        { name: 'Locality name', error: 'This field is required' },
        { name: 'Country', error: 'This field is required' },
      ])
    )
  })
})
