import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { Notification, NotificationContextProvider } from '@/components/Notification'
import { TimeUnitDetails } from '@/components/TimeUnit/TimeUnitDetails'
import { PageContextProvider } from '@/components/Page'
import type { TimeUnit, TimeUnitDetailsType } from '@/shared/types'
import '@testing-library/jest-dom'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/shared/validators/timeUnit', () => ({
  validateTimeUnit: () => ({ name: 'tu_display_name', error: '' }),
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
  ENV: 'test',
}))

const mockEditTimeUnitMutation = jest.fn()
const mockGetAllTimeUnitsQuery = jest.fn()

jest.mock('@/redux/timeUnitReducer', () => ({
  useGetTimeUnitDetailsQuery: jest.fn(() => ({
    isLoading: false,
    isFetching: false,
    isError: false,
    data: undefined,
  })),
  useEditTimeUnitMutation: jest.fn(() => [mockEditTimeUnitMutation, { isLoading: false }]),
  useDeleteTimeUnitMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useGetAllTimeUnitsQuery: (...args: unknown[]) => mockGetAllTimeUnitsQuery(...args),
}))

jest.mock('@/components/Sequence/SequenceSelect', () => ({
  SequenceSelect: () => <div data-testid="sequence-select" />,
}))

const renderTimeUnitCreation = () =>
  render(
    <NotificationContextProvider>
      <Notification />
      <PageContextProvider<TimeUnitDetailsType>
        editRights={{ new: true, edit: true, delete: true }}
        idFieldName="tu_name"
        viewName="time-unit"
        createTitle={() => ''}
        createSubtitle={() => ''}
      >
        <MemoryRouter initialEntries={[{ pathname: '/time-unit/new' }]}>
          <Routes>
            <Route path="/time-unit/:id" element={<TimeUnitDetails />} />
          </Routes>
        </MemoryRouter>
      </PageContextProvider>
    </NotificationContextProvider>
  )

describe('TimeUnit creation duplicate name handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a warning and disables finalize when the name already exists', async () => {
    const existingTimeUnits = [{ tu_display_name: 'Existing Name', tu_name: 'existingname' } as TimeUnit]
    mockGetAllTimeUnitsQuery.mockReturnValue({ data: existingTimeUnits, isFetching: false, isLoading: false })

    const { container } = renderTimeUnitCreation()

    const nameInput = container.querySelector('input#tu_display_name-textfield') as HTMLInputElement

    const user = userEvent.setup()

    await user.type(nameInput, 'Existing Name')

    await waitFor(() => {
      expect(screen.getByTestId('duplicate-timeunit-warning')).toBeTruthy()
    })

    const finalizeButton = await screen.findByRole('button', { name: /finalize entry/i })
    expect(finalizeButton.hasAttribute('disabled')).toBe(true)
  })

  it('normalizes whitespace and punctuation when checking duplicates', async () => {
    const existingTimeUnits = [{ tu_display_name: 'Existing Name', tu_name: 'existing_name' } as TimeUnit]
    mockGetAllTimeUnitsQuery.mockReturnValue({ data: existingTimeUnits, isFetching: false, isLoading: false })

    const { container } = renderTimeUnitCreation()

    const nameInput = container.querySelector('input#tu_display_name-textfield') as HTMLInputElement

    const user = userEvent.setup()
    await user.type(nameInput, ' Existing   Name- ') // extra whitespace and punctuation

    await waitFor(() => {
      expect(screen.getByTestId('duplicate-timeunit-warning')).toBeTruthy()
    })

    const finalizeButton = await screen.findByRole('button', { name: /finalize entry/i })
    expect(finalizeButton.hasAttribute('disabled')).toBe(true)
  })

  it('prevents finalizing while name availability is loading', async () => {
    mockGetAllTimeUnitsQuery.mockReturnValue({ data: undefined, isFetching: true, isLoading: true })

    const { container } = renderTimeUnitCreation()
    const nameInput = container.querySelector('input#tu_display_name-textfield') as HTMLInputElement
    const user = userEvent.setup()

    await user.type(nameInput, 'Unique Name')

    const finalizeButton = await screen.findByRole('button', { name: /finalize entry/i })
    expect(finalizeButton.hasAttribute('disabled')).toBe(true)
  })

  it('enables finalize when the name is unique', async () => {
    const existingTimeUnits = [{ tu_display_name: 'Existing Name', tu_name: 'existingname' } as TimeUnit]
    mockGetAllTimeUnitsQuery.mockReturnValue({ data: existingTimeUnits, isFetching: false, isLoading: false })

    const { container } = renderTimeUnitCreation()

    const nameInput = container.querySelector('input#tu_display_name-textfield') as HTMLInputElement

    const user = userEvent.setup()
    await user.type(nameInput, 'Unique Name')

    await waitFor(() => {
      expect(screen.queryByTestId('duplicate-timeunit-warning')).toBeNull()
    })

    const finalizeButton = await screen.findByRole('button', { name: /finalize entry/i })
    expect(finalizeButton.hasAttribute('disabled')).toBe(false)
  })

  it('surfaces a backend duplicate name error', async () => {
    mockGetAllTimeUnitsQuery.mockReturnValue({ data: [], isFetching: false, isLoading: false })
    mockEditTimeUnitMutation.mockReturnValue({
      unwrap: () =>
        Promise.reject(
          Object.assign(new Error('duplicate time unit'), {
            status: 409,
            data: { code: 'duplicate_name', message: 'Time unit with the provided name already exists' },
          })
        ),
    })

    const { container } = renderTimeUnitCreation()

    const nameInput = container.querySelector('input#tu_display_name-textfield') as HTMLInputElement
    const user = userEvent.setup()

    await user.type(nameInput, 'New Unique Name')

    const finalizeButton = await screen.findByRole('button', { name: /finalize entry/i })
    await user.click(finalizeButton)

    const completeButton = await screen.findByRole('button', { name: /complete and save/i })
    await user.click(completeButton)

    const duplicateWarning: HTMLElement = await screen.findByText(/Time unit with the provided name already exists/i)
    expect(duplicateWarning.textContent ?? '').toContain('Time unit with the provided name already exists')
  })
})
