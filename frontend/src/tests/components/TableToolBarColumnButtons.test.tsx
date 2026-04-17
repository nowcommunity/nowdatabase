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
