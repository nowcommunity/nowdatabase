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
        enableColumnFilterModes: false,
      },
      {
        id: 'subclass_or_superorder_name',
        accessorFn: row => row.subclass_or_superorder_name || '',
        header: 'Subclass or Superorder',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'order_name',
        accessorFn: row => row.order_name || '',
        header: 'Order',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'suborder_or_superfamily_name',
        accessorFn: row => row.suborder_or_superfamily_name || '',
        header: 'Suborder or Superfamily',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'family_name',
        accessorFn: row => row.family_name || '',
        header: 'Family',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'subfamily_name',
        accessorFn: row => row.subfamily_name || '',
        header: 'Subfamily or Tribe',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'genus_name',
        accessorFn: row => row.genus_name || '',
        header: 'Genus',
        size: 20,
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        id: 'species_name',
        accessorFn: row => row.species_name || '',
        header: 'Species',
        size: 20,
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        id: 'unique_identifier',
        accessorFn: row => row.unique_identifier || '',
        header: 'Unique Identifier',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'taxonomic_status',
        accessorFn: row => row.taxonomic_status || '',
        header: 'Taxonomic Status',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'common_name',
        accessorFn: row => row.common_name || '',
        header: 'Common Name',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'sp_author',
        accessorFn: row => row.sp_author || '',
        header: 'Author',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'strain',
        accessorFn: row => row.strain || '',
        header: 'Strain',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'gene',
        accessorFn: row => row.gene || '',
        header: 'Gene',
        size: 20,
      },
      {
        id: 'body_mass',
        accessorFn: row => row.body_mass || '',
        header: 'Body Mass',
        size: 20,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'brain_mass',
        accessorFn: row => row.brain_mass || '',
        header: 'Brain Mass',
        size: 20,
        filterVariant: 'range',
        enableColumnFilterModes: false,
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
      enableColumnFilterModes={true}
    />
  )
}
