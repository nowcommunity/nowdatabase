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
          field_id: 1,
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

    await user.click(screen.getByRole('link', { name: /view/i }))

    const path = await screen.findByTestId('reference-path')
    expect(path.textContent).toBe('/reference/123')
    const state = screen.getByTestId('reference-state')
    expect(state.textContent).toContain('/locality/1?tab=2')
  })
})
