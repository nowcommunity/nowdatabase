import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../redux/localityReducer'
import { CircularProgress } from '@mui/material'

interface Locality {
  loc_name: string
  min_age: number
  max_age: number
  country: string
}

export const Localities = () => {
  const localitiesQuery = useGetAllLocalitiesQuery({})
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

  const table = useMaterialReactTable({
    columns,
    data: localitiesQuery.data ?? [],
  })

  if (!localitiesQuery.data) return <CircularProgress />

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  )
}
