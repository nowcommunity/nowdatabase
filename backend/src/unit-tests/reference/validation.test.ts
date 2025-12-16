import { describe, expect, it } from '@jest/globals'

import {
  buildReferenceDisplayLabelMap,
  validateEntireReference,
  type ReferenceTypeWithFieldNames,
} from '../../services/reference'
import { EditDataType, ReferenceDetailsType } from '../../../../frontend/src/shared/types'

const electronicCitationReferenceType: ReferenceTypeWithFieldNames = {
  ref_type_id: 6,
  ref_field_name: [
    { ref_field_name: 'Title', field_name: 'title_primary' },
    { ref_field_name: 'Organisation', field_name: 'title_secondary' },
    { ref_field_name: 'Notes', field_name: 'gen_notes' },
  ],
}

const bookReferenceType: ReferenceTypeWithFieldNames = {
  ref_type_id: 1,
  ref_field_name: [
    { ref_field_name: 'Title', field_name: 'title_primary' },
    { ref_field_name: 'Secondary title', field_name: 'title_secondary' },
    { ref_field_name: 'Series title', field_name: 'title_series' },
    { ref_field_name: 'Notes', field_name: 'gen_notes' },
  ],
}

describe('reference validation display labels', () => {
  it('uses display labels for grouped validation when provided via displayLabelMap', () => {
    const displayLabelMap = buildReferenceDisplayLabelMap([electronicCitationReferenceType, bookReferenceType])

    const errors = validateEntireReference(
      {
        ref_type_id: 6,
        title_primary: '',
        title_secondary: '',
        gen_notes: '',
      } as EditDataType<ReferenceDetailsType>,
      { displayLabelMap }
    )

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          error: 'At least one of the following fields is required: Title, Organisation, Notes',
        }),
      ])
    )
  })

  it('falls back to raw keys when no labels exist for a reference type', () => {
    const displayLabelMap = buildReferenceDisplayLabelMap([bookReferenceType])

    const errors = validateEntireReference(
      {
        ref_type_id: 6,
        title_primary: '',
        title_secondary: '',
        gen_notes: '',
      } as EditDataType<ReferenceDetailsType>,
      { displayLabelMap }
    )

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          error: 'At least one of the following fields is required: title_primary, title_secondary, gen_notes',
        }),
      ])
    )
  })
})
