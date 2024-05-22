import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllSpeciesQuery } from '../../redux/speciesReducer'
import { Species } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const SpeciesTable = ({ selectorFn }: { selectorFn?: (id: Species) => void }) => {
  const speciesQuery = useGetAllSpeciesQuery()
  const columns = useMemo<MRT_ColumnDef<Species>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'species_id',
        header: 'Id',
        size: 20,
      },
      {
        accessorKey: 'subclass_or_superorder_name',
        header: 'Subclass or Superorder',
      },
      {
        accessorKey: 'order_name',
        header: 'Order',
      },
      {
        accessorKey: 'suborder_or_superfamily_name',
        header: 'Suborder or Superfamily',
      },
      {
        accessorKey: 'family_name',
        header: 'Family',
      },
      {
        accessorKey: 'subfamily_name',
        header: 'Subfamily or Tribe',
      },
      {
        accessorKey: 'genus_name',
        header: 'Genus',
      },
      {
        accessorKey: 'species_name',
        header: 'Species',
      },
      {
        accessorKey: 'unique_identifier',
        header: 'Unique Identifier',
      },
    ],
    []
  )
  const checkRowRestriction = (row: Species) => {
    return !!row.sp_status
  }

  return (
    <TableView<Species>
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="species_id"
      columns={columns}
      data={speciesQuery.data}
      url="species"
    />
  )
}
