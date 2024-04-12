import { useEffect, useMemo, useState } from 'react'
import { type MRT_ColumnFiltersState, MaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../redux/localityReducer'
import { CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

interface Locality {
  loc_name: string
  min_age: number
  max_age: number
  country: string
}

export const Localities = () => {
  const localitiesQuery = useGetAllLocalitiesQuery({})
  const navigate = useNavigate()
  const location = useLocation()
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])

  // Load table state from url
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const stateFromUrl = searchParams.get('columnfilters')
    setColumnFilters(JSON.parse(stateFromUrl ?? '[]'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save table state to url
  useEffect(() => {
    if (columnFilters.length === 0) return
    navigate(`${location.pathname}?columnfilters=${JSON.stringify(columnFilters)}`, { replace: true })
  }, [columnFilters, location.pathname, navigate])

  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        accessorKey: 'loc_name',
        header: 'Name',
        size: 150,
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        size: 150,
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        size: 150,
      },
      {
        accessorKey: 'country',
        header: 'Country',
        size: 150,
      },
    ],
    []
  )

  if (!localitiesQuery.data) return <CircularProgress />

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={localitiesQuery.data}
        state={{ columnFilters }}
        onColumnFiltersChange={setColumnFilters}
      />
    </div>
  )
}
