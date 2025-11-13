import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { PersonListPage } from '@/pages/PersonListPage'

jest.mock('@/components/Person/PersonTable', () => ({
  PersonTable: () => <div data-testid="person-table">table</div>,
}))

const mockUseGetAllPersonsQuery = jest.fn()

jest.mock('@/redux/personReducer', () => ({
  useGetAllPersonsQuery: (arg?: unknown) => mockUseGetAllPersonsQuery(arg),
}))

/**
 * Manual verification: log in as a non-admin user and browse directly to `/person`.
 * Confirm the permission denied message renders instead of the loading indicator.
 */
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
      screen.getByText(
        'Your account is not allowed to browse the people directory. Please contact an administrator if you believe this is a mistake.'
      )
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
