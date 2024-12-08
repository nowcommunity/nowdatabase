import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery, useGetLocalitySpeciesListMutation } from '../../redux/localityReducer'
import { Locality } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { useNotify } from '@/hooks/notification'

const decimalCount = (num: number) => {
  const numAsString = num.toString()
  if (numAsString.includes('.')) {
    return numAsString.split('.')[1].length
  }
  return 0
}

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
        enableColumnFilterModes: false,
      },
      {
        id: 'loc_name',
        accessorFn: row => row.loc_name || '',
        header: 'Name',
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
        Cell: ({ cell }) => {
          const cellVal = cell.getValue() as number
          if (decimalCount(cellVal) > 3) {
            return cellVal.toFixed(3)
          }
          return cellVal
        },
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => {
          const cellVal = cell.getValue() as number
          if (decimalCount(cellVal) > 3) {
            return cellVal.toFixed(3)
          }
          return cellVal
        },
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
      enableColumnFilterModes={true}
    />
  )
}
