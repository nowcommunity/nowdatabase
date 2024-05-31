import { Locality } from '@/backendTypes'
import { useGetTimeUnitLocalitiesQuery } from '@/redux/timeUnitReducer'
import { CircularProgress } from '@mui/material'
import { TableView } from '../../TableView/TableView'

export const LocalityTab = () => {
  const { data, isError } = useGetTimeUnitLocalitiesQuery('aragonian')

  if (isError) return 'Error loading Localities.'
  if (!data) return <CircularProgress />

  const columns = [
    {
      accessorKey: 'loc_name',
      header: 'Locality',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'max_age',
      header: 'Max Age',
    },
    {
      accessorKey: 'min_age',
      header: 'Min Age',
    },
  ]
  const checkRowRestriction = (row: Locality) => {
    return !!row.loc_status
  }

  return (
    <TableView<Locality>
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      data={data}
      url="locality"
    />
  )
}
