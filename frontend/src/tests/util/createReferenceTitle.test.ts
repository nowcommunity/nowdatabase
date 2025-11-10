import { describe, expect, it } from '@jest/globals'
import { createReferenceTitle } from '../../components/Reference/referenceFormatting'
import type { ReferenceDetailsType } from '../../shared/types'

const createReferenceDetails = (overrides: Partial<ReferenceDetailsType> = {}): ReferenceDetailsType => {
  const base: ReferenceDetailsType = {
    rid: 1,
    ref_type_id: 1,
    journal_id: null,
    date_primary: null,
    title_primary: null,
    title_secondary: null,
    title_series: null,
    gen_notes: null,
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

describe('createReferenceTitle', () => {
  it('returns author, year, and title for journal references', () => {
    const reference = createReferenceDetails({
      rid: 30,
      title_primary: 'Fossil record of the region',
      date_primary: 1995,
      ref_authors: [
        { rid: 30, au_num: 1, author_surname: 'Doe', field_id: 2 },
        { rid: 30, au_num: 2, author_surname: 'Smith', field_id: 2 },
        { rid: 30, au_num: 3, author_surname: 'Taylor', field_id: 2 },
        { rid: 30, au_num: 4, author_surname: 'Brown', field_id: 2 },
      ],
    })

    expect(createReferenceTitle(reference)).toBe('Doe et al. (1995) – Fossil record of the region')
  })

  it('uses editors when no authors are available', () => {
    const reference = createReferenceDetails({
      rid: 8,
      title_primary: 'Mammals of the northern hemisphere',
      date_primary: 2001,
      ref_authors: [
        { rid: 8, au_num: 1, author_surname: 'Brown', field_id: 12 },
        { rid: 8, au_num: 2, author_surname: 'Taylor', field_id: 12 },
      ],
    })

    expect(createReferenceTitle(reference)).toBe('Brown & Taylor (eds., 2001) – Mammals of the northern hemisphere')
  })

  it('falls back to the reference id when metadata is missing', () => {
    const reference = createReferenceDetails({
      rid: 77,
    })

    expect(createReferenceTitle(reference)).toBe('Reference 77')
  })
})
