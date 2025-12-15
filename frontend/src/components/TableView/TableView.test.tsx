import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
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

const reactRouterDom = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')

jest.mock('react-router-dom', () => ({
  ...reactRouterDom,
  useLocation: () => ({ search: '', pathname: '/table' }),
  useNavigate: () => jest.fn(),
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
        url="crosssearch"
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
