import { describe, expect, it, jest } from '@jest/globals'

import {
  createReferenceFieldsValidatorWithLabels,
  createReferenceValidatorWithLabels,
} from '@/shared/validators/reference'
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

describe('validateReferenceFields', () => {
  it('runs validators for configured fields missing from editData', () => {
    const validateFields = createReferenceFieldsValidatorWithLabels()

    const errors = validateFields({
      ref_type_id: 1,
      title_primary: 'Article title',
    } as EditDataType<ReferenceDetailsType>)

    expect(errors).toEqual(
      expect.arrayContaining([
        { name: 'date_primary', error: 'This field is required' },
        { name: 'ref_authors', error: 'This field is required' },
      ])
    )
  })
})

describe('validateReference year fields', () => {
  it('rejects a future primary year', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const validator = createReferenceValidatorWithLabels()
    const result = validator(createReferenceDetails({ ref_type_id: 1, date_primary: 2027 }), 'date_primary')

    expect(result.error).toContain('future')

    jest.useRealTimers()
  })

  it('rejects non-positive primary years', () => {
    const validator = createReferenceValidatorWithLabels()

    expect(validator(createReferenceDetails({ ref_type_id: 1, date_primary: 0 }), 'date_primary').error).toContain(
      'positive'
    )
    expect(validator(createReferenceDetails({ ref_type_id: 1, date_primary: -1 }), 'date_primary').error).toContain(
      'positive'
    )
  })

  it('rejects a future secondary year when provided', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const validator = createReferenceValidatorWithLabels()
    const result = validator(createReferenceDetails({ date_secondary: 2027 }), 'date_secondary')

    expect(result.error).toContain('future')

    jest.useRealTimers()
  })

  it('allows an empty secondary year', () => {
    const validator = createReferenceValidatorWithLabels()
    const result = validator(createReferenceDetails({ date_secondary: null }), 'date_secondary')

    expect(result.error).toBeNull()
  })
})

describe('validateReference exact date fields', () => {
  it('rejects an exact date in the future', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T12:00:00'))

    try {
      const validator = createReferenceValidatorWithLabels()
      const result = validator(createReferenceDetails({ ref_type_id: 6, exact_date: '2026-01-02' }), 'exact_date')

      expect(result.error).toBe('Date cannot be in the future')
    } finally {
      jest.useRealTimers()
    }
  })

  it('allows valid exact dates that are today or earlier', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T12:00:00'))

    try {
      const validator = createReferenceValidatorWithLabels()

      expect(validator(createReferenceDetails({ ref_type_id: 6, exact_date: '2026-01-01' }), 'exact_date').error).toBe(
        null
      )
      expect(validator(createReferenceDetails({ ref_type_id: 6, exact_date: '2025-12-31' }), 'exact_date').error).toBe(
        null
      )
    } finally {
      jest.useRealTimers()
    }
  })

  it('rejects an impossible exact date', () => {
    const validator = createReferenceValidatorWithLabels()

    const result = validator(createReferenceDetails({ ref_type_id: 6, exact_date: '2026-02-30' }), 'exact_date')

    expect(result.error).toContain('Day')
  })
})
