import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { TableView } from '../TableView'

interface Locality {
  loc_name: string
  min_age: number
  max_age: number
  country: string
  lid: string
}

export const Localities = () => {
  const localitiesQuery = useGetAllLocalitiesQuery({})
  const navigate = useNavigate()

  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        accessorFn: row => <Button onClick={() => navigate(`/locality/${row.lid}`)}>Details</Button>,
        header: 'View',
        size: 12,
      },
      {
        accessorKey: 'loc_name',
        header: 'Name',
        size: 220,
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        size: 5,
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        size: 5,
      },
      {
        accessorKey: 'country',
        header: 'Country',
        size: 150,
      },
    ],
    [navigate]
  )

  return (
    <div>
      <TableView columns={columns} data={localitiesQuery.data} />
    </div>
  )
}
