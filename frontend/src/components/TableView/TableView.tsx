import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
import { Alert, Box, CircularProgress, IconButton, Paper, Tooltip } from '@mui/material'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FilterFn } from '@tanstack/table-core'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { TableHelp } from '@components/Table'
import { useUser } from '@/hooks/user'
import { defaultPagination, defaultPaginationSmall } from '@/common'
import '../../styles/TableView.css'
import { TableToolBar } from './TableToolBar'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import PolicyIcon from '@mui/icons-material/Policy'
import '../../styles/tableview/TableView.css'
import { resolveErrorMessage, resolveErrorStatus } from './errorUtils'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'

const isEmptyFilterValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.every(item => item === '' || item === null || item === undefined)
  }

  return value === '' || value === null || value === undefined
}

const sanitizeColumnFilters = (filters: MRT_ColumnFiltersState): MRT_ColumnFiltersState => {
  return filters.filter(filter => !isEmptyFilterValue(filter.value))
}

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
  getDetailPath,
  url,
  title,
  kmlExport,
  svgExport,
  isCrossSearchTable,
  clickableRows = true,
  enableColumnFilterModes,
  serverSidePagination,
  isFetching,
  filterFns,
  renderRowActionExtras,
  isError,
  error,
  paginationPlacement,
}: {
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  visibleColumns: MRT_VisibilityState
  idFieldName: keyof T
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  tableRowAction?: (row: T) => void
  getDetailPath?: (row: T) => string
  url?: string
  title: string
  kmlExport?: (table: MRT_TableInstance<T>) => void
  svgExport?: (table: MRT_TableInstance<T>) => void
  isCrossSearchTable?: boolean
  clickableRows?: boolean
  enableColumnFilterModes?: boolean
  serverSidePagination?: boolean
  isFetching: boolean
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError
  filterFns?: Record<string, MRT_FilterFn<T>>
  renderRowActionExtras?: ({ row }: { row: MRT_Row<T> }) => ReactNode
  paginationPlacement?: 'top' | 'bottom' | 'both'
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
  const user = useUser()
  const { setIdList } = usePageContext<T>()

  useEffect(() => {
    setSqlLimit(pagination.pageSize)
    setSqlOffset(pagination.pageIndex * pagination.pageSize)
    setSqlColumnFilters(sanitizeColumnFilters(columnFilters))
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

  let rowCount = undefined
  if (data && data.length > 0) {
    if (serverSidePagination) rowCount = data[0].full_count as number
    else rowCount = data.length
  }

  const resolveDetailPath = (row: T) => {
    if (getDetailPath) return getDetailPath(row)
    return `/${url}/${row[idFieldName] as string | number}`
  }

  const muiTableBodyRowProps = ({ row }: { row: MRT_Row<T> }) => ({
    onClick: () => {
      const sanitizedFilters = sanitizeColumnFilters(columnFilters)
      const columnFilterToUrl = `columnfilters=${JSON.stringify(sanitizedFilters)}`
      const sortingToUrl = `sorting=${JSON.stringify(sorting)}`
      const paginationToUrl = `pagination=${JSON.stringify(pagination)}`
      setPreviousTableUrls([
        ...previousTableUrls,
        `${location.pathname}?&${columnFilterToUrl}&${sortingToUrl}&${paginationToUrl}`,
      ])
      navigate(resolveDetailPath(row.original), {
        state: { returnTo: `${location.pathname}${location.search}` },
      })
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
    onColumnFiltersChange: setColumnFilters,
    /**
     * Row action audit (Task T1):
     *
     * • LocalityTable – supplies `selectorFn`, `checkRowRestriction`, and `tableRowAction`.
     *   Shows the default ManageSearch navigation icon (or Add when `selectorFn` is used),
     *   renders an "S" synonym action when `row.original.has_synonym` is true, and displays
     *   the Policy restriction icon when `loc_status` flags a restricted locality.
     * • SpeciesTable – provides `selectorFn` and `tableRowAction`. Uses the same default
     *   ManageSearch/Add icon behaviour, an "S" synonym action for `has_synonym`, renders
     *   optional extras via `renderRowActionExtras` (e.g. the species comment "C" button),
     *   and the NotListedLocationIcon whenever `row.original.has_no_locality` is true.
     * • CrossSearchTable – passes `selectorFn` and `checkRowRestriction`, so rows use the
     *   ManageSearch/Add icon and may show the Policy restriction indicator. No synonym
     *   action is rendered because the dataset never sets `has_synonym`.
     * • SelectingTable (used inside detail modals) – always passes `selectorFn` and may
     *   forward `tableRowAction` (e.g. locality/species synonym modals). This results in
     *   the Add icon for selection plus optional synonym "S" action.
     * • ReferenceTable, MuseumTable, PersonTable, RegionTable, TimeBoundTable,
     *   TimeUnitTable, ProjectTable, and SequenceTable – rely on the default
     *   ManageSearch navigation action (or Add when a consumer injects `selectorFn`).
     *
     * Any future layout refactor must preserve these conditional branches because they
     * encode the full set of icons currently surfaced in production.
     */
    renderRowActions: ({ row }) => {
      const showSynonymIndicator = Boolean(row.original.has_synonym)
      const showNoLocalityIndicator = Boolean(row.original.has_no_locality)

      const hasCustomDetailPath = Boolean(getDetailPath && !selectorFn && !tableRowAction)

      return (
        <Box className="row-actions-column">
          {hasCustomDetailPath ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Tooltip placement="top" title="View details">
                <IconButton
                  aria-label="View details"
                  data-cy={`details-button-${String(row.original[idFieldName])}`}
                  onClick={event => {
                    event.stopPropagation()
                    const sanitizedFilters = sanitizeColumnFilters(columnFilters)
                    const columnFilterToUrl = `columnfilters=${JSON.stringify(sanitizedFilters)}`
                    const sortingToUrl = `sorting=${JSON.stringify(sorting)}`
                    const paginationToUrl = `pagination=${JSON.stringify(pagination)}`
                    setPreviousTableUrls([
                      ...previousTableUrls,
                      `${location.pathname}?&${columnFilterToUrl}&${sortingToUrl}&${paginationToUrl}`,
                    ])
                    navigate(resolveDetailPath(row.original), {
                      state: { returnTo: `${location.pathname}${location.search}` },
                    })
                  }}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <ManageSearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {checkRowRestriction && checkRowRestriction(row.original) && (
                <Tooltip placement="top" title="This item has restricted visibility">
                  <PolicyIcon aria-label="Restricted visibility indicator" color="primary" fontSize="medium" />
                </Tooltip>
              )}
            </Box>
          ) : (
            <ActionComponent {...{ selectorFn, url, checkRowRestriction, row, idFieldName }} />
          )}
          {showSynonymIndicator && (
            <ActionComponent
              {...{
                selectorFn,
                tableRowAction,
                url,
                checkRowRestriction,
                row,
                idFieldName,
              }}
            />
          )}
          {renderRowActionExtras && renderRowActionExtras({ row })}
          {showNoLocalityIndicator && (
            <Tooltip title="This species is not currently in any locality" placement="right-start">
              <NotListedLocationIcon
                aria-label="Species currently lacks a linked locality"
                color="disabled"
                fontSize="small"
              />
            </Tooltip>
          )}
        </Box>
      )
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 36,
        header: '',
        muiTableHeadCellProps: {
          align: 'right',
        },
        muiTableBodyCellProps: {
          align: 'right',
          className: 'row-actions-cell',
        },
      },
    },
    positionActionsColumn: 'last',
    enableRowActions: true,
    enableMultiSort: !serverSidePagination,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: serverSidePagination,
    manualSorting: serverSidePagination,
    rowCount: rowCount,
    autoResetPageIndex: false,
    positionPagination: paginationPlacement ?? (selectorFn ? 'top' : 'both'),
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

  const errorStatus = useMemo(() => resolveErrorStatus(error), [error])

  const errorMessage = useMemo(() => resolveErrorMessage(errorStatus, error, isError), [errorStatus, error, isError])

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
    const sanitizedFilters = sanitizeColumnFilters(columnFilters)
    const columnFilterToUrl = `columnfilters=${JSON.stringify(sanitizedFilters)}`
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

  if (isError) {
    const severity = errorStatus === 401 || errorStatus === 403 ? 'warning' : 'error'
    return (
      <Alert severity={severity} role="alert">
        {errorMessage}
      </Alert>
    )
  }

  if (!data && isFetching) {
    return (
      <>
        <CircularProgress />
        <br></br>
        {'Loading data...'}
      </>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Paper elevation={5}>
      {user && (
        <div className="table-top-row">
          {title && <Box className="title">{title}</Box>}
          <Box display="flex" alignItems="center" gap={1}>
            <TableHelp
              showFiltering
              showSorting
              showMultiSorting={!serverSidePagination}
              showColumnVisibility
              showExport
            />
            <TableToolBar<T>
              table={table}
              tableName={title}
              kmlExport={kmlExport}
              svgExport={svgExport}
              showNewButton={editRights.new && !selectorFn && !isCrossSearchTable}
              isCrossSearchTable={isCrossSearchTable}
              selectorFn={selectorFn}
              hideLeftButtons={false}
            />
          </Box>
        </div>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
