import { Locality, TimeUnitDetailsType } from '@/backendTypes'
import { useGetTimeUnitLocalitiesQuery } from '@/redux/timeUnitReducer'
import { CircularProgress } from '@mui/material'
import { TableView } from '../../TableView/TableView'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const LocalityTab = () => {
  const { data } = useDetailContext<TimeUnitDetailsType>()
  const { data: localitiesData, isError } = useGetTimeUnitLocalitiesQuery(data.tu_name!)

  if (isError) return 'Error loading Localities.'
  if (!localitiesData) return <CircularProgress />

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
      data={localitiesData}
      url="locality"
    />
  )
}
