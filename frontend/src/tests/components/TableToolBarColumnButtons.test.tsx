import { describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PageContextProvider } from '@/components/Page'
import { TableToolBar } from '@/components/TableView/TableToolBar'

jest.mock('@/components/CrossSearch/CrossSearchExportMenuItem', () => ({
  CrossSearchExportMenuItem: ({ handleClose }: { handleClose: () => void }) => (
    <button type="button" onClick={handleClose}>
      Cross search export
    </button>
  ),
}))

jest.mock('../../components/CrossSearch/CrossSearchExportMenuItem', () => ({
  CrossSearchExportMenuItem: ({ handleClose }: { handleClose: () => void }) => (
    <button type="button" onClick={handleClose}>
      Cross search export
    </button>
  ),
}))

const exportRows = jest.fn()

jest.mock('@/components/TableView/helpers', () => ({
  exportRows: (...args: unknown[]) => exportRows(...args),
}))

jest.mock('../../components/TableView/helpers', () => ({
  exportRows: (...args: unknown[]) => exportRows(...args),
}))

const createTableMock = (initialVisibility: Record<string, boolean>) => {
  const visibility = { ...initialVisibility }

  const createColumn = (id: string, header: string) => ({
    id,
    columnDef: { header },
    getCanHide: () => true,
    getIsVisible: () => visibility[id] ?? true,
    toggleVisibility: jest.fn((value?: boolean) => {
      visibility[id] = value ?? !visibility[id]
    }),
  })

  const columns = {
    column_a: createColumn('column_a', 'Column A'),
    column_b: createColumn('column_b', 'Column B'),
  }

  const table = {
    getColumn: (id: string) => (columns as Record<string, unknown>)[id],
    getAllLeafColumns: () => Object.values(columns),
  }

  return { table, columns }
}

const renderToolbar = (props?: Partial<React.ComponentProps<typeof TableToolBar>>) => {
  const table = {} as never
  const tableName = 'Test table'

  return render(
    <MemoryRouter>
      <PageContextProvider
        editRights={{}}
        idFieldName="id"
        viewName="test"
        createTitle={() => ''}
        createSubtitle={() => ''}
      >
        <TableToolBar table={table} tableName={tableName} hideLeftButtons={true} {...props} />
      </PageContextProvider>
    </MemoryRouter>
  )
}

describe('TableToolBar', () => {
  it('renders a column visibility button', () => {
    renderToolbar()

    expect(screen.getByRole('button', { name: /show\/hide columns/i })).toBeTruthy()
  })

  it('renders a grouped column visibility menu and toggles a group', () => {
    const { table, columns } = createTableMock({ column_a: false, column_b: false })

    renderToolbar({
      table: table as never,
      columnVisibilityGroups: [{ id: 'test-group', label: 'Test tab', columnIds: ['column_a', 'column_b'] }],
    })

    fireEvent.click(screen.getByRole('button', { name: /show\/hide columns/i }))

    expect(screen.getByRole('menuitem', { name: /test tab/i })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: /column a/i })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: /column b/i })).toBeTruthy()

    fireEvent.click(screen.getByRole('menuitem', { name: /test tab/i }))

    expect(columns.column_a.toggleVisibility).toHaveBeenCalledWith(true)
    expect(columns.column_b.toggleVisibility).toHaveBeenCalledWith(true)
  })

  it('exports table rows from the export menu', () => {
    renderToolbar()

    const exportButton = document.querySelector('#export-button')
    expect(exportButton).toBeTruthy()

    fireEvent.click(exportButton as HTMLElement)

    fireEvent.click(screen.getByRole('menuitem', { name: /export table/i }))

    expect(exportRows).toHaveBeenCalledTimes(1)
  })

  it('renders the cross-search export menu item when enabled', () => {
    renderToolbar({ isCrossSearchTable: true })

    const exportButton = document.querySelector('#export-button')
    expect(exportButton).toBeTruthy()

    fireEvent.click(exportButton as HTMLElement)

    expect(screen.getByRole('button', { name: /cross search export/i })).toBeTruthy()
    expect(screen.queryByRole('menuitem', { name: /export table/i })).toBeNull()
  })
})
