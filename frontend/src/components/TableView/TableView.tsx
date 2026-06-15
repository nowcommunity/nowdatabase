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
import { Alert, Box, CircularProgress, Paper, Tooltip } from '@mui/material'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import { type FilterFn } from '@tanstack/table-core'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionComponent } from './ActionComponent'
import { usePageContext } from '../Page'
import { TableHelp } from '@components/Table'
import { useUser } from '@/hooks/user'
import { defaultPagination, defaultPaginationSmall } from '@/common'
import '../../styles/TableView.css'
import { TableToolBar } from './TableToolBar'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import PolicyIcon from '@mui/icons-material/Policy'
import '../../styles/tableview/TableView.css'
import { resolveErrorMessage, resolveErrorStatus } from './errorUtils'
import type { ColumnVisibilityGroup } from './TableToolBar'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'
type StoredTableState = {
  columnfilters: MRT_ColumnFiltersState
  sorting: MRT_SortingState
  pagination: MRT_PaginationState
}
type StoredTablePreferences = {
  columnfilters: MRT_ColumnFiltersState
  columnVisibility: MRT_VisibilityState
}

const TEXT_FILTER_MODE_OPTIONS = ['equals', 'contains', 'startsWith'] as const
type TextFilterModeOption = (typeof TEXT_FILTER_MODE_OPTIONS)[number]
const TABLE_STATE_URL_PARAM = 'tableState'
const TABLE_STATE_STORAGE_PREFIX = 'nowdatabase-table-state'
const TABLE_FILTERS_STORAGE_PREFIX = 'nowdatabase-table-columnfilters'

const isEmptyFilterValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.every(item => item === '' || item === null || item === undefined)
  }

  return value === '' || value === null || value === undefined
}

const toTableCellTitle = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const normalized = value.replace(/[\r\n]+/g, ' ').trim()
    if (!normalized) return
    return normalized.length > 500 ? `${normalized.slice(0, 500)}…` : normalized
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return
}

const toDataCyPart = (value: unknown): string => {
  const normalized = String(value)
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, '-')
  return normalized || 'unknown'
}

const withDataCy = <TProps extends object>(props: TProps, dataCy: string): TProps & { 'data-cy': string } => ({
  ...props,
  'data-cy': dataCy,
})

const sanitizeColumnFilters = (filters: MRT_ColumnFiltersState): MRT_ColumnFiltersState => {
  return filters.filter(filter => !isEmptyFilterValue(filter.value))
}

const createTableStateId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const getColumnId = <T extends MRT_RowData>(column: MRT_ColumnDef<T>) => {
  if (column.id) return String(column.id)
  if (typeof column.accessorKey === 'string') return column.accessorKey
  if (column.accessorKey !== undefined) return String(column.accessorKey)
  return undefined
}

const isIdLikeColumnId = (columnId: string) => {
  const lastSegment = columnId.split('.').pop() ?? columnId
  return lastSegment === 'id' || lastSegment === 'rid' || lastSegment === 'lid' || lastSegment.endsWith('_id')
}

const isRangeLikeFilterVariant = (variant: MRT_ColumnDef<MRT_RowData>['filterVariant']) => {
  return (
    variant === 'range' ||
    variant === 'range-slider' ||
    variant === 'date-range' ||
    variant === 'datetime-range' ||
    variant === 'time-range'
  )
}

