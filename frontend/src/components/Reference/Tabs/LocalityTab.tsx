import { ReferenceDetailsType } from '@/shared/types'
import { useGetReferenceLocalitiesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'

export const LocalityTab = () => {
  const { data } = useDetailContext<ReferenceDetailsType>()
  const { data: localitiesData, isError } = useGetReferenceLocalitiesQuery(encodeURIComponent(data.rid))

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

  return <SimpleTable columns={columns} data={localitiesData} idFieldName="lid" url="locality" />
}
