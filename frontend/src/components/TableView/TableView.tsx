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
  MRT_TableInstance,
} from 'material-react-table'
import { Box, CircularProgress, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'
import { defaultPagination, defaultPaginationSmall } from '@/common'
import '../../styles/TableView.css'
import { TableToolBar } from './TableToolBar'

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
  kmlExport,
  exportIsLoading,
  isCrossSearchTable,
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
  kmlExport?: (table: MRT_TableInstance<T>) => void
  exportIsLoading?: boolean
  isCrossSearchTable?: boolean
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
    enableColumnFilterModes: enableColumnFilterModes && !serverSidePagination,
    columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith', 'endsWith', 'equals'],
    enableColumnActions: false,
    enableHiding: true,
    enableTopToolbar: false,
    renderToolbarInternalActions: () => <></>,
    // renderToolbarInternalActions: selectorFn ? renderCustomToolbarModalVersion : renderCustomToolbar,
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
        {'Loading data...'}
      </>
    )
  }

  return (
    <Paper elevation={5}>
      {user && (
        <div className="table-top-row">
          <Box className="title">{title ?? ''}</Box>
          <TableToolBar<T>
            table={table}
            combinedExport={combinedExport}
            kmlExport={kmlExport}
            exportIsLoading={exportIsLoading}
            isCrossSearchTable={isCrossSearchTable}
            showNewButton={editRights.new && title != 'Locality-Species-Cross-Search'}
          />
        </div>
      )}

      <MaterialReactTable table={table} />
    </Paper>
  )
}
