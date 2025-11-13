import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { PermissionDenied } from '@/components/PermissionDenied'
import { PersonListPage } from '@/pages/PersonListPage'
import { PersonDetailPage } from '@/pages/PersonDetailPage'

jest.mock('@/components/Person/PersonTable', () => ({
  PersonTable: () => <div data-testid="person-table">table</div>,
}))

jest.mock('@/components/Person/PersonDetails', () => ({
  PersonDetails: () => <div data-testid="person-details">details</div>,
}))

const mockUseGetAllPersonsQuery = jest.fn()
const mockUseGetPersonDetailsQuery = jest.fn()
const mockUseUser = jest.fn()

jest.mock('@/redux/personReducer', () => ({
  useGetAllPersonsQuery: (arg?: unknown) => mockUseGetAllPersonsQuery(arg),
  useGetPersonDetailsQuery: (arg?: unknown) => mockUseGetPersonDetailsQuery(arg),
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
}))

describe('permission denied component', () => {
  it('renders provided message copy', () => {
    render(
      <MemoryRouter>
        <PermissionDenied title="Blocked" message="Stop" actionHref={undefined} />
      </MemoryRouter>
    )

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('Blocked')).toBeTruthy()
    expect(screen.getByText('Stop')).toBeTruthy()
  })
})

describe('PersonListPage', () => {
  beforeEach(() => {
    mockUseGetAllPersonsQuery.mockReset()
  })

  it('shows the permission denied view when the list query returns 403', () => {
    mockUseGetAllPersonsQuery.mockReturnValue({
      isError: true,
      error: { status: 403, data: {} } as FetchBaseQueryError,
    })

    render(
      <MemoryRouter>
        <PersonListPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Your account is not allowed to browse the people directory. Please contact an administrator if you believe this is a mistake.')
    ).toBeTruthy()
    expect(screen.queryByTestId('person-table')).toBeNull()
  })

  it('renders the table when no authorization error occurs', () => {
    mockUseGetAllPersonsQuery.mockReturnValue({ isError: false })

    render(
      <MemoryRouter>
        <PersonListPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('person-table')).toBeTruthy()
  })
})

describe('PersonDetailPage', () => {
  beforeEach(() => {
    mockUseGetPersonDetailsQuery.mockReset()
    mockUseUser.mockReturnValue({ initials: 'JD' })
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
})
