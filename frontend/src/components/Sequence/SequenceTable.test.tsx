import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import tablesReducer from '@/redux/slices/tablesSlice'
import { userReducer } from '@/redux/userReducer'
import { SequenceTable } from './SequenceTable'
import type { Sequence } from '@/shared/types'

jest.mock('../TableView/TableView', () => ({
  TableView: ({ data }: { data?: Sequence[] }) => (
    <div data-testid="sequence-table-view">{data?.map(item => item.seq_name).join(', ')}</div>
  ),
}))

const totalItems = 15
const pageSize = 10

const createSequence = (id: number, name: string): Sequence => {
  return { sequence: id, seq_name: name } as unknown as Sequence
}

const sequencesByPage: Sequence[][] = [
  Array.from({ length: pageSize }, (_, index) => createSequence(index + 1, `Sequence ${index + 1}`)),
  Array.from({ length: totalItems - pageSize }, (_, index) =>
    createSequence(pageSize + index + 1, `Sequence ${pageSize + index + 1}`)
  ),
]

type SequenceQueryArgs = {
  limit?: number
  offset?: number
}

type UseGetSequencesQueryResult = {
  data?: {
    rows: Sequence[]
    full_count: number
    limit: number
    offset: number
  }
  isFetching: boolean
}

type UseGetSequencesQueryMock = jest.Mock<(params?: SequenceQueryArgs) => UseGetSequencesQueryResult>

jest.mock('@/redux/timeUnitReducer', () => {
  const actual = jest.requireActual<typeof import('@/redux/timeUnitReducer')>('@/redux/timeUnitReducer')

  const mockUseGetSequencesQuery: UseGetSequencesQueryMock = jest.fn((params?: SequenceQueryArgs) => {
    const limit = params?.limit ?? pageSize
    const offset = params?.offset ?? 0
    const derivedPageIndex = limit > 0 ? Math.floor(offset / limit) : 0
    const pageData = sequencesByPage[derivedPageIndex] ?? sequencesByPage[0]

    return {
      data: {
        rows: pageData,
        full_count: totalItems,
        limit,
        offset,
      },
      isFetching: false,
    }
  })

  return {
    ...actual,
    useGetSequencesQuery: mockUseGetSequencesQuery,
  }
})

const { useGetSequencesQuery }: { useGetSequencesQuery: UseGetSequencesQueryMock } =
  jest.requireMock('@/redux/timeUnitReducer')

describe('SequenceTable', () => {
  beforeEach(() => {
    useGetSequencesQuery.mockClear()
  })

  const renderSequenceTable = () => {
    const store = configureStore({
      reducer: {
        tables: tablesReducer,
        user: userReducer,
      },
    })

    return render(
      <Provider store={store}>
        <SequenceTable />
      </Provider>
    )
  }

  it('renders pagination metadata and requests subsequent pages when navigating', async () => {
    renderSequenceTable()

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByTestId('sequence-table-view').textContent).toContain('Sequence 1, Sequence 2, Sequence 3')
    })

    const nextButton = screen.getByRole('button', { name: /go to next page/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByTestId('sequence-table-view').textContent).toContain('Sequence 11')
    })

    expect(useGetSequencesQuery).toHaveBeenCalledWith({ limit: pageSize, offset: 0 })
    expect(useGetSequencesQuery).toHaveBeenCalledWith({ limit: pageSize, offset: pageSize })
  })
})
