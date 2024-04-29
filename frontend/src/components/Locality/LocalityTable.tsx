import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { Locality } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const LocalityTable = ({
  selectorFn,
  selectedList,
}: {
  selectorFn?: (id: string) => void
  selectedList?: string[]
}) => {
  const localitiesQuery = useGetAllLocalitiesQuery({})
  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'lid',
        header: 'Id',
        size: 20,
      },
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
      selectorFn={selectorFn}
      selectedList={selectedList}
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      data={localitiesQuery.data}
    />
  )
}
