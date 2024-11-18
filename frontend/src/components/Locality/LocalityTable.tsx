import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery, useGetLocalitySpeciesListMutation } from '../../redux/localityReducer'
import { Locality } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { useNotify } from '@/hooks/notification'

export const LocalityTable = ({ selectorFn }: { selectorFn?: (newObject: Locality) => void }) => {
  const localitiesQuery = useGetAllLocalitiesQuery()
  const [getLocalitySpeciesList, { isLoading }] = useGetLocalitySpeciesListMutation()
  const notify = useNotify()
  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        accessorKey: 'lid',
        header: 'Locality Id',
        size: 20,
      },
      {
        accessorKey: 'loc_name',
        header: 'Locality name',
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        accessorKey: 'country',
        header: 'Country',
        filterFn: 'contains',
      },
      {
        id: 'state',
        accessorFn: (row) => row.state || 'N/A',
        header: 'State',
        filterFn: 'contains',
      },
      {
        id: 'county',
        accessorFn: (row) => row.county || 'N/A',
        header: 'County',
        filterFn: 'contains',
      },
      {
        id: 'bfa_max',
        accessorFn: (row) => row.bfa_max || 'N/A',
        header: 'BFA max',
        filterFn: 'contains',
      },
      {
        id: 'bfa_min',
        accessorFn: (row) => row.bfa_min || 'N/A',
        header: 'BFA min',
        filterFn: 'contains',
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        filterVariant: 'range',
        Cell: ({ cell }) => (cell.getValue() as number).toFixed(3),
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        filterVariant: 'range',
        Cell: ({ cell }) => (cell.getValue() as number).toFixed(3),
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
        id: 'chron',
        accessorFn: (row) => row.chron || 'N/A',
        header: 'Chron',
        filterFn: 'contains',
      },
      {
        id: 'basin',
        accessorFn: (row) => row.basin || 'N/A',
        header: 'Basin',
        filterFn: 'contains',
      },
      {
        id: 'subbasin',
        accessorFn: (row) => row.subbasin || 'N/A',
        header: 'Subbasin',
        filterFn: 'contains',
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
        id: 'plate',
        accessorFn: (row) => row.plate || 'N/A',
        header: 'Plate',
        filterFn: 'contains',
      },
      {
        id: 'formation',
        accessorFn: (row) => row.formation || 'N/A',
        header: 'Formation',
        filterFn: 'contains',
      },
      {
        id: 'member',
        accessorFn: (row) => row.member || 'N/A',
        header: 'Member',
        filterFn: 'contains',
      },
      {
        accessorKey: 'bed',
        header: 'Bed',
      },
    ],
    []
  )

  const visibleColumns = {
    lid: false,
    bfa_max: false,
    bfa_min: false,
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
  }

  const combinedExport = async (lids: number[]) => {
    if (isLoading) {
      notify('Please wait for the last request to complete.', 'warning')
      return
    }

    const limit = 99999999
    if (lids.length > limit) {
      notify(`Please filter the table more. Current rows: ${lids.length}. Limit: ${limit}`, 'error')
      return
    }
    const result = await getLocalitySpeciesList(lids).unwrap()
    const dataString = result.map(row => row.join(',')).join('\n')
    const blob = new Blob([dataString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'localitiesWithSpecies.csv'
    a.click()
  }

  const checkRowRestriction = (row: Locality) => {
    return !!row.loc_status
  }

  return (
    <TableView<Locality>
      title="Localities"
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      visibleColumns={visibleColumns}
      data={localitiesQuery.data}
      url="locality"
      combinedExport={combinedExport}
      exportIsLoading={isLoading}
    />
  )
}
