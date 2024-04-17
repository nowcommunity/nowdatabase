import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_Row,
} from 'material-react-table'
import { Button, CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
*/
export const TableView = <T extends MRT_RowData>({
  data,
  columns,
  idFieldName,
}: {
  data: T[] | null
  columns: MRT_ColumnDef<T>[]
  idFieldName: keyof MRT_RowData
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])

  // Load state from url on first render
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const stateFromUrl = JSON.parse(searchParams.get('columnfilters') ?? '[]')
    setColumnFilters(stateFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save state to url when columnFilters change
  useEffect(() => {
    navigate(`${location.pathname}?columnfilters=${JSON.stringify(columnFilters)}`, { replace: true })
  }, [columnFilters, location.pathname, navigate])

  if (!data) return <CircularProgress />

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ columnFilters, showColumnFilters: true }}
        onColumnFiltersChange={setColumnFilters}
        renderRowActions={({ row }) => (
          <Button
            variant="contained"
            style={{ width: '2em' }}
            onClick={() => navigate(`/locality/${row.original[idFieldName as keyof MRT_Row<T>]}`)}
          >
            <ManageSearchIcon />
          </Button>
        )}
        displayColumnDefOptions={{ 'mrt-row-actions': { size: 50, header: '' } }}
        enableRowActions
      />
    </div>
  )
}
