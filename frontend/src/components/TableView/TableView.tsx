import { useEffect, useState } from 'react'
import {
  type MRT_ColumnFiltersState,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
} from 'material-react-table'
import { CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

/*
  TableView takes in the data and columns of a table, and handles
  rendering the actual table and saving & loading its state via url.
*/
export const TableView = <T extends MRT_RowData>({
  data,
  columns,
}: {
  data: T[] | null
  columns: MRT_ColumnDef<T>[]
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
      />
    </div>
  )
}
