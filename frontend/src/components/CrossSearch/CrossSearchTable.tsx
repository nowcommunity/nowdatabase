import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { CrossSearch } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { useGetAllCrossSearchQuery } from '@/redux/crossSearchReducer'

export const CrossSearchTable = ({ selectorFn }: { selectorFn?: (newObject: CrossSearch) => void }) => {
  const crossSearchQuery = useGetAllCrossSearchQuery()
  const columns = useMemo<MRT_ColumnDef<CrossSearch>[]>(
    () => [
      {
        accessorKey: 'lid',
        header: 'Locality Id',
        size: 20,
        enableColumnFilterModes: false,
      },
      {
        id: 'loc_name',
        accessorFn: row => row.loc_name || '',
        header: 'Locality name',
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        id: 'country',
        accessorFn: row => row.country || '',
        header: 'Country',
        filterFn: 'contains',
      },
      {
        id: 'state',
        accessorFn: row => row.state || '',
        header: 'State',
        filterFn: 'contains',
      },
      {
        id: 'county',
        accessorFn: row => row.county || '',
        header: 'County',
        filterFn: 'contains',
      },
      {
        id: 'bfa_max',
        accessorFn: row => row.bfa_max || '',
        header: 'BFA max',
        filterFn: 'contains',
      },
      {
        id: 'bfa_min',
        accessorFn: row => row.bfa_min || '',
        header: 'BFA min',
        filterFn: 'contains',
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => (cell.getValue() as number).toFixed(3),
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => (cell.getValue() as number).toFixed(3),
      },
      {
        accessorKey: 'frac_max',
        header: 'Frac max',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'frac_min',
        header: 'Frac min',
        enableColumnFilterModes: false,
      },
      {
        id: 'chron',
        accessorFn: row => row.chron || '',
        header: 'Chron',
        filterFn: 'contains',
      },
      {
        id: 'basin',
        accessorFn: row => row.basin || '',
        header: 'Basin',
        filterFn: 'contains',
      },
      {
        id: 'subbasin',
        accessorFn: row => row.subbasin || '',
        header: 'Subbasin',
        filterFn: 'contains',
      },
      {
        accessorKey: 'dms_lat',
        header: 'DMS lat',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'dms_long',
        header: 'DMS long',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'dec_lat',
        header: 'Dec lat',
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'dec_long',
        header: 'Dec long',
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'altitude',
        header: 'Altitude',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'site_area',
        header: 'Site area',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'gen_loc',
        header: 'Gen locality',
        enableColumnFilterModes: false,
      },
      {
        id: 'plate',
        accessorFn: row => row.plate || '',
        header: 'Plate',
        filterFn: 'contains',
      },
      {
        id: 'formation',
        accessorFn: row => row.formation || '',
        header: 'Formation',
        filterFn: 'contains',
      },
      {
        id: 'member',
        accessorFn: row => row.member || '',
        header: 'Member',
        filterFn: 'contains',
      },
      {
        id: 'bed',
        accessorFn: row => row.bed || '',
        header: 'Bed',
      },
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
    lid: false,
    bfa_max: false,
    bfa_min: false,
    max_age: false,
    min_age: false,
    bfa_max_abs: false,
    bfa_min_abs: false,
    frac_max: false,
    frac_min: false,
    chron: false,
    basin: false,
    subbasin: false,
    dms_lat: false,
    dms_long: false,
    dec_lat: false,
    dec_long: false,
    altitude: false,
    state: false,
    county: false,
    site_area: false,
    gen_loc: false,
    plate: false,
    formation: false,
    member: false,
    bed: false,
    species_id: false,
    subclass_or_superorder_name: false,
    order_name: false,
    suborder_or_superfamily_name: false,
    family_name: false,
    subfamily_name: false,
    unique_identifier: false,
    taxonomic_status: false,
    common_name: false,
    sp_author: false,
    strain: false,
    gene: false,
    body_mass: false,
    brain_mass: false,
  }

  const checkRowRestriction = (row: CrossSearch) => {
    return !!row.loc_status
  }

  return (
    <TableView<CrossSearch>
      title="Locality-Species-Cross-Search"
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      visibleColumns={visibleColumns}
      data={crossSearchQuery.data}
      url="crosssearch"
      enableColumnFilterModes={true}
    />
  )
}
