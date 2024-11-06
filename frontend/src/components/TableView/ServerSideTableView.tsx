import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_SortingState,
  MRT_PaginationState,
  useMaterialReactTable,
  MaterialReactTable,
  MRT_VisibilityState,
} from 'material-react-table'
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { renderCustomToolbar, renderCustomToolbarModalVersion } from './helpers'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'
import { BACKEND_URL } from '../../util/config'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'

const defaultPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 15 }
const defaultPaginationSmall: MRT_PaginationState = { pageIndex: 0, pageSize: 10 }

export const TableView = <T extends MRT_RowData>({
  columns,
  visibleColumns,
  idFieldName,
  checkRowRestriction,
  selectorFn,
  url,
  title,
}: {
  title?: string
  columns: MRT_ColumnDef<T>[]
  visibleColumns: MRT_VisibilityState
  idFieldName: keyof T
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  url?: string
}) => {
  const location = useLocation()
  const { editRights } = usePageContext()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [data, setData] = useState<any>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<MRT_PaginationState>(
    selectorFn ? defaultPaginationSmall : defaultPagination
  )

  const user = useUser()
  const { setIdList, setTableUrl, tableUrl } = usePageContext<T>()
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
  if (title) {
    document.title = `${title}`
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
      columnVisibility: visibleColumns,
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        '& .MuiTableCell-root': {
          borderLeft: '1px solid rgba(224, 224, 224, 1)',
        },
      },
    },
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableHiding: true,
    manualFiltering: true,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredData = await fetch(BACKEND_URL+tableUrl)
        const body = await filteredData.json()
        setData([...body]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [tableUrl])


  if (!data) return <CircularProgress />

  return (
    <Paper elevation={5} style={{ paddingTop: '0.1rem' }}>
      {!selectorFn && user && (
        <>
          <Box sx={{ display: 'flex', flexGap: '2', marginTop: '1rem', justifyContent: 'center', maxHeight: '3.2em' }}>
            <Typography sx={{ margin: '0.4rem' }} variant="h4">
              {title ?? ''}
            </Typography>
            {editRights.new && title != 'Locality-Species-Cross-Search' && (
              <Button sx={{ marginRight: '1rem', marginLeft: '1rem' }} variant="contained" component={Link} to="new">
                New
              </Button>
            )}
          </Box>
          <Divider sx={{ marginTop: '1rem' }} />
        </>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
