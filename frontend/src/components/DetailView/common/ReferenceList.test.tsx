import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import type { AnyReference } from '@/shared/types'
import { ReferenceList } from './ReferenceList'

const references = [
  {
    rid: 123,
    ref_ref: {
      rid: 123,
      ref_type_id: 1,
      ref_authors: [
        {
          author_surname: 'Smith',
          author_initials: 'J',
          field_id: 2,
        },
      ],
      issue: null,
      ref_journal: {
        journal_title: 'Journal Title',
      },
      publisher: null,
      pub_place: null,
      title_primary: 'Primary Title',
      date_primary: 1999,
      volume: null,
      start_page: null,
      end_page: null,
      title_secondary: null,
      gen_notes: null,
    },
  },
  {
    rid: 124,
    ref_ref: {
      rid: 124,
      ref_type_id: 4,
      ref_authors: [
        {
          author_surname: 'Doe',
          author_initials: 'J',
          field_id: 2,
        },
      ],
      title_primary: 'Thesis Title',
      date_primary: 2001,
      misc_1: 'PhD thesis',
      publisher: 'University of Helsinki',
      end_page: 200,
      web_url: 'https://example.com/thesis',
      ref_journal: null,
    },
  },
  {
    rid: 125,
    ref_ref: {
      rid: 125,
      ref_type_id: 6,
      ref_authors: [
        {
          author_surname: 'OrgAuthor',
          author_initials: 'A',
          field_id: 12,
        },
      ],
      title_primary: 'Web Reference Title',
      date_primary: 2020,
      title_secondary: 'Some Organisation',
      misc_1: '12 Mar',
      web_url: 'https://example.com/page',
      exact_date: '2026-04-21',
      ref_journal: null,
    },
  },
] as unknown as AnyReference[]

const ReferenceLocationSpy = () => {
  const location = useLocation()
  return (
    <>
      <div data-testid="reference-path">{`${location.pathname}${location.search}`}</div>
      <div data-testid="reference-state">{JSON.stringify(location.state)}</div>
    </>
  )
}

describe('ReferenceList', () => {
  it('renders descriptive reference text instead of just the identifier', () => {
    render(
      <MemoryRouter>
        <ReferenceList references={references} big />
      </MemoryRouter>
    )

    expect(screen.getByText(/Smith \(1999\).*Primary Title/)).toBeTruthy()
    expect(screen.getByText(/Doe \(2001\).*Thesis Title/)).toBeTruthy()
    expect(screen.getByText(/Web Reference Title/)).toBeTruthy()
    expect(screen.getByText(/Accessed 2026-04-21/)).toBeTruthy()
  })

  it('passes the current location as return state when navigating to reference details', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/locality/1?tab=2']}>
        <Routes>
          <Route path="/locality/:id" element={<ReferenceList references={references} big />} />
          <Route path="/reference/:id" element={<ReferenceLocationSpy />} />
        </Routes>
      </MemoryRouter>
    )

    const viewLinks = screen.getAllByRole('link', { name: /view/i })
    await user.click(viewLinks[0])

    const path = await screen.findByTestId('reference-path')
    expect(path.textContent).toBe('/reference/123')
    const state = screen.getByTestId('reference-state')
    expect(state.textContent).toContain('/locality/1?tab=2')
  })
})