const applyColumnFilterModeDefaults = <T extends MRT_RowData>(
  columns: MRT_ColumnDef<T>[],
  idFieldName: keyof T
): {
  columns: MRT_ColumnDef<T>[]
  columnFilterFns: Record<string, TextFilterModeOption>
} => {
  const columnFilterFns: Record<string, TextFilterModeOption> = {}

  const mapColumn = (column: MRT_ColumnDef<T>): MRT_ColumnDef<T> => {
    if (column.columns) {
      return {
        ...column,
        columns: column.columns.map(mapColumn),
      }
    }

    const columnId = getColumnId(column)
    if (!columnId) return column

    const idFieldId = String(idFieldName)
    const hasCustomFilterFn = typeof column.filterFn === 'function'
    const isRangeFilter = isRangeLikeFilterVariant(column.filterVariant)

    if (columnId === idFieldId) {
      columnFilterFns[columnId] = 'equals'
      return {
        ...column,
        filterFn: typeof column.filterFn === 'function' ? column.filterFn : column.filterFn ?? 'equals',
        enableColumnFilterModes: false,
        columnFilterModeOptions: ['equals'],
      }
    }

    if (isIdLikeColumnId(columnId)) {
      columnFilterFns[columnId] = 'equals'
      return {
        ...column,
        filterFn: typeof column.filterFn === 'function' ? column.filterFn : column.filterFn ?? 'equals',
        enableColumnFilterModes: false,
        columnFilterModeOptions: ['equals'],
      }
    }

    if (hasCustomFilterFn || isRangeFilter) {
      return {
        ...column,
        enableColumnFilterModes: false,
        columnFilterModeOptions: null,
      }
    }

    columnFilterFns[columnId] = 'equals'
    return {
      ...column,
      enableColumnFilterModes: true,
      columnFilterModeOptions: [...TEXT_FILTER_MODE_OPTIONS],
    }
  }

  return { columns: columns.map(mapColumn), columnFilterFns }
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
  defaultSorting,
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
  tableContainerMaxHeight,
  columnVisibilityGroups,
  renderExtraExportMenuItems,
}: {
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  visibleColumns: MRT_VisibilityState
  idFieldName: keyof T
  defaultSorting?: MRT_SortingState
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  tableRowAction?: (row: T) => void
  getDetailPath?: (row: T) => string
  url?: string
  title: string
  kmlExport?: (table: MRT_TableInstance<T>) => void | Promise<void>
  svgExport?: (table: MRT_TableInstance<T>) => void | Promise<void>
  isCrossSearchTable?: boolean
  clickableRows?: boolean
  enableColumnFilterModes?: boolean
  serverSidePagination?: boolean
  isFetching: boolean
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError
  filterFns?: Record<string, MRT_FilterFn<T>>
  renderRowActionExtras?: ({ row }: { row: MRT_Row<T> }) => ReactNode
  renderExtraExportMenuItems?: (handleClose: () => void) => ReactNode
  paginationPlacement?: 'top' | 'bottom' | 'both'
  tableContainerMaxHeight?: string | number
  columnVisibilityGroups?: ColumnVisibilityGroup[]
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
  const [sorting, setSorting] = useState<MRT_SortingState>(defaultSorting ?? [])
  const [rowCount, setRowCount] = useState(data ? data.length : 0)
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<MRT_PaginationState>(
    selectorFn ? defaultPaginationSmall : defaultPagination
  )
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(visibleColumns)
  const [tableStateId] = useState(() => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get(TABLE_STATE_URL_PARAM) ?? createTableStateId()
  })
  const [hasLoadedTableState, setHasLoadedTableState] = useState(Boolean(selectorFn))
  const user = useUser()
  const { setIdList } = usePageContext<T>()

  const { columns: preparedColumns, columnFilterFns: initialColumnFilterFns } = useMemo(
    () => applyColumnFilterModeDefaults(columns, idFieldName),
    [columns, idFieldName]
  )

  const allowColumnFilterModes = (enableColumnFilterModes ?? true) && !serverSidePagination

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

  const normalizeColumnFilters = (filters: MRT_ColumnFiltersState): MRT_ColumnFiltersState => {
    // The range filters are written as "null" if they are empty because undefined is not valid JSON.
    // This changes those to empty strings when loading stored state.
    return filters.map(columnFilter => {
      if (Array.isArray(columnFilter.value)) {
        return {
          ...columnFilter,
          value: columnFilter.value.map((val: string | number | null) => (val === null ? '' : val)),
        }
      }
      return columnFilter
    })
  }

  const isStoredTableState = (value: unknown): value is StoredTableState => {
    if (typeof value !== 'object' || value === null) return false
    const candidate = value as Partial<StoredTableState>
    return (
      isColumnFiltersState(candidate.columnfilters) &&
      isSortingState(candidate.sorting) &&
      isPaginationState(candidate.pagination)
    )
  }

  const isColumnVisibilityState = (value: unknown): value is MRT_VisibilityState => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
    return Object.values(value).every(item => typeof item === 'boolean')
  }

  const isStoredTablePreferences = (value: unknown): value is StoredTablePreferences => {
    if (typeof value !== 'object' || value === null) return false
    const candidate = value as Partial<StoredTablePreferences>
    return isColumnFiltersState(candidate.columnfilters) && isColumnVisibilityState(candidate.columnVisibility)
  }

  const showFilteredColumns = (
    visibility: MRT_VisibilityState,
    filters: MRT_ColumnFiltersState
  ): MRT_VisibilityState => {
    if (filters.length === 0) return visibility

    return filters.reduce<MRT_VisibilityState>(
      (nextVisibility, filter) => ({
        ...nextVisibility,
        [filter.id]: true,
      }),
      visibility
    )
  }

  const getTableStateStorageKey = (stateId: string) => `${TABLE_STATE_STORAGE_PREFIX}:${stateId}`
  const getPersistentColumnFiltersStorageKey = () => `${TABLE_FILTERS_STORAGE_PREFIX}:${url ?? location.pathname}`

  const loadStoredTableState = (stateId: string) => {
    const storedValue = window.sessionStorage.getItem(getTableStateStorageKey(stateId))
    if (!storedValue) return

    const parsed = safeJsonParse(storedValue)
    return isStoredTableState(parsed) ? parsed : undefined
  }

  const loadPersistentTablePreferences = (): StoredTablePreferences | undefined => {
    const storedValue = window.localStorage.getItem(getPersistentColumnFiltersStorageKey())
    if (!storedValue) return

    const parsed = safeJsonParse(storedValue)
    if (isStoredTablePreferences(parsed)) {
      const columnfilters = normalizeColumnFilters(parsed.columnfilters)
      return {
        columnfilters,
        columnVisibility: showFilteredColumns(parsed.columnVisibility, columnfilters),
      }
    }

    if (isColumnFiltersState(parsed)) {
      const columnfilters = normalizeColumnFilters(parsed)
      return {
        columnfilters,
        columnVisibility: showFilteredColumns(visibleColumns, columnfilters),
      }
    }

    return undefined
  }

  const saveStoredTableState = (state: StoredTableState) => {
    window.sessionStorage.setItem(getTableStateStorageKey(tableStateId), JSON.stringify(state))
  }

  const savePersistentTablePreferences = (filters: MRT_ColumnFiltersState, visibility: MRT_VisibilityState) => {
    window.localStorage.setItem(
      getPersistentColumnFiltersStorageKey(),
      JSON.stringify({ columnfilters: filters, columnVisibility: showFilteredColumns(visibility, filters) })
    )
  }

  const buildTableStateUrl = () => `${location.pathname}?${TABLE_STATE_URL_PARAM}=${encodeURIComponent(tableStateId)}`

  const loadStateFromUrl = <TState extends MRT_ColumnFiltersState | MRT_SortingState | MRT_PaginationState>(
    state: TableStateInUrl,
    defaultState: TState
  ): TState => {
    const searchParams = new URLSearchParams(location.search)
    const stateIdFromUrl = searchParams.get(TABLE_STATE_URL_PARAM)
    const storedState = stateIdFromUrl ? loadStoredTableState(stateIdFromUrl) : undefined
    const stateFromStorage = storedState?.[state]
    const stateFromUrl = searchParams.get(state)

    if (stateFromStorage) {
      if (state === 'columnfilters') {
        return normalizeColumnFilters(stateFromStorage as MRT_ColumnFiltersState) as unknown as TState
      }
      if (state === 'sorting') {
        const fallback = defaultState as unknown as MRT_SortingState
        if ((stateFromStorage as MRT_SortingState).length === 0 && fallback.length > 0) {
          return defaultState
        }
      }
      return stateFromStorage as unknown as TState
    }

    if (!stateFromUrl) {
      if (state === 'columnfilters') {
        return (loadPersistentTablePreferences()?.columnfilters ?? defaultState) as TState
      }

      return defaultState
    }
    const parsed = safeJsonParse(stateFromUrl)
    if (parsed === undefined) {
      return defaultState
    }
    if (state === 'columnfilters') {
      if (!isColumnFiltersState(parsed)) {
        return defaultState
      }
      return normalizeColumnFilters(parsed) as unknown as TState
    }
    if (state === 'sorting') {
      if (!isSortingState(parsed)) {
        return defaultState
      }

      const fallback = defaultState as unknown as MRT_SortingState
      if (parsed.length === 0 && fallback.length > 0) {
        return defaultState
      }

      return parsed as unknown as TState
    }

    if (state === 'pagination') {
      return (isPaginationState(parsed) ? parsed : defaultState) as TState
    }

    return defaultState
  }
  if (title) {
    document.title = `${title}`
  }

  const resolveDetailPath = (row: T) => {
    if (getDetailPath) return getDetailPath(row)
    return `/${url}/${row[idFieldName] as string | number}`
  }

  const muiTableBodyRowProps = ({ row }: { row: MRT_Row<T> }) => {
    const clickSelectsRow = Boolean(selectorFn) && !clickableRows

    return {
      'data-cy': `table-row-${String(row.original[idFieldName])}`,
      onClick: () => {
        if (clickSelectsRow) {
          selectorFn?.(row.original)
          return
        }

        const tableStateUrl = buildTableStateUrl()
        setPreviousTableUrls([...previousTableUrls, tableStateUrl])
        navigate(resolveDetailPath(row.original), {
          state: { returnTo: tableStateUrl },
        })
      },
      sx: {
        cursor: clickSelectsRow || clickableRows ? 'pointer' : undefined,
      },
    }
  }

  const table = useMaterialReactTable({
    columns: preparedColumns,
    data: data || [],
    muiTableProps: withDataCy(
      {
        sx: {
          tableLayout: 'fixed',
        },
      },
      `${toDataCyPart(title)}-table`
    ),
    muiTableHeadCellProps: ({ column }) =>
      withDataCy(
        {
          sx: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '& .MuiTableSortLabel-root': {
              // Reserve space for the sort icon so toggling sorting doesn't shift column widths.
              position: 'relative',
              paddingRight: '1.25em',
            },
            '& .MuiTableSortLabel-icon': {
              // Keep the icon from affecting layout when it appears.
              position: 'absolute',
              right: 0,
              margin: 0,
            },
          },
        },
        `table-header-${toDataCyPart(column.id)}`
      ),
    muiTableBodyCellProps: ({ cell }) =>
      withDataCy(
        {
          ...(cell.column.id === 'mrt-row-actions' ? {} : { title: toTableCellTitle(cell.getValue()) }),
          sx: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&.row-actions-cell': {
              overflow: 'visible',
              textOverflow: 'clip',
            },
          },
        },
        `table-cell-${toDataCyPart(cell.column.id)}`
      ),
    muiTableBodyRowProps: clickableRows || selectorFn ? muiTableBodyRowProps : undefined,
    muiTableContainerProps: tableContainerMaxHeight
      ? {
          sx: {
            maxHeight: tableContainerMaxHeight,
            overflowY: 'auto',
          },
        }
      : undefined,
    enableStickyHeader: Boolean(tableContainerMaxHeight),
    state: {
      columnVisibility,
      columnFilters,
      showColumnFilters: true,
      isLoading: isFetching,
      sorting,
      pagination,
      density: 'compact',
    },
    initialState: {
      columnFilterFns: initialColumnFilterFns,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    /**
     * Row action audit (Task T1):
     *
     * • LocalityTable – supplies `selectorFn`, `checkRowRestriction`, and `tableRowAction`.
     *   Shows the Add icon when `selectorFn` is used, renders an "S" synonym action when
     *   `row.original.has_synonym` is true, and displays the Policy restriction icon when
     *   `loc_status` flags a restricted locality. The details icon is hidden when rows are
     *   clickable (row click handles navigation).
     * • SpeciesTable – provides `selectorFn` and `tableRowAction`. Uses the same Add icon
     *   behaviour, an "S" synonym action for `has_synonym`, renders optional extras via
     *   `renderRowActionExtras` (e.g. the species comment "C" button), and the
     *   NotListedLocationIcon whenever `row.original.has_no_locality` is true.
     * • CrossSearchTable – passes `selectorFn` and `checkRowRestriction`, so rows use the
     *   Add icon and may show the Policy restriction indicator. No synonym action is
     *   rendered because the dataset never sets `has_synonym`.
     * • SelectingTable (used inside detail modals) – always passes `selectorFn` and may
     *   forward `tableRowAction` (e.g. locality/species synonym modals). This results in
     *   the Add icon for selection plus optional synonym "S" action.
     * • ReferenceTable, MuseumTable, PersonTable, RegionTable, TimeBoundTable,
     *   TimeUnitTable, ProjectTable, and SequenceTable – show the details icon only when
     *   rows are not clickable (for example, selector modals).
     *
     * Any future layout refactor must preserve these conditional branches because they
     * encode the full set of icons currently surfaced in production.
     */
    renderRowActions: ({ row }) => {
      const showSynonymAction = Boolean(tableRowAction && row.original.has_synonym)
      const showNoLocalityIndicator = Boolean(row.original.has_no_locality)
      const showRestrictionIndicator = Boolean(checkRowRestriction && checkRowRestriction(row.original))
      const showBaseAction = Boolean(selectorFn) || !clickableRows

      return (
        <Box className="row-actions-column">
          {showBaseAction ? (
            <ActionComponent
              {...{
                selectorFn,
                url,
                checkRowRestriction,
                row,
                idFieldName,
                getDetailPath,
              }}
            />
          ) : (
            showRestrictionIndicator && (
              <Tooltip placement="top" title="This item has restricted visibility">
                <PolicyIcon aria-label="Restricted visibility indicator" color="primary" fontSize="medium" />
              </Tooltip>
            )
          )}
          {showSynonymAction && <ActionComponent {...{ tableRowAction, url, row, idFieldName }} />}
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
        muiTableHeadCellProps: withDataCy({ align: 'right' as const }, 'table-header-row-actions'),
        muiTableBodyCellProps: withDataCy(
          { align: 'right' as const, className: 'row-actions-cell' },
          'table-cell-row-actions'
        ),
      },
    },
    positionActionsColumn: 'last',
    enableRowActions: true,
    enableMultiSort: !serverSidePagination,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: serverSidePagination,
    manualSorting: serverSidePagination,
    rowCount: serverSidePagination ? rowCount : undefined,
    autoResetPageIndex: !serverSidePagination,
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
    enableColumnFilterModes: allowColumnFilterModes,
    columnFilterModeOptions: [...TEXT_FILTER_MODE_OPTIONS],
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
    const persistentPreferences = loadPersistentTablePreferences()
    if (persistentPreferences) {
      setColumnVisibility(persistentPreferences.columnVisibility)
    }
    setColumnFilters(loadStateFromUrl('columnfilters', []))
    setSorting(loadStateFromUrl('sorting', defaultSorting ?? []))
    setPagination(loadStateFromUrl('pagination', defaultPagination))
    setHasLoadedTableState(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save state to url whenever it changes
  useEffect(() => {
    if (selectorFn || !hasLoadedTableState) return
    const sanitizedFilters = sanitizeColumnFilters(columnFilters)
    saveStoredTableState({ columnfilters: sanitizedFilters, sorting, pagination })
    savePersistentTablePreferences(sanitizedFilters, columnVisibility)
    navigate(buildTableStateUrl(), {
      replace: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    sorting,
    columnVisibility,
    selectorFn,
    table,
    idFieldName,
    navigate,
    tableStateId,
    hasLoadedTableState,
  ])

  useEffect(() => {
    if (!serverSidePagination) return
    if (data && data.length > 0) {
      setRowCount(data[0].full_count as number)
    } else {
      setRowCount(0)
    }
  }, [data, serverSidePagination])

  useEffect(() => {
    if (selectorFn) {
      return
    }
    setIdList(table.getPrePaginationRowModel().rows.map(row => row.original[idFieldName] as string))
    // resets pagination when filters or sorting change
    if (serverSidePagination) {
      setPagination(selectorFn ? defaultPaginationSmall : defaultPagination)
    } else {
      setRowCount(table.getPrePaginationRowModel().rows.length)
    }
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
              columnVisibilityGroups={columnVisibilityGroups}
              renderExtraExportMenuItems={renderExtraExportMenuItems}
            />
          </Box>
        </div>
      )}
      <MaterialReactTable table={table} />
    </Paper>
  )
}
