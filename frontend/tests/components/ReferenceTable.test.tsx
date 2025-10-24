import { describe, expect, it } from '@jest/globals'
import { referenceTableColumns } from '../../src/common'
import type { Reference } from '../../src/shared/types'

type AuthorFilterFn = (row: { original: Reference }, columnId: string, filterValue: unknown) => boolean

const createReference = (overrides: Partial<Reference> = {}): Reference => ({
  rid: 0,
  title_primary: 'Default title',
  title_secondary: 'Secondary title',
  date_primary: 1999,
  ref_authors: [],
  ref_journal: { journal_title: 'Journal' },
  ref_ref_type: { ref_type: 'Article' },
  ...overrides,
})

const getAuthorFilter = (): AuthorFilterFn => {
  const authorColumn = referenceTableColumns.find(column => column.header === 'Author')
  expect(authorColumn).toBeDefined()
  expect(authorColumn?.filterFn).toBeDefined()
  return authorColumn?.filterFn as AuthorFilterFn
}

describe('ReferenceTable author filter', () => {
  it('matches a reference when any author surname matches the filter value', () => {
    const filter = getAuthorFilter()
    const reference = createReference({
      ref_authors: [
        { au_num: 1, author_surname: 'Berggren', author_initials: 'WA' },
        { au_num: 2, author_surname: 'Kent', author_initials: 'DV' },
        { au_num: 3, author_surname: 'Flynn', author_initials: 'LJ' },
      ],
    })
    const row = { original: reference }

    expect(filter(row, 'ref_authors', 'flynn')).toBe(true)
    expect(filter(row, 'ref_authors', 'kent')).toBe(true)
  })

  it('matches using initials and combined surname with initials', () => {
    const filter = getAuthorFilter()
    const reference = createReference({
      ref_authors: [
        { au_num: 1, author_surname: 'Berggren', author_initials: 'WA' },
        { au_num: 2, author_surname: 'Kent', author_initials: 'DV' },
      ],
    })
    const row = { original: reference }

    expect(filter(row, 'ref_authors', 'dv')).toBe(true)
    expect(filter(row, 'ref_authors', 'kent dv')).toBe(true)
  })

  it('does not match when none of the authors include the filter value', () => {
    const filter = getAuthorFilter()
    const reference = createReference({
      ref_authors: [{ au_num: 1, author_surname: 'Solo', author_initials: 'HS' }],
    })
    const row = { original: reference }

    expect(filter(row, 'ref_authors', 'unknown')).toBe(false)
  })
})
