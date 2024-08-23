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
import { Box, Button, CircularProgress, Divider, Paper, Tooltip, Typography } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { renderCustomToolbar, renderCustomToolbarModalVersion } from './helpers'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'

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
  title,
  combinedExport,
  exportIsLoading,
}: {
  title?: string
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  idFieldName: keyof T
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  url?: string
  combinedExport?: (lids: number[]) => Promise<void>
  exportIsLoading?: boolean
}) => {
  const location = useLocation()
  const { editRights } = usePageContext()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<MRT_PaginationState>(
    selectorFn ? defaultPaginationSmall : defaultPagination
  )
  const user = useUser()
  const { setIdList, setTableUrl } = usePageContext<T>()
  const loadStateFromUrl = (state: TableStateInUrl, defaultState: [] | MRT_PaginationState) => {
    const searchParams = new URLSearchParams(location.search)
    const stateFromUrl = searchParams.get(state)
    if (!stateFromUrl) return defaultState
    const res = JSON.parse(stateFromUrl) as object
    if (state === 'columnfilters') {
      // The range filters are written as "null" if they are empty because undefined is not valid JSON.
      // This changes those to empty strings when loading the url to state.
      return (res as MRT_ColumnFiltersState).map(columnFilter => {
        if (Array.isArray(columnFilter.value)) {
          return {
            ...columnFilter,
            value: columnFilter.value.map(val => (val === null ? '' : val) as unknown),
          }
        }
        return columnFilter
      })
    }
    return res
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
    positionPagination: selectorFn ? 'top' : 'both',
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
    navigate(`${location.pathname}?&${columnFilterToUrl}&${sortingToUrl}&${paginationToUrl}`, {
      replace: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, sorting, pagination, selectorFn, table, idFieldName, navigate])

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
        <>
          <Box sx={{ display: 'flex', flexGap: '2', marginTop: '1rem', justifyContent: 'center', maxHeight: '3.2em' }}>
            <Typography sx={{ margin: '0.4rem' }} variant="h4">
              {title ?? ''}
            </Typography>
            {editRights.new && (
              <Button sx={{ marginRight: '1rem', marginLeft: '1rem' }} variant="contained" component={Link} to="new">
                New
              </Button>
            )}
          </Box>
          <Divider sx={{ marginTop: '1rem' }} />
        </>
      )}
      {combinedExport && (
        <Box sx={{ margin: '1em', maxWidth: '25em' }}>
          <Box sx={{ display: 'flex', gap: '0.4em' }}>
            <Tooltip
              title={
                <span style={{ fontSize: 18 }}>
                  Export&lsquo;s all localities filtered in the table below with all their species. The export is sorted by
                  name. This may take up to a minute, so please wait without closing the browser or switching page. To
                  export only localities use the &lsquo;export&lsquo; button in the top-right corner of the table.
                </span>
              }
            >
              <Button
                variant="contained"
                disabled={exportIsLoading}
                onClick={() => void combinedExport(table.getSortedRowModel().rows.map(d => d.original.lid as number))}
              >
                Export localities with their species
              </Button>
            </Tooltip>{' '}
            {exportIsLoading && <CircularProgress />}
          </Box>
        </Box>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
