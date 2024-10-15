import { useMemo, useState } from 'react'
import { MRT_VisibilityState, type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery, useGetLocalitySpeciesListMutation } from '../../redux/localityReducer'
import { ColumnCategory, ColumnCategories, Locality } from '@/backendTypes'
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
        header: 'Id',
        size: 20,
      },
      {
        accessorKey: 'loc_name',
        header: 'Name',
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
        filterVariant: 'range',
      },
      {
        accessorKey: 'bfa_min',
        header: 'BFA min',
        filterVariant: 'range',
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
    ],
    []
  )

  const [visibleColumns, setVisibleColumns] = useState({
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
  } as MRT_VisibilityState)

  const columnCategories = {
    'Location': {
      columns : ['loc_name', 'country', 'state', 'county', 'dec_lat', 'dec_long', 'altitude'],
      buttonstate : false
    } as ColumnCategory,
    'Biostratigraphy': {
      columns : ['bfa_max', 'bfa_min', 'max_age', 'min_age', 'frac_max', 'frac_min', 'chron'],
      buttonstate : false
    } as ColumnCategory,
    'Geology': {
      columns : ['basin', 'subbasin', 'plate', 'formation', 'member', 'bed'],
      buttonstate : false
    } as ColumnCategory,
    'Misc': {
      columns : ['dms_lat', 'dms_long', 'site_area', 'gen_loc'],
      buttonstate : false
    } as ColumnCategory,
  } as ColumnCategories

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
      setVisibleColumns={setVisibleColumns}
      columnCategories={columnCategories}
      data={localitiesQuery.data}
      url="locality"
      combinedExport={combinedExport}
      exportIsLoading={isLoading}
    />
  )
}
