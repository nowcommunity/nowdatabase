import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { TableView } from '../TableView/TableView'

interface Locality {
  loc_name: string
  min_age: number
  max_age: number
  country: string
  lid: string
}

export const Localities = () => {
  const localitiesQuery = useGetAllLocalitiesQuery({})

  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        accessorKey: 'loc_name',
        header: 'Name',
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
    ],
    []
  )

  return (
    <div>
      <TableView<Locality> idFieldName="lid" columns={columns} data={localitiesQuery.data} />
    </div>
  )
}
