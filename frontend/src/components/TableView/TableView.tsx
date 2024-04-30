import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_SortingState,
  MRT_PaginationState,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
  MRT_Row,
} from 'material-react-table'
import { Box, Button, CircularProgress, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import PolicyIcon from '@mui/icons-material/Policy'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

type TableStateInUrl = 'sorting' | 'columnfilters' | 'pagination'

const defaultPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 15 }

const ActionComponent = <T extends MRT_RowData>({
  row,
  idFieldName,
  selectorFn,
  selectedList,
  checkRowRestriction,
  url
}: {
  row: MRT_Row<T>
  idFieldName: keyof T
  selectorFn?: (id: string) => void
  selectedList?: string[]
  checkRowRestriction: (row: T) => boolean
  url: string
}) => {
  const navigate = useNavigate()
  const id = row.original[idFieldName]
  const currentSelected = selectedList && selectedList.find(sel => sel === id)
  const getIconToShow = () => {
    if (currentSelected) return <CheckCircleOutlineIcon color="success" />
    if (selectorFn) return <AddCircleOutlineIcon />
    return <ManageSearchIcon />
  }
  const onClick = () => {
    if (selectorFn) {
      selectorFn(id)
    } else {
      navigate(`/${url}/${id}`)
    }
  }
  return (
    <Box display="flex" gap="0.2em" alignItems="center" width="3.6em">
      <Button variant="text" style={{ width: '2em' }} onClick={onClick}>
        {getIconToShow()}
      </Button>
      {checkRowRestriction(row.original) && (
        <Tooltip placement="top" title="This item has restricted visibility">
          <PolicyIcon color="primary" fontSize="medium" />
        </Tooltip>
      )}
    </Box>
  )
}

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
*/
export const TableView = <T extends MRT_RowData>({
  data,
  columns,
  idFieldName,
  checkRowRestriction,
  selectorFn,
  selectedList,
  url
}: {
  data: T[] | null
  columns: MRT_ColumnDef<T>[]
  idFieldName: keyof MRT_RowData
  checkRowRestriction: (row: T) => boolean
  selectorFn?: (id: string) => void
  selectedList?: string[]
  url: string
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
    return JSON.parse(stateFromUrl)
  }

  // Load state from url only on first render
  useEffect(() => {
    setColumnFilters(loadStateFromUrl('columnfilters', []))
    setSorting(loadStateFromUrl('sorting', []))
    setPagination(loadStateFromUrl('pagination', defaultPagination))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save state to url whenever it changes
  useEffect(() => {
    const columnFilterToUrl = `columnfilters=${JSON.stringify(columnFilters)}`
    const sortingToUrl = `sorting=${JSON.stringify(sorting)}`
    const paginationToUrl = `pagination=${JSON.stringify(pagination)}`
    navigate(`${location.pathname}?&${columnFilterToUrl}&${sortingToUrl}&${paginationToUrl}`, {
      replace: true,
    })
  }, [columnFilters, sorting, pagination, location.pathname, navigate])

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
        <ActionComponent
          row={row}
          idFieldName={idFieldName}
          selectorFn={selectorFn}
          selectedList={selectedList}
          checkRowRestriction={checkRowRestriction}
          url={url}
        />
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
          Custom rendering of the toolbar menu in the top-right: this is needed because there's no setting to hide the "show/hide column filters" button which we don't want
          To know what components you can render here if necessary, see the source code:
          https://github.com/KevinVandy/material-react-table/blob/85b98f9aaa038df48aa1dd35123560abce78ee58/packages/material-react-table/src/components/toolbar/MRT_ToolbarInternalButtons.tsx#L45
        */
        ({ table }) => (
          <Box>
            <MRT_ShowHideColumnsButton table={table} />
            {!selectorFn && <MRT_ToggleFullScreenButton table={table} />}
          </Box>
        )
      }
    />
  )
}
