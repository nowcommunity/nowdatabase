import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { applyDefaultSpeciesOrdering, DetailTabTable, hasActiveSortingInSearch } from './DetailTabTable'

const tableViewMock = jest.fn<(props: Record<string, unknown>) => JSX.Element>()
const useMaterialReactTableMock = jest.fn<(options: Record<string, unknown>) => Record<string, unknown>>()

type CapturedMrtOptions = {
  data?: Array<{ id: number; name: string }>
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  state?: {
    pagination?: {
      pageIndex: number
      pageSize: number
    }
  }
  muiTableProps?: {
    'data-cy'?: string
  }
  muiTableHeadCellProps?: (args: { column: { id: string } }) => {
    'data-cy'?: string
  }
  muiTableBodyCellProps?: (args: { cell: { column: { id: string } } }) => {
    'data-cy'?: string
  }
}

jest.mock('@/components/TableView/TableView', () => ({
  TableView: (props: Record<string, unknown>) => tableViewMock(props),
}))

jest.mock('material-react-table', () => ({
  useMaterialReactTable: (options: Record<string, unknown>) => useMaterialReactTableMock(options),
  MaterialReactTable: () => {
    const options = useMaterialReactTableMock.mock.calls.at(-1)?.[0] as CapturedMrtOptions | undefined
    const data = options?.data ?? []
    const pagination = options?.state?.pagination ?? { pageIndex: 0, pageSize: data.length }
    const firstVisibleRow = pagination.pageIndex * pagination.pageSize
    const visibleRows = data.slice(firstVisibleRow, firstVisibleRow + pagination.pageSize)

    return (
      <div data-testid="material-react-table">
        {visibleRows.map(row => (
          <div key={row.id} data-testid={`detail-table-row-${row.id}`}>
            {row.name}
          </div>
        ))}
      </div>
    )
  },
}))

type TestRow = {
  id: number
  name: string
}

const PaginationHarness = ({ data }: { data: TestRow[] }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  return (
    <DetailTabTable<TestRow>
      mode="edit"
      data={data}
      columns={[{ accessorKey: 'name', header: 'Name' }]}
      paginationState={pagination}
      onPaginationChange={setPagination}
    />
  )
}

describe('DetailTabTable', () => {
  beforeEach(() => {
    tableViewMock.mockReset()
    useMaterialReactTableMock.mockReset()
    tableViewMock.mockReturnValue(<div data-testid="table-view" />)
    useMaterialReactTableMock.mockReturnValue({})
  })

  it('maps read mode props to TableView', () => {
    render(
      <DetailTabTable<TestRow>
        mode="read"
        title="Read table"
        data={[{ id: 1, name: 'Alpha' }]}
        columns={[
          { accessorKey: 'id', header: 'Id' },
          { accessorKey: 'name', header: 'Name' },
        ]}
        idFieldName="id"
        url="species"
        isFetching={false}
        enableColumnFilterModes={true}
      />
    )

    expect(screen.getByTestId('table-view')).toBeTruthy()
    expect(tableViewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Read table',
        idFieldName: 'id',
        url: 'species',
        enableColumnFilterModes: true,
      })
    )
  })

  it('renders editable mode via MaterialReactTable setup', () => {
    render(
      <DetailTabTable<TestRow>
        mode="edit"
        data={[{ id: 1, name: 'Alpha' }]}
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        enableSorting={false}
        enableColumnActions={false}
        tableName="Editable table"
      />
    )

    expect(screen.getByTestId('material-react-table')).toBeTruthy()
    expect(useMaterialReactTableMock).toHaveBeenCalledWith(
      expect.objectContaining({
        enableSorting: false,
        enableColumnActions: false,
        enablePagination: true,
      })
    )

    const options = useMaterialReactTableMock.mock.calls[0]?.[0] as CapturedMrtOptions | undefined
    expect(options?.muiTableProps?.['data-cy']).toEqual('Editable-table-table')
    expect(options?.muiTableHeadCellProps?.({ column: { id: 'name' } })['data-cy']).toEqual('table-header-name')
    expect(options?.muiTableBodyCellProps?.({ cell: { column: { id: 'name' } } })['data-cy']).toEqual('table-cell-name')
  })

  it('updates visible rows when page size or page index changes', async () => {
    const expectVisibleRows = async (ids: number[]) => {
      await waitFor(() => {
        expect(screen.getAllByTestId(/^detail-table-row-/)).toHaveLength(ids.length)
        ids.forEach(id => {
          expect(screen.getByTestId(`detail-table-row-${id}`)).toBeTruthy()
        })
      })
    }
    const data = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
    }))

    render(<PaginationHarness data={data} />)

    await expectVisibleRows([1, 2, 3, 4, 5])

    const initialOptions = useMaterialReactTableMock.mock.calls.at(-1)?.[0] as CapturedMrtOptions
    act(() => {
      initialOptions.onPaginationChange?.({ pageIndex: 0, pageSize: 10 })
    })
    await expectVisibleRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const pageSizeOptions = useMaterialReactTableMock.mock.calls.at(-1)?.[0] as CapturedMrtOptions
    act(() => {
      pageSizeOptions.onPaginationChange?.({ pageIndex: 1, pageSize: 5 })
    })
    await expectVisibleRows([6, 7, 8, 9, 10])
  })
})

describe('default species ordering helpers', () => {
  it('applies fallback species ordering when sorting is not active', () => {
    const rows = [
      { order_name: 'Rodentia', family_name: 'Muridae', genus_name: 'Mus', species_name: 'musculus' },
      { order_name: 'Artiodactyla', family_name: 'Bovidae', genus_name: 'Bos', species_name: 'taurus' },
      { order_name: 'Artiodactyla', family_name: 'Cervidae', genus_name: 'Cervus', species_name: 'elaphus' },
    ]

    const ordered = applyDefaultSpeciesOrdering(rows)

    expect(ordered?.map(row => `${row.order_name}:${row.family_name}:${row.genus_name}:${row.species_name}`)).toEqual([
      'Artiodactyla:Bovidae:Bos:taurus',
      'Artiodactyla:Cervidae:Cervus:elaphus',
      'Rodentia:Muridae:Mus:musculus',
    ])
  })

  it('does not apply fallback ordering when explicit sorting exists in url', () => {
    const search = '?sorting=' + encodeURIComponent(JSON.stringify([{ id: 'species_name', desc: true }]))
    expect(hasActiveSortingInSearch(search)).toBe(true)

    const rows = [
      { order_name: 'Rodentia', family_name: 'Muridae', genus_name: 'Mus', species_name: 'musculus' },
      { order_name: 'Artiodactyla', family_name: 'Bovidae', genus_name: 'Bos', species_name: 'taurus' },
    ]

    const ordered = applyDefaultSpeciesOrdering(rows, { skip: hasActiveSortingInSearch(search) })

    expect(ordered).toBe(rows)
  })
})
