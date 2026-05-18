import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { PageContextProvider } from '@/components/Page'
import { TableView } from '@/components/TableView/TableView'
import { getLastMaterialReactTableOptions } from 'material-react-table'
import { NotificationContextProvider } from '@/components/Notification'

type CapturedMrtOptions = {
  enableColumnFilterModes?: boolean
  columnFilterModeOptions?: string[]
  columns: Array<{
    accessorKey?: string
    enableColumnFilterModes?: boolean
    columnFilterModeOptions?: string[] | null
    filterVariant?: string
  }>
  initialState?: {
    columnFilterFns?: Record<string, string>
  }
}

type Row = {
  rid: number
  title: string
  year: number
}

const renderTable = (columns: React.ComponentProps<typeof TableView<Row>>['columns']) => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <NotificationContextProvider>
          <PageContextProvider
            editRights={{}}
            idFieldName="rid"
            viewName="test"
            createTitle={() => ''}
            createSubtitle={() => ''}
          >
            <TableView<Row>
              title="Test"
              idFieldName="rid"
              columns={columns}
              visibleColumns={{}}
              data={[]}
              isFetching={false}
              selectorFn={() => {}}
            />
          </PageContextProvider>
        </NotificationContextProvider>
      </MemoryRouter>
    </Provider>
  )
}

describe('TableView filter modes', () => {
  it('defaults to equals and exposes allowed filter modes for non-id columns', () => {
    renderTable([
      { accessorKey: 'rid', header: 'Id' },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'year', header: 'Year', filterVariant: 'range' },
    ])

    const options = getLastMaterialReactTableOptions<CapturedMrtOptions>()
    expect(options).toBeTruthy()
    if (!options) return

    expect(options.enableColumnFilterModes).toEqual(true)
    expect(options.columnFilterModeOptions).toEqual(['equals', 'contains', 'startsWith'])

    const ridColumn = options.columns.find(c => c.accessorKey === 'rid')
    expect(ridColumn).toBeTruthy()
    if (!ridColumn) return
    expect(ridColumn.enableColumnFilterModes).toEqual(false)
    expect(ridColumn.columnFilterModeOptions).toEqual(['equals'])

    const titleColumn = options.columns.find(c => c.accessorKey === 'title')
    expect(titleColumn).toBeTruthy()
    if (!titleColumn) return
    expect(titleColumn.enableColumnFilterModes).toEqual(true)
    expect(titleColumn.columnFilterModeOptions).toEqual(['equals', 'contains', 'startsWith'])

    const yearColumn = options.columns.find(c => c.accessorKey === 'year')
    expect(yearColumn).toBeTruthy()
    if (!yearColumn) return
    expect(yearColumn.enableColumnFilterModes).toEqual(false)
    expect(yearColumn.columnFilterModeOptions).toEqual(null)

    expect(options.initialState?.columnFilterFns?.rid).toEqual('equals')
    expect(options.initialState?.columnFilterFns?.title).toEqual('equals')
    expect(options.initialState?.columnFilterFns?.year).toBeUndefined()
  })
})
