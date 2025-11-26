import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { Notification, NotificationContextProvider } from '@/components/Notification'
import { TimeUnitDetails } from '@/components/TimeUnit/TimeUnitDetails'
import { useDeleteTimeUnitMutation, useEditTimeUnitMutation, useGetTimeUnitDetailsQuery } from '@/redux/timeUnitReducer'
import type { TimeUnitDetailsType } from '@/shared/types'

jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: ({ deleteFunction }: { deleteFunction?: () => Promise<void> }) => (
    <button onClick={() => void deleteFunction?.()}>Delete</button>
  ),
}))

jest.mock('@/components/TimeUnit/Tabs/TimeUnitTab', () => ({ TimeUnitTab: () => <div>TimeUnit Tab</div> }))
jest.mock('@/components/TimeUnit/Tabs/LocalityTab', () => ({ LocalityTab: () => <div>Locality Tab</div> }))
jest.mock('@/components/DetailView/common/UpdateTab', () => ({ UpdateTab: () => <div>Update Tab</div> }))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
  ENV: 'test',
}))

jest.mock('@/redux/timeUnitReducer', () => ({
  useGetTimeUnitDetailsQuery: jest.fn(),
  useEditTimeUnitMutation: jest.fn(),
  useDeleteTimeUnitMutation: jest.fn(),
}))

const navigateMock = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: jest.fn(() => navigateMock),
  }
})

const conflictError = Object.assign(new Error('Cannot delete: in use by localities'), {
  status: 409,
  data: { message: 'Cannot delete: in use by localities' },
})
const fallbackError = Object.assign(new Error('Delete failed'), { status: 409, data: {} })
const mockTimeUnit = { tu_display_name: 'Bahean' } as TimeUnitDetailsType
const mockDeleteTrigger = jest.fn()

const renderWithProviders = () =>
  render(
    <NotificationContextProvider>
      <Notification />
      <MemoryRouter initialEntries={[{ pathname: '/time-unit/Bahean' }]}>
        <Routes>
          <Route path="/time-unit/:id" element={<TimeUnitDetails />} />
        </Routes>
      </MemoryRouter>
    </NotificationContextProvider>
  )

describe('TimeUnitDetails deletion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    navigateMock.mockReset()
    ;(useGetTimeUnitDetailsQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: mockTimeUnit,
    })
    ;(useEditTimeUnitMutation as jest.Mock).mockReturnValue([
      jest.fn(() => ({ unwrap: jest.fn() })),
      { isLoading: false },
    ])
    ;(useDeleteTimeUnitMutation as jest.Mock).mockReturnValue([mockDeleteTrigger, { isLoading: false }])
  })

  it('shows a server-provided conflict message when deletion fails', async () => {
    const user = userEvent.setup()
    mockDeleteTrigger.mockReturnValueOnce({ unwrap: () => Promise.reject(conflictError) })

    renderWithProviders()

    await user.click(await screen.findByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(screen.getByText('Cannot delete: in use by localities')).toBeTruthy()
    })
  })

  it('falls back to a generic message when the error has no details', async () => {
    const user = userEvent.setup()
    mockDeleteTrigger.mockReturnValueOnce({ unwrap: () => Promise.reject(fallbackError) })

    renderWithProviders()

    await user.click(await screen.findByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(screen.getByText('Could not delete item. Error happened.')).toBeTruthy()
    })
  })

  it('navigates away and shows success feedback when deletion succeeds', async () => {
    const user = userEvent.setup()
    mockDeleteTrigger.mockReturnValueOnce({ unwrap: () => Promise.resolve() })

    renderWithProviders()

    await user.click(await screen.findByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(screen.getByText('Deleted item successfully.')).toBeTruthy()
      expect(navigateMock).toHaveBeenCalledWith('/time-unit')
    })
  })
})
