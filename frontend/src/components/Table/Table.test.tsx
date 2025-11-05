import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Table } from './Table'
import tablesReducer, { TablePaginationMetadata, TablesState } from '@/redux/slices/tablesSlice'

const renderTable = (
  metadata: TablePaginationMetadata | null,
  options: { placement?: 'top' | 'bottom' | 'both'; hideWhenEmpty?: boolean } = {}
) => {
  const tablesState: TablesState = metadata ? { example: metadata } : {}
  const store = configureStore({
    reducer: { tables: tablesReducer },
    preloadedState: {
      tables: tablesState,
    },
  })

  return render(
    <Provider store={store}>
      <Table tableId="example" paginationPlacement={options.placement} hidePaginationWhenEmpty={options.hideWhenEmpty}>
        <div>content</div>
      </Table>
    </Provider>
  )
}

describe('Table', () => {
  const baseMetadata: TablePaginationMetadata = {
    pageIndex: 0,
    pageSize: 10,
    totalItems: 25,
    totalPages: 3,
  }

  it('renders pagination controls when metadata is available', () => {
    renderTable(baseMetadata)

    expect(screen.getByText('Page 1 of 3')).toBeDefined()
  })

  it('supports rendering pagination at the top for selector tables', () => {
    renderTable(baseMetadata, { placement: 'top' })

    expect(screen.getByText('Page 1 of 3')).toBeDefined()
  })

  it('can hide pagination when empty if requested', () => {
    renderTable({ ...baseMetadata, totalItems: 0 }, { hideWhenEmpty: true })

    expect(screen.queryByText('Page 1 of 3')).toBeNull()
  })
})
