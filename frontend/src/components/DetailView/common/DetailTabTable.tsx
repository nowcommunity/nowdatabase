import { useState, type ReactNode } from 'react'
import {
  MaterialReactTable,
  MRT_PaginationState,
  MRT_Row,
  MRT_RowData,
  MRT_TableOptions,
  MRT_VisibilityState,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table'
import { TableView } from '@/components/TableView/TableView'

const defaultEditPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 15 }

type ReadOrSelectMode = 'read' | 'select'

type DetailTabTableReadSelectProps<T extends MRT_RowData> = {
  mode: ReadOrSelectMode
  data?: T[] | null
  columns: MRT_ColumnDef<T>[]
  title: string
  visibleColumns?: MRT_VisibilityState
  idFieldName: keyof T
  isFetching?: boolean
  isError?: boolean
  checkRowRestriction?: (row: T) => boolean
  selectorFn?: (id: T) => void
  tableRowAction?: (row: T) => void
  url?: string
  clickableRows?: boolean
  enableColumnFilterModes?: boolean
  paginationPlacement?: 'top' | 'bottom' | 'both'
}

type DetailTabTableEditProps<T extends MRT_RowData> = {
  mode: 'edit'
  data: T[]
  columns: MRT_ColumnDef<T>[]
  enableSorting?: boolean
  enableColumnActions?: boolean
  enableTopToolbar?: boolean
  positionPagination?: 'top' | 'bottom' | 'both'
  paginationState?: MRT_PaginationState
  onPaginationChange?: MRT_TableOptions<T>['onPaginationChange']
  enableRowActions?: boolean
  renderRowActions?: MRT_TableOptions<T>['renderRowActions']
  muiTableBodyRowProps?: MRT_TableOptions<T>['muiTableBodyRowProps']
}

type DetailTabTableProps<T extends MRT_RowData> = DetailTabTableReadSelectProps<T> | DetailTabTableEditProps<T>

export const DetailTabTable = <T extends MRT_RowData>(props: DetailTabTableProps<T>) => {
  if (props.mode === 'edit') {
    return <DetailTabEditableTable {...props} />
  }

  const {
    data,
    columns,
    title,
    visibleColumns,
    idFieldName,
    isFetching = false,
    selectorFn,
    tableRowAction,
    url,
    checkRowRestriction,
    clickableRows,
    enableColumnFilterModes,
    paginationPlacement,
    isError,
  } = props

  const resolvedVisibleColumns: MRT_VisibilityState = visibleColumns
    ? visibleColumns
    : columns.reduce<MRT_VisibilityState>((acc, column) => {
        if (column.accessorKey) {
          acc[column.accessorKey.toString()] = true
        }
        return acc
      }, {})

  return (
    <TableView<T>
      title={title}
      idFieldName={idFieldName}
      columns={columns}
      visibleColumns={resolvedVisibleColumns}
      data={data ?? undefined}
      isFetching={isFetching}
      selectorFn={selectorFn}
      tableRowAction={tableRowAction}
      url={url}
      checkRowRestriction={checkRowRestriction}
      clickableRows={clickableRows}
      enableColumnFilterModes={enableColumnFilterModes}
      paginationPlacement={paginationPlacement}
      isError={isError}
    />
  )
}

const DetailTabEditableTable = <T extends MRT_RowData>({
  data,
  columns,
  enableSorting = false,
  enableColumnActions = false,
  enableTopToolbar = false,
  positionPagination = 'both',
  paginationState,
  onPaginationChange,
  enableRowActions = false,
  renderRowActions,
  muiTableBodyRowProps,
}: DetailTabTableEditProps<T>) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>(paginationState ?? defaultEditPagination)

  const resolvedPagination = paginationState ?? pagination
  const handlePaginationChange: MRT_TableOptions<T>['onPaginationChange'] = onPaginationChange ?? setPagination

  const table = useMaterialReactTable({
    columns,
    data,
    enableTopToolbar,
    enableColumnActions,
    enableSorting,
    enablePagination: true,
    onPaginationChange: handlePaginationChange,
    positionPagination,
    paginationDisplayMode: 'pages',
    state: { density: 'compact', pagination: resolvedPagination },
    enableRowActions,
    renderRowActions,
    muiTableBodyRowProps,
  })

  return <MaterialReactTable table={table} />
}

export type { DetailTabTableProps, DetailTabTableReadSelectProps, DetailTabTableEditProps }
export type DetailTableEditRowRenderer<T extends MRT_RowData> = (props: {
  row: MRT_Row<T>
  staticRowIndex?: number
}) => ReactNode
