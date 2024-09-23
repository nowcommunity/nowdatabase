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
        accessorKey: 'country',
        header: 'Country',
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
    ],
    []
  )

  const hiddenColumns = {
    id: false,
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
      hiddenColumns={hiddenColumns}
      data={localitiesQuery.data}
      url="locality"
      combinedExport={combinedExport}
      exportIsLoading={isLoading}
    />
  )
}
