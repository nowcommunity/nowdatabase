import { describe, expect, it } from '@jest/globals'

import { createReferenceValidatorWithLabels } from '@/shared/validators/reference'
import type { EditDataType, ReferenceDetailsType } from '@/shared/types'

const createReferenceDetails = (
  overrides: Partial<EditDataType<ReferenceDetailsType>> = {}
): EditDataType<ReferenceDetailsType> => {
  const base: EditDataType<ReferenceDetailsType> = {
    rid: 1,
    ref_type_id: 6,
    journal_id: null,
    date_primary: null,
    title_primary: '',
    title_secondary: '',
    title_series: '',
    gen_notes: '',
    ref_authors: [],
    volume: null,
    issue: null,
    start_page: null,
    end_page: null,
    publisher: null,
    pub_place: null,
    date_secondary: null,
    issn_isbn: null,
    ref_abstract: null,
    web_url: null,
    misc_1: null,
    misc_2: null,
    printed_language: null,
    exact_date: null,
    used_morph: null,
    used_now: null,
    used_gene: null,
    ref_journal: {
      journal_id: 0,
      journal_title: '',
      short_title: '',
      alt_title: '',
      ISSN: '',
    },
    ref_ref_type: {
      ref_type: '',
    },
  }

  const merged = { ...base, ...overrides }

  return {
    ...merged,
    ref_authors: overrides.ref_authors ? [...overrides.ref_authors] : merged.ref_authors,
    ref_journal: {
      ...base.ref_journal,
      ...(overrides.ref_journal ?? {}),
    },
    ref_ref_type: {
      ...base.ref_ref_type,
      ...(overrides.ref_ref_type ?? {}),
    },
  }
}

describe('validateReference display labels', () => {
  it('uses display labels for Electronic Citation grouped fields', () => {
    const validator = createReferenceValidatorWithLabels({
      6: { title_primary: 'Title', title_secondary: 'Organisation', gen_notes: 'Notes' },
    })

    const result = validator(
      createReferenceDetails({ ref_type_id: 6, title_primary: '', title_secondary: '', gen_notes: '' }),
      'title_secondary'
    )

    expect(result.error).toBe('At least one of the following fields is required: Title, Organisation, Notes')
  })

  it('uses display labels for other reference types', () => {
    const validator = createReferenceValidatorWithLabels({
      4: { title_primary: 'Subject', gen_notes: 'Notes' },
    })

    const result = validator(createReferenceDetails({ ref_type_id: 4, title_primary: '', gen_notes: '' }), 'gen_notes')

    expect(result.error).toBe('At least one of the following fields is required: Subject, Notes')
  })
})
