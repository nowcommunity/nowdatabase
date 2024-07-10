import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_SortingState,
  MRT_PaginationState,
  useMaterialReactTable,
  MaterialReactTable,
} from 'material-react-table'
import { Box, Button, CircularProgress, Paper } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { renderCustomToolbar, renderCustomToolbarModalVersion } from './helpers'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'
import { Role } from '@/types'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'

const defaultPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 15 }
const defaultPaginationSmall: MRT_PaginationState = { pageIndex: 0, pageSize: 10 }

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
  
  selectorFn should only be defined if using this as a selecting table
*/
export const TableView = <T extends MRT_RowData>({
  data,
  columns,
  idFieldName,
  checkRowRestriction,
  selectorFn,
  url,
}: {
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  idFieldName: keyof T
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  url?: string
}) => {
  const location = useLocation()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>(
    selectorFn ? defaultPaginationSmall : defaultPagination
  )
  const user = useUser()
  const { setIdList, setTableUrl } = usePageContext<T>()
  const loadStateFromUrl = (state: TableStateInUrl, defaultState: [] | MRT_PaginationState) => {
    const searchParams = new URLSearchParams(location.search)
    const stateFromUrl = searchParams.get(state)
    if (!stateFromUrl) return defaultState
    return JSON.parse(stateFromUrl) as object
  }

  const table = useMaterialReactTable({
    columns: columns,
    data: data || [],
    state: {
      columnFilters,
      showColumnFilters: true,
      sorting,
      pagination,
      density: 'compact',
    },
    initialState: {
      columnVisibility: { id: false },
    },
    onColumnFiltersChange: setColumnFilters,
    renderRowActions: ({ row }) => <ActionComponent {...{ selectorFn, url, checkRowRestriction, row, idFieldName }} />,
    displayColumnDefOptions: { 'mrt-row-actions': { size: 50, header: '' } },
    enableRowActions: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    positionPagination: 'both',
    paginationDisplayMode: 'pages',
    muiTablePaperProps: { elevation: 0 },
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableHiding: true,
    renderToolbarInternalActions:
      /*
        To know what components you can render here if necessary, see the source code:
        https://github.com/KevinVandy/material-react-table/blob/85b98f9aaa038df48aa1dd35123560abce78ee58/packages/material-react-table/src/components/toolbar/MRT_ToolbarInternalButtons.tsx#L45
      */
      selectorFn ? renderCustomToolbarModalVersion : renderCustomToolbar,
  })

  // Load state from url only on first render
  useEffect(() => {
    if (selectorFn) return
    setColumnFilters(loadStateFromUrl('columnfilters', []) as MRT_ColumnFiltersState)
    setSorting(loadStateFromUrl('sorting', []) as MRT_SortingState)
    setPagination(loadStateFromUrl('pagination', defaultPagination) as MRT_PaginationState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save state to url whenever it changes
  useEffect(() => {
    if (selectorFn) return
    const columnFilterToUrl = `columnfilters=${JSON.stringify(columnFilters)}`
    const sortingToUrl = `sorting=${JSON.stringify(sorting)}`
    const paginationToUrl = `pagination=${JSON.stringify(pagination)}`
    setTableUrl(`${location.pathname}?&${columnFilterToUrl}&${sortingToUrl}&${paginationToUrl}`)
  }, [columnFilters, sorting, pagination, location.pathname, selectorFn, setIdList, table, idFieldName, setTableUrl])

  useEffect(() => {
    if (selectorFn) {
      return
    }
    setIdList(table.getPrePaginationRowModel().rows.map(row => row.original[idFieldName] as string))

    // Don't put setIdList in the dependency array: it will cause re-render loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columnFilters, sorting])

  if (!data) return <CircularProgress />

  return (
    <Paper elevation={5} style={{ paddingTop: '0.1rem' }}>
      {!selectorFn && user && (
        <Box sx={{ display: 'flex', flexGap: '2', margin: '0.5rem' }}>
          {[Role.Admin, Role.EditRestricted, Role.EditUnrestricted, Role.Project, Role.NowOffice].includes(
            user.role
          ) && (
            <Button sx={{ marginRight: '5px' }} variant="contained" component={Link} to="new">
              New
            </Button>
          )}
          {[Role.Admin, Role.EditUnrestricted].includes(user.role) && <Button variant="contained">Delete</Button>}
        </Box>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
