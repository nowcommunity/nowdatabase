import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_SortingState,
  MRT_PaginationState,
} from 'material-react-table'
import { CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { renderCustomToolbar, renderCustomToolbarModalVersion } from './helpers'
import { ActionComponent } from './ActionComponent'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'

const defaultPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 15 }

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
  
  selectorFn and selectedList are optional props. They should only be 
  defined when the table is used to select items from the list when
  editing something, for example in detail view.
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
  const navigate = useNavigate()
  const location = useLocation()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>(defaultPagination)

  const loadStateFromUrl = (state: TableStateInUrl, defaultState: [] | MRT_PaginationState) => {
    const searchParams = new URLSearchParams(location.search)
    const stateFromUrl = searchParams.get(state)
    if (!stateFromUrl) return defaultState
    return JSON.parse(stateFromUrl) as object
  }

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
  }, [columnFilters, sorting, pagination, location.pathname, navigate, selectorFn])

  if (!data) return <CircularProgress />

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      state={{
        columnFilters,
        showColumnFilters: true,
        sorting,
        pagination,
        density: 'compact',
      }}
      initialState={{
        columnVisibility: { id: false },
      }}
      onColumnFiltersChange={setColumnFilters}
      renderRowActions={({ row }) => (
        <ActionComponent {...{ selectorFn, url, checkRowRestriction, row, idFieldName }} />
      )}
      displayColumnDefOptions={{ 'mrt-row-actions': { size: 50, header: '' } }}
      enableRowActions
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      autoResetPageIndex={false}
      positionPagination="both"
      paginationDisplayMode="pages"
      enableDensityToggle={false}
      enableGlobalFilter={false}
      enableColumnActions={false}
      enableHiding={true}
      renderToolbarInternalActions={
        /*
          To know what components you can render here if necessary, see the source code:
          https://github.com/KevinVandy/material-react-table/blob/85b98f9aaa038df48aa1dd35123560abce78ee58/packages/material-react-table/src/components/toolbar/MRT_ToolbarInternalButtons.tsx#L45
        */
        selectorFn ? renderCustomToolbarModalVersion : renderCustomToolbar
      }
    />
  )
}
