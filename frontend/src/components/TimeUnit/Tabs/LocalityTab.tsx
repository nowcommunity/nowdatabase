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

  // changes min and max age values to checkmarks or X symbols, to show whether this time unit is set as the basis for min/max age or not
  const modifiedData = localitiesData.map(locality => {
    return {
      ...locality,
      min_age: locality.bfa_min === data.tu_name ? '\u2713' : '\u0058',
      max_age: locality.bfa_max === data.tu_name ? '\u2713' : '\u0058',
    }
  })

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

  return <SimpleTable columns={columns} data={modifiedData} idFieldName="lid" url="locality" />
}
