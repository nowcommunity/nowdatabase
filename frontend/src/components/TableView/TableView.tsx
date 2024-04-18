import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_SortingState,
} from 'material-react-table'
import { Box, Button, CircularProgress, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import PolicyIcon from '@mui/icons-material/Policy'

type TableStateInUrl = 'sorting' | 'columnfilters'

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
*/
export const TableView = <T extends MRT_RowData>({
  data,
  columns,
  idFieldName,
  checkRowRestriction,
}: {
  data: T[] | null
  columns: MRT_ColumnDef<T>[]
  idFieldName: keyof MRT_RowData
  checkRowRestriction: (row: T) => boolean
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])

  const loadStateFromUrl = (state: TableStateInUrl) => {
    const searchParams = new URLSearchParams(location.search)
    return JSON.parse(searchParams.get(state) ?? '[]')
  }

  // Load state from url only on first render
  useEffect(() => {
    setColumnFilters(loadStateFromUrl('columnfilters'))
    setSorting(loadStateFromUrl('sorting'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save state to url whenever it changes
  useEffect(() => {
    navigate(`${location.pathname}?columnfilters=${JSON.stringify(columnFilters)}&sorting=${JSON.stringify(sorting)}`, {
      replace: true,
    })
  }, [columnFilters, sorting, location.pathname, navigate])

  if (!data) return <CircularProgress />

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      state={{ columnFilters, showColumnFilters: true, sorting }}
      onColumnFiltersChange={setColumnFilters}
      renderRowActions={({ row }) => (
        <Box display="flex" gap="1em" alignItems="center" width="3.6em">
          <Button
            variant="contained"
            style={{ width: '2em' }}
            onClick={() => navigate(`/locality/${row.original[idFieldName]}`)}
          >
            <ManageSearchIcon />
          </Button>
          {checkRowRestriction(row.original) && (
            <Tooltip placement="top" title="This item has restricted visibility">
              <PolicyIcon color="primary" fontSize="large" />
            </Tooltip>
          )}
        </Box>
      )}
      displayColumnDefOptions={{ 'mrt-row-actions': { size: 50, header: '' } }}
      enableRowActions
      onSortingChange={setSorting}
    />
  )
}
