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
        size: 20,
      },
      {
        accessorKey: 'order_name',
        header: 'Order',
        size: 20,
      },
      {
        accessorKey: 'suborder_or_superfamily_name',
        header: 'Suborder or Superfamily',
        size: 20,
      },
      {
        accessorKey: 'family_name',
        header: 'Family',
        size: 20,
      },
      {
        accessorKey: 'subfamily_name',
        header: 'Subfamily or Tribe',
        size: 20,
      },
      {
        accessorKey: 'genus_name',
        header: 'Genus',
        size: 20,
      },
      {
        accessorKey: 'species_name',
        header: 'Species',
        size: 20,
      },
      {
        accessorKey: 'unique_identifier',
        header: 'Unique Identifier',
        size: 20,
      },
      {
        accessorKey: 'taxonomic_status',
        header: 'Taxonomic Status',
        size: 20,
      },
      {
        accessorKey: 'common_name',
        header: 'Common Name',
        size: 20,
      },
      {
        accessorKey: 'sp_author',
        header: 'Author',
        size: 20,
      },
      {
        accessorKey: 'strain',
        header: 'Strain',
        size: 20,
      },
      {
        accessorKey: 'gene',
        header: 'Gene',
        size: 20,
      },
      {
        accessorKey: 'body_mass',
        header: 'Body Mass',
        size: 20,
      },
      {
        accessorKey: 'brain_mass',
        header: 'Brain Mass',
        size: 20,
      },
      {
        accessorKey: 'sp_status',
        header: 'Status',
      }
    ],
    []
  )

  const visibleColumns = {
    id: false,
    common_name: false,
    sp_author: false,
    strain: false,
    gene: false,
    body_mass: false,
    brain_mass: false,
  }

  return (
    <TableView<Species>
      title="Species"
      selectorFn={selectorFn}
      idFieldName="species_id"
      columns={columns}
      visibleColumns={visibleColumns}
      data={speciesQuery.data}
      url="species"
    />
  )
}
