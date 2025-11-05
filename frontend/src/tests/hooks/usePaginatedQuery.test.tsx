import { describe, expect, it, beforeEach } from '@jest/globals'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import tablesReducer from '@/redux/slices/tablesSlice'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import type { TablesState } from '@/redux/slices/tablesSlice'

type SequenceRow = { id: number; name: string; full_count: number }

const useStaticQuery = (_arg: void) => ({
  data: [
    { id: 1, name: 'Alpha', full_count: 4 },
    { id: 2, name: 'Beta', full_count: 4 },
  ] as SequenceRow[],
})

describe('usePaginatedQuery', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        tables: tablesReducer,
      },
    })
  type TestStore = ReturnType<typeof createStore>
  let store: TestStore

  beforeEach(() => {
    store = createStore()
  })

  it('preserves pagination metadata when selectorFn transforms rows', () => {
    let latestData: Array<{ id: number; label: string; full_count?: number }> | undefined
    let latestPagination: TablesState[string] | null = null

    const TestComponent = () => {
      const result = usePaginatedQuery<void, SequenceRow, { id: number; label: string }>(useStaticQuery, {
        tableId: 'sequences',
        queryArg: undefined,
        selectorFn: row => ({ id: row.id, label: row.name }),
      })
      latestData = result.data
      latestPagination = result.pagination
      return null
    }

    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    )

    expect(latestData?.[0]).toEqual({ id: 1, label: 'Alpha', full_count: 4 })
    expect(latestPagination).toEqual({ totalItems: 4, totalPages: 2, pageIndex: 0, pageSize: 2 })
    expect(store.getState().tables?.sequences).toEqual({
      totalItems: 4,
      totalPages: 2,
      pageIndex: 0,
      pageSize: 2,
    })
  })
})
