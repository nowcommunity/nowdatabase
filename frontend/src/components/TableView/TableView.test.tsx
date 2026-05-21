import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Role } from '@/shared/types'
import { TableView } from './TableView'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'

jest.mock('material-react-table', () => ({
  useMaterialReactTable: () => ({
    getPrePaginationRowModel: () => ({ rows: [] }),
  }),
  MaterialReactTable: () => <div data-testid="material-react-table" />,
}))

jest.mock('../Page', () => ({
  usePageContext: jest.fn(),
}))

jest.mock('@/hooks/user', () => ({
  useUser: jest.fn(),
}))

let mockLocationSearch = ''
let mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<typeof import('react-router-dom')>('react-router-dom'),
  useLocation: () => ({ search: mockLocationSearch, pathname: '/table' }),
  useNavigate: () => mockNavigate,
}))

jest.mock('./TableToolBar', () => ({
  TableToolBar: () => <div data-testid="table-toolbar" />,
}))

type TestRow = {
  id: string
  name: string
  full_count?: number
}

const mockUsePageContext = usePageContext as jest.Mock
const mockUseUser = useUser as jest.Mock

describe('TableView table help integration', () => {
  beforeEach(() => {
    mockLocationSearch = ''
    mockNavigate = jest.fn()
    window.sessionStorage.clear()
    mockUsePageContext.mockReturnValue({
      editRights: {},
      idList: [],
      idFieldName: 'id',
      viewName: 'test',
      previousTableUrls: [],
      createTitle: () => '',
      createSubtitle: () => '',
      sqlLimit: 25,
      sqlOffset: 0,
      sqlColumnFilters: [],
      sqlOrderBy: [],
      setIdList: jest.fn(),
      setSqlLimit: jest.fn(),
      setSqlOffset: jest.fn(),
      setSqlColumnFilters: jest.fn(),
      setSqlOrderBy: jest.fn(),
      setPreviousTableUrls: jest.fn(),
    })

    mockUseUser.mockReturnValue({
      token: null,
      username: null,
      role: Role.ReadOnly,
      initials: null,
      localities: [],
      isFirstLogin: undefined,
    })
  })

  it('uses defaultSorting when URL sorting is explicitly empty', () => {
    mockLocationSearch = '?&columnfilters=[]&sorting=[]&pagination={"pageIndex":0,"pageSize":25}'

    const setSqlOrderBy = jest.fn()
    mockUsePageContext.mockReturnValue({
      editRights: {},
      idList: [],
      idFieldName: 'id',
      viewName: 'test',
      previousTableUrls: [],
      createTitle: () => '',
      createSubtitle: () => '',
      sqlLimit: 25,
      sqlOffset: 0,
      sqlColumnFilters: [],
      sqlOrderBy: [],
      setIdList: jest.fn(),
      setSqlLimit: jest.fn(),
      setSqlOffset: jest.fn(),
      setSqlColumnFilters: jest.fn(),
      setSqlOrderBy,
      setPreviousTableUrls: jest.fn(),
    })

    render(
      <TableView<TestRow>
        title="Test Table"
        idFieldName="id"
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Id', accessorKey: 'id' },
        ]}
        visibleColumns={{ name: true, id: true }}
        data={[
          {
            id: '1',
            name: 'Alpha',
            full_count: 1,
          },
        ]}
        url="test"
        isFetching={false}
        defaultSorting={[{ id: 'name', desc: false }]}
      />
    )

    expect(setSqlOrderBy).toHaveBeenCalledWith([{ id: 'name', desc: false }])
  })

  it('stores table state outside the URL and navigates with a short state id', async () => {
    render(
      <TableView<TestRow>
        title="Test Table"
        idFieldName="id"
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Id', accessorKey: 'id' },
        ]}
        visibleColumns={{ name: true, id: true }}
        data={[
          {
            id: '1',
            name: 'Alpha',
            full_count: 1,
          },
        ]}
        url="test"
        isFetching={false}
      />
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })

    const navigatedUrl = mockNavigate.mock.calls
      .map(call => call[0])
      .find((value): value is string => typeof value === 'string' && value.startsWith('/table?tableState='))

    expect(navigatedUrl).toBeDefined()
    expect(navigatedUrl).not.toContain('columnfilters=')
    expect(navigatedUrl).not.toContain('sorting=')
    expect(navigatedUrl).not.toContain('pagination=')

    const stateId = new URLSearchParams(navigatedUrl?.split('?')[1]).get('tableState')
    expect(stateId).toBeTruthy()
    expect(window.sessionStorage.getItem(`nowdatabase-table-state:${stateId}`)).toBeTruthy()
  })

  it('restores table state from a short URL without overwriting it with defaults first', async () => {
    const setSqlColumnFilters = jest.fn()
    const setSqlOrderBy = jest.fn()
    const setSqlLimit = jest.fn()
    const setSqlOffset = jest.fn()
    const storedState = {
      columnfilters: [{ id: 'name', value: 'Alpha' }],
      sorting: [{ id: 'name', desc: true }],
      pagination: { pageIndex: 2, pageSize: 50 },
    }

    mockLocationSearch = '?tableState=stored-state'
    window.sessionStorage.setItem('nowdatabase-table-state:stored-state', JSON.stringify(storedState))
    mockUsePageContext.mockReturnValue({
      editRights: {},
      idList: [],
      idFieldName: 'id',
      viewName: 'test',
      previousTableUrls: [],
      createTitle: () => '',
      createSubtitle: () => '',
      sqlLimit: 25,
      sqlOffset: 0,
      sqlColumnFilters: [],
      sqlOrderBy: [],
      setIdList: jest.fn(),
      setSqlLimit,
      setSqlOffset,
      setSqlColumnFilters,
      setSqlOrderBy,
      setPreviousTableUrls: jest.fn(),
    })

    render(
      <TableView<TestRow>
        title="Test Table"
        idFieldName="id"
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Id', accessorKey: 'id' },
        ]}
        visibleColumns={{ name: true, id: true }}
        data={[
          {
            id: '1',
            name: 'Alpha',
            full_count: 1,
          },
        ]}
        url="test"
        isFetching={false}
      />
    )

    await waitFor(() => {
      expect(setSqlColumnFilters).toHaveBeenLastCalledWith(storedState.columnfilters)
      expect(setSqlOrderBy).toHaveBeenLastCalledWith(storedState.sorting)
      expect(setSqlLimit).toHaveBeenLastCalledWith(50)
      expect(setSqlOffset).toHaveBeenLastCalledWith(100)
    })

    expect(JSON.parse(window.sessionStorage.getItem('nowdatabase-table-state:stored-state') ?? '{}')).toEqual(
      storedState
    )
  })

  it('shows help with multi-sort guidance for regular tables', () => {
    const { getByRole, getByText } = render(
      <TableView<TestRow>
        title="Test Table"
        idFieldName="id"
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Id', accessorKey: 'id' },
        ]}
        visibleColumns={{ name: true, id: true }}
        data={[
          {
            id: '1',
            name: 'Alpha',
            full_count: 1,
          },
        ]}
        url="test"
        isFetching={false}
      />
    )

    fireEvent.click(getByRole('button', { name: /table help/i }))

    expect(getByText(/Hold Shift while clicking column headers to apply multi-column sorting./i)).toBeTruthy()
    expect(getByText(/Export the current table data using the export menu/i)).toBeTruthy()
  })

  it('shows applicable help text on cross search tables', () => {
    const { getByRole, getByText, queryByText } = render(
      <TableView<TestRow>
        title="Cross Search"
        idFieldName="id"
        columns={[{ header: 'Name', accessorKey: 'name' }]}
        visibleColumns={{ name: true }}
        data={[{ id: '1', name: 'Alpha', full_count: 1 }]}
        url="occurrence"
        isFetching={false}
        isCrossSearchTable
        serverSidePagination
      />
    )

    fireEvent.click(getByRole('button', { name: /table help/i }))

    expect(getByText(/Click a column header to sort ascending\/descending by that column./i)).toBeTruthy()
    expect(getByText(/Filter rows using the column filter icons or quick search where available./i)).toBeTruthy()
    expect(getByText(/Use the column visibility menu to show or hide columns that matter to you./i)).toBeTruthy()
    expect(queryByText(/multi-column sorting/i)).toBeNull()
    expect(getByText(/Export the current table data using the export menu/i)).toBeTruthy()
  })
})
