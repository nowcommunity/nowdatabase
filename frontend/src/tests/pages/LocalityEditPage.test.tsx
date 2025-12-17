import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LocalityEditPage } from '@/pages/localities/LocalityEditPage'
import type { LocalityDetailsType } from '@/shared/types'
import { emptyLocality } from '@/components/DetailView/common/defaultValues'

const mockUpdateLocality = jest.fn()
const mockNotify = jest.fn()
const mockRefetch = jest.fn()

const baseLocality: LocalityDetailsType = {
  ...emptyLocality,
  lid: 42,
  loc_name: 'Existing locality',
  country: 'Finland',
  dec_lat: 60,
  dec_long: 25,
}

const mockUseGetLocalityDetailsQuery = jest.fn()

jest.mock('@/redux/localityReducer', () => ({
  useEditLocalityMutation: () => [mockUpdateLocality, { isLoading: false }],
  useGetLocalityDetailsQuery: (arg: unknown) => mockUseGetLocalityDetailsQuery(arg),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={['/localities/42/edit']}>
      <Routes>
        <Route
          path="/localities/:id/edit"
          element={
            <>
              <LocationDisplay />
              <LocalityEditPage />
            </>
          }
        />
        <Route path="/locality/:id" element={<div>Locality detail</div>} />
        <Route path="/locality" element={<div>Locality list</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('LocalityEditPage unsaved changes prompts', () => {
  beforeEach(() => {
    mockUpdateLocality.mockReturnValue({ unwrap: () => Promise.resolve({ id: 42 }) })
    mockUseGetLocalityDetailsQuery.mockReturnValue({
      data: baseLocality,
      isFetching: false,
      isError: false,
      refetch: mockRefetch,
    })
    mockNotify.mockReset()
  })

  it('shows a blocker when navigating away with dirty changes and cancelling keeps the user on the page', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.clear(screen.getByLabelText('Locality Name'))
    await user.type(screen.getByLabelText('Locality Name'), 'Updated name')

    await user.click(screen.getByRole('button', { name: /return to locality/i }))

    expect(await screen.findByText(/unsaved changes/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /stay on page/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/localities/42/edit')
    })
  })

  it('allows navigation away after confirming leave on dirty form', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.type(screen.getByLabelText('Country'), ' update')
    await user.click(screen.getByRole('button', { name: /back to localities/i }))

    expect(await screen.findByText(/unsaved changes/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /leave page/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/locality')
    })
  })

  it('navigates without prompting when no changes were made', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.click(screen.getByRole('button', { name: /return to locality/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/locality/42')
    })
    expect(screen.queryByText(/unsaved changes/i)).toBeNull()
  })
})
