import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import '@testing-library/jest-dom'
import { skipToken } from '@reduxjs/toolkit/query'

import { Notification, NotificationContextProvider } from '@/components/Notification'
import { PageContextProvider } from '@/components/Page'
import { TimeBoundDetails } from '@/components/TimeBound/TimeBoundDetails'
import type { TimeBoundDetailsType, TimeUnit } from '@/shared/types'

jest.mock('@/shared/validators/timeBound', () => ({
  validateTimeBound: () => ({ name: '', error: '' }),
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
  ENV: 'test',
}))

jest.mock('@/components/DetailView/DetailBrowser', () => ({
  DetailBrowser: () => <div data-testid="detail-browser" />,
}))

const mockGetTimeBoundDetailsQuery = jest.fn()
const mockGetTimeBoundTimeUnitsQuery = jest.fn()
const mockEditTimeBoundMutation = jest.fn()
const mockDeleteTimeBoundMutation = jest.fn()

jest.mock('@/redux/timeBoundReducer', () => ({
  useGetTimeBoundDetailsQuery: (...args: unknown[]) => mockGetTimeBoundDetailsQuery(...args),
  useGetTimeBoundTimeUnitsQuery: (...args: unknown[]) => mockGetTimeBoundTimeUnitsQuery(...args),
  useEditTimeBoundMutation: () => [mockEditTimeBoundMutation, { isLoading: false }],
  useDeleteTimeBoundMutation: () => [mockDeleteTimeBoundMutation, { isSuccess: false, isError: false }],
}))

const baseTimeBound: TimeBoundDetailsType = {
  bid: 1,
  b_name: 'Test Bound',
  age: 12,
  b_comment: '',
  now_bau: [],
} as unknown as TimeBoundDetailsType

const renderTimeBound = (initialEntry: string) => {
  let currentSearch = ''

  const LocationTracker = () => {
    const location = useLocation()
    currentSearch = location.search
    return null
  }

  render(
    <NotificationContextProvider>
      <Notification />
      <PageContextProvider<TimeBoundDetailsType>
        editRights={{ new: true, edit: true, delete: true }}
        idFieldName="bid"
        viewName="time-bound"
        createTitle={() => ''}
        createSubtitle={() => ''}
      >
        <MemoryRouter initialEntries={[initialEntry]}>
          <LocationTracker />
          <Routes>
            <Route element={<TimeBoundDetails />} path="/time-bound/:id" />
          </Routes>
        </MemoryRouter>
      </PageContextProvider>
    </NotificationContextProvider>
  )

  return () => currentSearch
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetTimeBoundDetailsQuery.mockReturnValue({
    isLoading: false,
    isFetching: false,
    isError: false,
    data: baseTimeBound,
  })
  mockGetTimeBoundTimeUnitsQuery.mockReturnValue({
    data: [],
    isError: false,
    isLoading: false,
    isFetching: false,
    refetch: jest.fn(),
  })
})

describe('Time Units tab', () => {
  it('loads time units when tab is selected and syncs tab query param', async () => {
    const user = userEvent.setup()
    const timeUnits: TimeUnit[] = [
      {
        tu_name: 'TU1',
        tu_display_name: 'Sample Unit',
        seq_name: 'Sequence 1',
        rank: 'Stage',
        low_bound: 1,
        up_bound: 1,
      },
    ]

    mockGetTimeBoundTimeUnitsQuery.mockReturnValue({
      data: timeUnits,
      isError: false,
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    })

    const getLocationSearch = renderTimeBound('/time-bound/1?tab=0')

    await user.click(screen.getByRole('tab', { name: /time units/i }))

    expect(mockGetTimeBoundTimeUnitsQuery).toHaveBeenCalledWith(1)
    const unitRow = await screen.findByText('Sample Unit')
    expect(unitRow).toBeTruthy()
    expect(getLocationSearch()).toBe('?tab=1')
  })

  it('shows retry controls when loading time units fails', async () => {
    const user = userEvent.setup()
    const refetch = jest.fn()
    mockGetTimeBoundTimeUnitsQuery.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      isFetching: false,
      refetch,
    })

    renderTimeBound('/time-bound/1?tab=1')

    const errorAlert = await screen.findByTestId('time-units-error')
    expect(errorAlert).toBeTruthy()

    await user.click(screen.getByTestId('time-units-retry'))
    expect(refetch).toHaveBeenCalled()
  })

  it('displays guidance instead of fetching on new time bounds', async () => {
    renderTimeBound('/time-bound/new?tab=1')

    const guidance = await screen.findByTestId('time-units-disabled')
    expect(guidance).toBeTruthy()
    expect(mockGetTimeBoundTimeUnitsQuery).toHaveBeenCalledWith(skipToken)
  })
})
