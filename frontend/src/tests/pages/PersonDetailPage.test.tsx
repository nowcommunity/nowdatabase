import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { PersonDetailPage } from '@/pages/PersonDetailPage'

jest.mock('@/components/Person/PersonDetails', () => ({
  PersonDetails: () => <div data-testid="person-details">details</div>,
}))

const mockUseGetPersonDetailsQuery = jest.fn()
const mockUseUser = jest.fn()

jest.mock('@/redux/personReducer', () => ({
  useGetPersonDetailsQuery: (arg?: unknown) => mockUseGetPersonDetailsQuery(arg),
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
}))

/**
 * Manual verification: log in as a non-admin user, navigate directly to `/person/<existing-id>`,
 * and confirm the permission message appears instead of the spinner.
 */
describe('PersonDetailPage', () => {
  beforeEach(() => {
    mockUseGetPersonDetailsQuery.mockReset()
    mockUseUser.mockReturnValue({ initials: 'JD', token: 'token-123' })
  })

  it('shows the permission denied view when details query returns 403', () => {
    mockUseGetPersonDetailsQuery.mockReturnValue({
      isError: true,
      error: { status: 403, data: {} } as FetchBaseQueryError,
    })

    render(
      <MemoryRouter initialEntries={['/person/JD']}>
        <Routes>
          <Route path="/person/:id" element={<PersonDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('You do not have access to this person')).toBeTruthy()
    expect(screen.queryByTestId('person-details')).toBeNull()
  })

  it('renders the person details when authorized', () => {
    mockUseGetPersonDetailsQuery.mockReturnValue({ isError: false })

    render(
      <MemoryRouter initialEntries={['/person/JD']}>
        <Routes>
          <Route path="/person/:id" element={<PersonDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('person-details')).toBeTruthy()
  })

  it('asks the visitor to sign in when no user token is present', () => {
    mockUseUser.mockReturnValue({ initials: null, token: null })
    mockUseGetPersonDetailsQuery.mockReturnValue({ isError: false })

    render(
      <MemoryRouter initialEntries={['/person/JD']}>
        <Routes>
          <Route path="/person/:id" element={<PersonDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Sign in to view this person')).toBeTruthy()
    expect(screen.queryByTestId('person-details')).toBeNull()
  })
})
