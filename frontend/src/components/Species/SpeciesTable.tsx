import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllSpeciesQuery } from '../../redux/speciesReducer'
import { Species } from '@/shared/types'
import { TableView } from '../TableView/TableView'

export const SpeciesTable = ({ selectorFn }: { selectorFn?: (id: Species) => void }) => {
  const speciesQuery = useGetAllSpeciesQuery()
  const columns = useMemo<MRT_ColumnDef<Species>[]>(
    () => [
      {
        accessorKey: 'species_id',
        header: 'Id',
        size: 20,
      },
      {
        id: 'subclass_or_superorder_name',
        accessorFn: row => row.subclass_or_superorder_name || 'N/A',
        header: 'Subclass or Superorder',
        size: 20,
        filterFn: 'contains',
      },
      {
        accessorKey: 'order_name',
        header: 'Order',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'suborder_or_superfamily_name',
        accessorFn: row => row.suborder_or_superfamily_name || 'N/A',
        header: 'Suborder or Superfamily',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'family_name',
        accessorFn: row => row.family_name || 'N/A',
        header: 'Family',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'subfamily_name',
        accessorFn: row => row.subfamily_name || 'N/A',
        header: 'Subfamily or Tribe',
        size: 20,
        filterFn: 'contains',
      },
      {
        accessorKey: 'genus_name',
        header: 'Genus',
        size: 20,
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        accessorKey: 'species_name',
        header: 'Species',
        size: 20,
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        accessorKey: 'unique_identifier',
        header: 'Unique Identifier',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'taxonomic_status',
        accessorFn: row => row.taxonomic_status || 'N/A',
        header: 'Taxonomic Status',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'common_name',
        accessorFn: row => row.common_name || 'N/A',
        header: 'Common Name',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'sp_author',
        accessorFn: row => row.sp_author || 'N/A',
        header: 'Author',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'strain',
        accessorFn: row => row.strain || 'N/A',
        header: 'Strain',
        size: 20,
        filterFn: 'contains',
      },
      {
        accessorKey: 'gene',
        header: 'Gene',
        size: 20,
      },
      {
        id: 'body_mass',
        accessorFn: row => row.body_mass || 'N/A',
        header: 'Body Mass',
        size: 20,
        filterVariant: 'range',
      },
      {
        id: 'brain_mass',
        accessorFn: row => row.brain_mass || 'N/A',
        header: 'Brain Mass',
        size: 20,
        filterVariant: 'range',
      },
    ],
    []
  )

  const visibleColumns = {
    species_id: false,
    unique_identifier: false,
    taxonomic_status: false,
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
