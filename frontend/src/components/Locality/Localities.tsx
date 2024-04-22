import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { type now_locAttributes as Locality } from '@backend/models/now_loc'
import { TableView } from '../TableView/TableView'

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
  const checkRowRestriction = (row: Locality) => {
    return !!row.loc_status
  }

  return (
    <TableView<Locality>
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      data={localitiesQuery.data}
    />
  )
}
