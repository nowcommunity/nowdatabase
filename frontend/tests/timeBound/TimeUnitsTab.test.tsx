import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { skipToken } from '@reduxjs/toolkit/query'

import { TimeUnitTab } from '@/components/TimeBound/Tabs/TimeUnitTab'
import { DetailContext, type DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, TimeBoundDetailsType, TimeUnit } from '@/shared/types'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
  ENV: 'test',
}))

jest.mock('@/components/DetailView/common/SimpleTable', () => ({
  SimpleTable: ({ data }: { data: TimeUnit[] }) => (
    <div data-testid="simple-table">
      {data.map(unit => (
        <div key={unit.tu_name}>{unit.tu_display_name}</div>
      ))}
    </div>
  ),
}))

const mockGetTimeBoundTimeUnitsQuery = jest.fn()

jest.mock('@/redux/timeBoundReducer', () => ({
  useGetTimeBoundTimeUnitsQuery: (...args: unknown[]) => mockGetTimeBoundTimeUnitsQuery(...args),
}))

const baseTimeBound: TimeBoundDetailsType = {
  bid: 1,
  b_name: 'Test Bound',
  age: 12,
  b_comment: '',
  now_bau: [],
} as unknown as TimeBoundDetailsType

const createDetailContextValue = (overrides: Partial<DetailContextType<TimeBoundDetailsType>> = {}) =>
  ({
    data: baseTimeBound,
    mode: modeOptionToMode.read,
    setMode: () => {},
    editData: { bid: 1 } as unknown as EditDataType<TimeBoundDetailsType>,
    setEditData: () => {},
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => {},
    ...overrides,
  }) as DetailContextType<TimeBoundDetailsType>

const renderTimeUnitTab = (overrides: Partial<DetailContextType<TimeBoundDetailsType>> = {}) => {
  const contextValue = createDetailContextValue(overrides)
  render(
    <DetailContext.Provider value={contextValue as unknown as DetailContextType<unknown>}>
      <TimeUnitTab />
    </DetailContext.Provider>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetTimeBoundTimeUnitsQuery.mockReturnValue({
    data: [],
    isError: false,
    isLoading: false,
    isFetching: false,
    refetch: jest.fn(),
  })
})

describe('Time Units tab', () => {
  it('loads time units when bound id is present', async () => {
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

    renderTimeUnitTab()

    expect(mockGetTimeBoundTimeUnitsQuery).toHaveBeenCalledWith(1)
    const unitRow = await screen.findByText('Sample Unit')
    expect(unitRow).toBeTruthy()
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

    renderTimeUnitTab()

    const errorAlert = await screen.findByTestId('time-units-error')
    expect(errorAlert).toBeTruthy()

    await user.click(screen.getByTestId('time-units-retry'))
    expect(refetch).toHaveBeenCalled()
  })

  it('displays guidance instead of fetching on new time bounds', async () => {
    renderTimeUnitTab({
      mode: modeOptionToMode.new,
      data: { bid: undefined } as unknown as TimeBoundDetailsType,
    })

    const guidance = await screen.findByTestId('time-units-disabled')
    expect(guidance).toBeTruthy()
    expect(mockGetTimeBoundTimeUnitsQuery).toHaveBeenCalledWith(skipToken)
  })
})
