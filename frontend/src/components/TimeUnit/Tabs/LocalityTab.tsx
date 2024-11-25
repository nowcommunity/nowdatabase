import { TimeUnitDetailsType } from '@/shared/types'
import { useGetTimeUnitLocalitiesQuery } from '@/redux/timeUnitReducer'
import { CircularProgress } from '@mui/material'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'

export const LocalityTab = () => {
  const { data } = useDetailContext<TimeUnitDetailsType>()
  const { data: localitiesData, isError } = useGetTimeUnitLocalitiesQuery(encodeURIComponent(data.tu_name))

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

  return <SimpleTable columns={columns} data={localitiesData} />
}
