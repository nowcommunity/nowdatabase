import { useEffect, useMemo, useState } from 'react'
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
  MRT_Row,
  type MRT_FilterFn,
} from 'material-react-table'
import { Box, CircularProgress, Paper, Tooltip } from '@mui/material'
import type { FilterFn } from '@tanstack/table-core'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { useUser } from '@/hooks/user'
import { defaultPagination, defaultPaginationSmall } from '@/common'
import '../../styles/TableView.css'
import { TableToolBar } from './TableToolBar'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import '../../styles/tableview/TableView.css'

/*
  Investigation Log (Task T1 – Pagination state handling)

  Reproduction steps (manual):
  1. Navigate to any table using server-side pagination (e.g. Localities).
  2. Advance to a later page (page index >= 4 with page size 25 reproduces consistently).
  3. Apply a restrictive filter ("Country equals XYZ" with few matches).
  4. Observe the data panel display "No results found" while the paginator still reports the
     original total (e.g. 344 pages). Navigating back to page 1 restores the expected rows.

  Root cause summary:
  • `autoResetPageIndex` is disabled while server-side pagination is active, so the component
    keeps the previous `pageIndex` and emits the same SQL offset even when filters change.
  • When the filter shrinks the dataset, the current offset typically exceeds the available rows,
    so the API response is empty. With zero rows we never recompute `rowCount`, leaving the stale
    total derived from the prior data set in place, which makes the paginator claim hundreds of
    pages and masks that the table is simply querying beyond the end of the filtered result set.

  Next steps: reset/clamp `pagination.pageIndex` whenever filters/sorting change and ensure
  `rowCount` derives from the latest response even when it is empty, so manual pagination stays
  aligned with filtered totals.
*/

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
  tableRowAction,
  url,
  title,
  combinedExport,
  kmlExport,
  svgExport,
  exportIsLoading,
  isCrossSearchTable,
  clickableRows = true,
  enableColumnFilterModes,
  serverSidePagination,
  isFetching,
  filterFns,
}: {
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  visibleColumns: MRT_VisibilityState
  idFieldName: keyof T
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  tableRowAction?: (row: T) => void
  url?: string
  title: string
  combinedExport?: (lids: number[]) => Promise<void>
  kmlExport?: (table: MRT_TableInstance<T>) => void
  svgExport?: (table: MRT_TableInstance<T>) => void
  exportIsLoading?: boolean
  isCrossSearchTable?: boolean
  clickableRows?: boolean
  enableColumnFilterModes?: boolean
  serverSidePagination?: boolean
  isFetching: boolean
  filterFns?: Record<string, MRT_FilterFn<T>>
}) => {
  const location = useLocation()
  const {
    editRights,
    setSqlLimit,
    setSqlOffset,
    setSqlColumnFilters,
    setSqlOrderBy,
    previousTableUrls,
    setPreviousTableUrls,
  } = usePageContext()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<MRT_PaginationState>(
    selectorFn ? defaultPaginationSmall : defaultPagination
  )
  const { pageIndex, pageSize } = pagination
  const user = useUser()
  const { setIdList } = usePageContext<T>()

  useEffect(() => {
    setSqlLimit(pagination.pageSize)
    setSqlOffset(pagination.pageIndex * pagination.pageSize)
    setSqlColumnFilters(columnFilters)
    setSqlOrderBy(sorting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, columnFilters, sorting])

  const safeJsonParse = (value: string): unknown => {
    try {
      return JSON.parse(value) as unknown
    } catch {
      return undefined
    }
  }

  const isColumnFiltersState = (value: unknown): value is MRT_ColumnFiltersState => {
    return (
      Array.isArray(value) &&
      value.every(item => {
        if (typeof item !== 'object' || item === null) {
          return false
        }

        const candidate = item as { id?: unknown }
        return typeof candidate.id === 'string'
      })
    )
  }

  const isSortingState = (value: unknown): value is MRT_SortingState => {
    return (
      Array.isArray(value) &&
      value.every(item => {
        if (typeof item !== 'object' || item === null) {
          return false
        }

        const candidate = item as { id?: unknown }
        return typeof candidate.id === 'string'
      })
    )
  }

  const isPaginationState = (value: unknown): value is MRT_PaginationState => {
    if (typeof value !== 'object' || value === null) {
      return false
    }

    const candidate = value as { pageIndex?: unknown; pageSize?: unknown }
    return typeof candidate.pageIndex === 'number' && typeof candidate.pageSize === 'number'
  }

  const loadStateFromUrl = (state: TableStateInUrl, defaultState: [] | MRT_PaginationState) => {
    const searchParams = new URLSearchParams(location.search)
    const stateFromUrl = searchParams.get(state)
    if (!stateFromUrl) return defaultState
    const parsed = safeJsonParse(stateFromUrl)
    if (parsed === undefined) {
      return defaultState
    }
    if (state === 'columnfilters') {
      // The range filters are written as "null" if they are empty because undefined is not valid JSON.
      // This changes those to empty strings when loading the url to state.
      if (!isColumnFiltersState(parsed)) {
        return defaultState
      }
      const normalizedFilters = parsed.map(columnFilter => {
        if (Array.isArray(columnFilter.value)) {
          return {
            ...columnFilter,
            value: columnFilter.value.map((val: string | number | null) => (val === null ? '' : val)),
          }
        }
        return columnFilter
      })
      return normalizedFilters
    }
    if (state === 'sorting') {
      return isSortingState(parsed) ? parsed : defaultState
    }

    if (state === 'pagination') {
      return isPaginationState(parsed) ? parsed : defaultState
    }

    return defaultState
  }
  if (title) {
    document.title = `${title}`
  }

  const rowCount = useMemo(() => {
    if (!data) {
      return undefined
    }

    if (!serverSidePagination) {
      return data.length
    }

    if (data.length === 0) {
      return 0
    }

    const firstRow = data[0] as { full_count?: unknown }
    return typeof firstRow.full_count === 'number' ? firstRow.full_count : 0
  }, [data, serverSidePagination])

  const resetPaginationPageIndex = () => {
    setPagination(prev => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }))
  }

  const handleColumnFiltersChange = (
    updaterOrValue: MRT_ColumnFiltersState | ((prev: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)
  ) => {
    setColumnFilters(prev =>
      typeof updaterOrValue === 'function'
        ? (updaterOrValue as (prevState: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)(prev)
        : updaterOrValue
    )
    resetPaginationPageIndex()
  }

  const handleSortingChange = (
    updaterOrValue: MRT_SortingState | ((prev: MRT_SortingState) => MRT_SortingState)
  ) => {
    setSorting(prev =>
      typeof updaterOrValue === 'function'
        ? (updaterOrValue as (prevState: MRT_SortingState) => MRT_SortingState)(prev)
        : updaterOrValue
    )
    resetPaginationPageIndex()
  }

  useEffect(() => {
    if (!serverSidePagination || rowCount === undefined) {
      return
    }

    const maxPageIndex = Math.max(0, Math.ceil(rowCount / pageSize) - 1)

    if (pageIndex <= maxPageIndex) {
      return
    }

    setPagination(prev => ({ ...prev, pageIndex: Math.min(prev.pageIndex, maxPageIndex) }))
  }, [serverSidePagination, rowCount, pageIndex, pageSize])

  const muiTableBodyRowProps = ({ row }: { row: MRT_Row<T> }) => ({
    onClick: () => {
      const columnFilterToUrl = `columnfilters=${JSON.stringify(columnFilters)}`
      const sortingToUrl = `sorting=${JSON.stringify(sorting)}`
      const paginationToUrl = `pagination=${JSON.stringify(pagination)}`
      setPreviousTableUrls([
        ...previousTableUrls,
        `${location.pathname}?&${columnFilterToUrl}&${sortingToUrl}&${paginationToUrl}`,
      ])
      navigate(`/${url}/${row.original[idFieldName]}`)
    },
    sx: {
      cursor: 'pointer',
    },
  })

  const table = useMaterialReactTable({
    columns: columns,
    data: data || [],
    muiTableBodyRowProps: clickableRows ? muiTableBodyRowProps : undefined,
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
    onColumnFiltersChange: handleColumnFiltersChange,
    renderRowActions: ({ row }) => {
      return (
        <Box className="row-actions-column">
          <Box>
            <ActionComponent {...{ selectorFn, url, checkRowRestriction, row, idFieldName }} />
          </Box>
          <Box>
            {row.original.has_synonym && (
              <ActionComponent {...{ selectorFn, tableRowAction, url, checkRowRestriction, row, idFieldName }} />
            )}
          </Box>
          <Box display="flex" alignItems="center" px="1.35em">
            {row.original.has_no_locality && (
              <Tooltip title="This species is not currently in any locality" placement="right-start">
                <NotListedLocationIcon color="disabled" sx={{}} />
              </Tooltip>
            )}
          </Box>
        </Box>
      )
    },
    displayColumnDefOptions: { 'mrt-row-actions': { size: 50, header: '' } },
    enableRowActions: true,
    enableMultiSort: !serverSidePagination,
    onSortingChange: handleSortingChange,
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
    filterFns: filterFns as Record<string, FilterFn<T>> | undefined,
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
          {title && <Box className="title">{title}</Box>}
          <TableToolBar<T>
            table={table}
            tableName={title}
            combinedExport={combinedExport}
            kmlExport={kmlExport}
            svgExport={svgExport}
            exportIsLoading={exportIsLoading}
            showNewButton={editRights.new && !selectorFn && title != 'Locality-Species-Cross-Search'}
            isCrossSearchTable={isCrossSearchTable}
          />
        </div>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
