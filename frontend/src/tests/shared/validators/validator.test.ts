import { describe, expect, it } from '@jest/globals'

import { validateLocalityFields } from '@/shared/validators/locality'
import { validateMuseumFields } from '@/shared/validators/museum'
import { validatePersonFields } from '@/shared/validators/person'
import { validateRegionFields } from '@/shared/validators/region'
import { validateSpecies, validateSpeciesFields } from '@/shared/validators/species'
import { validateTimeBoundFields } from '@/shared/validators/timeBound'
import { validateTimeUnitFields } from '@/shared/validators/timeUnit'
import { validateFields, type Validators } from '@/shared/validators/validator'
import type { EditDataType, LocalityDetailsType, SpeciesDetailsType } from '@/shared/types'

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
  const localitySynonym = (
    syn_id: number,
    synonym: string | null,
    rowState?: 'new' | 'removed' | 'cancelled' | 'clean'
  ): EditDataType<LocalityDetailsType>['now_syn_loc'][number] => ({
    syn_id,
    lid: 1,
    synonym,
    rowState,
  })

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
      expect.arrayContaining([{ name: 'Region', error: 'This field is required' }])
    )
  })

  it('validates person email format', () => {
    const base = { email: 'not-an-email' }
    expect(validatePersonFields(base)).toEqual(
      expect.arrayContaining([{ name: 'Email', error: 'Email must be a valid email address' }])
    )
    expect(validatePersonFields({ email: 'jane.doe@example.org' })).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Email' })])
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
        { name: 'Unique Identifier', error: 'Unique Identifier must have a value.' },
      ])
    )
  })

  it.each(['', '   '])('rejects an empty Unique Identifier (%j)', uniqueIdentifier => {
    const result = validateSpecies(
      { unique_identifier: uniqueIdentifier } as EditDataType<SpeciesDetailsType>,
      'unique_identifier'
    )

    expect(result.error).toEqual('Unique Identifier must have a value.')
  })

  it('accepts a hyphen as the Unique Identifier for a named species', () => {
    const result = validateSpecies({ unique_identifier: '-' } as EditDataType<SpeciesDetailsType>, 'unique_identifier')

    expect(result.error).toBeFalsy()
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

  it('rejects locality synonyms shorter than two trimmed characters', () => {
    const errors = validateLocalityFields({ now_syn_loc: [localitySynonym(1, ' . ')] })

    expect(errors).toEqual(
      expect.arrayContaining([{ name: 'Locality synonyms', error: 'Locality synonym must be at least 2 characters' }])
    )
  })

  it('rejects locality synonyms that duplicate after trimming and case normalization', () => {
    const errors = validateLocalityFields({
      now_syn_loc: [localitySynonym(1, 'North Site'), localitySynonym(2, ' north site ')],
    })

    expect(errors).toEqual(
      expect.arrayContaining([{ name: 'Locality synonyms', error: 'This synonym already exists for this locality' }])
    )
  })

  it('ignores removed and cancelled locality synonyms when checking duplicates', () => {
    const errors = validateLocalityFields({
      now_syn_loc: [
        localitySynonym(1, 'North Site'),
        localitySynonym(2, ' north site ', 'removed'),
        localitySynonym(3, 'north site', 'cancelled'),
      ],
    })

    expect(errors.some(error => error.name === 'Locality synonyms')).toBe(false)
  })
})
