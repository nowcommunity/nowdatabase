import { describe, expect, it } from '@jest/globals'
import { createReferenceSubtitle } from '../../components/Reference/referenceFormatting'
import type { ReferenceDetailsType } from '@/shared/types'

describe('createReferenceSubtitle', () => {
  it('formats journal references (type 1)', () => {
    const ref = {
      rid: 1,
      ref_type_id: 1,
      date_primary: 1999,
      title_primary: 'Primary Title',
      volume: '12',
      issue: '3',
      start_page: 10,
      end_page: 20,
      ref_authors: [{ author_surname: 'Smith', field_id: 2 }],
      ref_journal: { journal_title: 'Journal Title' },
    } as unknown as ReferenceDetailsType

    const text = createReferenceSubtitle(ref)
    expect(text).toContain('Smith (1999)')
    expect(text).toContain('Primary Title')
    expect(text).toContain('Journal Title')
    expect(text).toContain('12')
    expect(text).toContain('(3)')
    expect(text).toContain('10-20')
  })

  it('formats thesis references (type 4)', () => {
    const ref = {
      rid: 2,
      ref_type_id: 4,
      date_primary: 2001,
      title_primary: 'Thesis Title',
      misc_1: 'PhD thesis',
      publisher: 'University of Helsinki',
      end_page: 200,
      web_url: 'https://example.com/thesis',
      ref_authors: [{ author_surname: 'Doe', field_id: 2 }],
      ref_journal: null,
    } as unknown as ReferenceDetailsType

    const text = createReferenceSubtitle(ref)
    expect(text).toContain('Doe (2001)')
    expect(text).toContain('Thesis Title')
    expect(text).toContain('PhD thesis')
    expect(text).toContain('University of Helsinki')
    expect(text).toContain('200 pp.')
    expect(text).toContain('https://example.com/thesis')
  })

  it('formats electronic citations (type 6)', () => {
    const ref = {
      rid: 3,
      ref_type_id: 6,
      date_primary: 2020,
      title_primary: 'Web Reference Title',
      title_secondary: 'Some Organisation',
      misc_1: '12 Mar',
      web_url: 'https://example.com/page',
      exact_date: '2026-04-21',
      ref_authors: [{ author_surname: 'OrgAuthor', field_id: 12 }],
      ref_journal: null,
    } as unknown as ReferenceDetailsType

    const text = createReferenceSubtitle(ref)
    expect(text).toContain('(2020)')
    expect(text).toContain('Web Reference Title')
    expect(text).toContain('Organisation: Some Organisation')
    expect(text).toContain('Updated 12 Mar')
    expect(text).toContain('https://example.com/page')
    expect(text).toContain('Accessed 2026-04-21')
  })

  it('formats internet communication (type 7)', () => {
    const ref = {
      rid: 4,
      ref_type_id: 7,
      date_primary: 2023,
      title_primary: 'Re: Fossils',
      exact_date: '2026-04-21',
      ref_authors: [
        { author_surname: 'Sender', field_id: 2 },
        { author_surname: 'Recipient', field_id: 12 },
      ],
      ref_journal: null,
    } as unknown as ReferenceDetailsType

    const text = createReferenceSubtitle(ref)
    expect(text).toContain('Sender (2023)')
    expect(text).toContain('Subject: Re: Fossils')
    expect(text).toContain('To: Recipient')
    expect(text).toContain('Date: 2026-04-21')
  })
})
