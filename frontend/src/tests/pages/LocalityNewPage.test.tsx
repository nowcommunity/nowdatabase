import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LocalityCreatePage } from '@/pages/localities/LocalityCreatePage'

const mockNotify = jest.fn()
const mockCreateLocality = jest.fn()

jest.mock('@/redux/localityReducer', () => ({
  useEditLocalityMutation: () => [mockCreateLocality, { isLoading: false }],
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
    <MemoryRouter initialEntries={['/localities/new']}>
      <Routes>
        <Route
          path="/localities/new"
          element={
            <>
              <LocationDisplay />
              <LocalityCreatePage />
            </>
          }
        />
        <Route path="/locality" element={<div>Locality list</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('LocalityCreatePage unsaved changes prompts', () => {
  beforeEach(() => {
    mockNotify.mockReset()
    mockCreateLocality.mockReturnValue({ unwrap: () => Promise.resolve({ id: 101 }) })
  })

  it('blocks navigation with a dialog when the form is dirty and the user cancels', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.type(screen.getByLabelText('Locality Name'), 'Test Locality')

    await user.click(screen.getByRole('button', { name: /back to localities/i }))

    expect(await screen.findByText(/unsaved changes/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /stay on page/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/localities/new')
    })
    expect(screen.queryByText(/unsaved changes/i)).toBeNull()
  })

  it('navigates away when the user confirms leaving with dirty changes', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.type(screen.getByLabelText('Locality Name'), 'Test Locality')
    await user.click(screen.getByRole('button', { name: /back to localities/i }))

    expect(await screen.findByText(/unsaved changes/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /leave page/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/locality')
    })
  })

  it('allows navigation without prompting when the form is clean', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.click(screen.getByRole('button', { name: /back to localities/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/locality')
    })
    expect(screen.queryByText(/unsaved changes/i)).toBeNull()
  })
})
