import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllCrossSearchQuery } from '../../redux/crossSearchReducer'
import { CrossSearch } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const CrossSearchTable = ({ selectorFn }: { selectorFn?: (newObject: CrossSearch) => void }) => {
  const CrossSearchQuery = useGetAllCrossSearchQuery()
  const columns = useMemo<MRT_ColumnDef<CrossSearch>[]>(
    () => [
      {
        accessorKey: 'lid',
        header: 'Locality Id',
        size: 20,
      },
      {
        accessorKey: 'loc_name',
        header: 'Locality name',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'county',
        header: 'County',
      },
      {
        accessorKey: 'bfa_max',
        header: 'BFA max',
      },
      {
        accessorKey: 'bfa_min',
        header: 'BFA min',
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        filterVariant: 'range',
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        filterVariant: 'range',
      },
      {
        accessorKey: 'frac_max',
        header: 'Frac max',
      },
      {
        accessorKey: 'frac_min',
        header: 'Frac min',
      },
      {
        accessorKey: 'chron',
        header: 'Chron',
      },
      {
        accessorKey: 'basin',
        header: 'Basin',
      },
      {
        accessorKey: 'subbasin',
        header: 'Subbasin',
      },
      {
        accessorKey: 'dms_lat',
        header: 'DMS lat',
      },
      {
        accessorKey: 'dms_long',
        header: 'DMS long',
      },
      {
        accessorKey: 'dec_lat',
        header: 'Dec lat',
        filterVariant: 'range',
      },
      {
        accessorKey: 'dec_long',
        header: 'Dec long',
        filterVariant: 'range',
      },
      {
        accessorKey: 'altitude',
        header: 'Altitude',
      },
      {
        accessorKey: 'site_area',
        header: 'Site area',
      },
      {
        accessorKey: 'gen_loc',
        header: 'Gen locality',
      },
      {
        accessorKey: 'plate',
        header: 'Plate',
      },
      {
        accessorKey: 'formation',
        header: 'Formation',
      },
      {
        accessorKey: 'member',
        header: 'Member',
      },
      {
        accessorKey: 'bed',
        header: 'Bed',
      },
      {
        accessorKey: 'species_id',
        header: 'Species Id',
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
      data={CrossSearchQuery.data}
      url="crosssearch"
    />
  )
}
