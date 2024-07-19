import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery, useGetLocalitySpeciesListMutation } from '../../redux/localityReducer'
import { Locality } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const LocalityTable = ({ selectorFn }: { selectorFn?: (newObject: Locality) => void }) => {
  const localitiesQuery = useGetAllLocalitiesQuery()
  const [getLocalitySpeciesList] = useGetLocalitySpeciesListMutation()

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
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
      },
    ],
    []
  )

  const combinedExport = async (lids: number[]) => {
    const result = await getLocalitySpeciesList(lids).unwrap()
    const dataString = result.map(row => (row as unknown[]).join(',')).join('\n')
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
      data={localitiesQuery.data}
      url="locality"
      combinedExport={combinedExport}
    />
  )
}
