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
import { Box, Button, CircularProgress, Divider, Paper, Tooltip, Typography } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { renderCustomToolbar, renderCustomToolbarModalVersion } from './helpers'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'
import { ContactForm } from '../DetailView/common/ContactForm'
import { defaultPagination, defaultPaginationSmall } from '@/common'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
  
  selectorFn should only be defined if using this as a selecting table
*/
export const TableView = <T extends MRT_RowData>({
  data,
  columns,
  visibleColumns,
  idFieldName,
  checkRowRestriction,
  selectorFn,
  url,
  title,
  combinedExport,
  exportIsLoading,
  enableColumnFilterModes,
  serverSidePagination,
  isFetching,
}: {
  title?: string
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  visibleColumns: MRT_VisibilityState
  idFieldName: keyof T
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  url?: string
  combinedExport?: (lids: number[]) => Promise<void>
  exportIsLoading?: boolean
  enableColumnFilterModes?: boolean
  serverSidePagination?: boolean
  isFetching: boolean
}) => {
  const location = useLocation()
  const { editRights, setSqlLimit, setSqlOffset, setSqlColumnFilters, setSqlOrderBy } = usePageContext()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<MRT_PaginationState>(
    selectorFn ? defaultPaginationSmall : defaultPagination
  )
  const user = useUser()
  const { setIdList, setTableUrl } = usePageContext<T>()

  useEffect(() => {
    setSqlLimit(pagination.pageSize)
    setSqlOffset(pagination.pageIndex * pagination.pageSize)
    setSqlColumnFilters(columnFilters)
    setSqlOrderBy(sorting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, columnFilters, sorting])

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

  let rowCount = undefined
  if (data && data.length > 0) {
    if (serverSidePagination) rowCount = data[0].full_count as number
    else rowCount = data.length
  }

  const table = useMaterialReactTable({
    columns: columns,
    data: data || [],
    state: {
      columnFilters,
      showColumnFilters: true,
      isLoading: isFetching,
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
    enableMultiSort: !serverSidePagination,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: serverSidePagination,
    manualSorting: serverSidePagination,
    rowCount: rowCount,
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
    enableColumnFilterModes: enableColumnFilterModes,
    columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith', 'endsWith', 'equals'],
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

  if (!data) {
    return (
      <>
        <CircularProgress />
        <br></br>
        {title === 'Locality-Species-Cross-Search'
          ? 'Loading data, this might take a few seconds...'
          : 'Loading data...'}
      </>
    )
  }

  return (
    <Paper elevation={5} style={{ paddingTop: '0.1rem' }}>
      {!selectorFn && user && (
        <>
          <Box sx={{ display: 'flex', flexGap: '2', marginTop: '1rem', justifyContent: 'center', maxHeight: '3.2em' }}>
            <Typography sx={{ margin: '0.4rem' }} variant="h4">
              {title ?? ''}
            </Typography>
          </Box>
          <Divider sx={{ marginTop: '1rem' }} />
        </>
      )}
      <Box sx={{ display: 'flex', gap: '0.4em', justifyContent: 'flex-end', margin: '0.5em', marginTop: '1em' }}>
        <ContactForm<T> buttonText="Contact" noContext={true} />
      </Box>
      {editRights.new && title != 'Locality-Species-Cross-Search' && (
        <Box sx={{ display: 'flex', gap: '0.4em', justifyContent: 'flex-end', margin: '0.5em', marginTop: '1em' }}>
          <Button variant="contained" component={Link} to="new">
            New
          </Button>
        </Box>
      )}
      {combinedExport && (
        <Box sx={{ display: 'flex', gap: '0.4em', justifyContent: 'flex-end', margin: '0.5em', marginTop: '1em' }}>
          <Tooltip
            title={
              <span style={{ fontSize: 18 }}>
                Export&lsquo;s all localities filtered in the table below with all their species. The export is sorted
                by name. This may take up to a minute, so please wait without closing the browser or switching page. To
                export only localities use the &lsquo;export&lsquo; button in the top-right corner of the table.
              </span>
            }
          >
            <span>
              <Button
                variant="contained"
                disabled={exportIsLoading}
                onClick={() => void combinedExport(table.getSortedRowModel().rows.map(d => d.original.lid as number))}
              >
                Export localities with their species
              </Button>
            </span>
          </Tooltip>{' '}
          {exportIsLoading && <CircularProgress />}
        </Box>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
