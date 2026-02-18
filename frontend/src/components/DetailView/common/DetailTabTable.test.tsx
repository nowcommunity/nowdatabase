import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { applyDefaultSpeciesOrdering, DetailTabTable, hasActiveSortingInSearch } from './DetailTabTable'

const tableViewMock = jest.fn<(props: Record<string, unknown>) => JSX.Element>()
const useMaterialReactTableMock = jest.fn<(options: Record<string, unknown>) => Record<string, unknown>>()

jest.mock('@/components/TableView/TableView', () => ({
  TableView: (props: Record<string, unknown>) => tableViewMock(props),
}))

jest.mock('material-react-table', () => ({
  useMaterialReactTable: (options: Record<string, unknown>) => useMaterialReactTableMock(options),
  MaterialReactTable: () => <div data-testid="material-react-table" />,
}))

type TestRow = {
  id: number
  name: string
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
