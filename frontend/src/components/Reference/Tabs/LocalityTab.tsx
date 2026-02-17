import { ReferenceDetailsType } from '@/shared/types'
import { useGetReferenceLocalitiesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { DetailTabTable } from '@/components/DetailView/common/DetailTabTable'

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

  return (
    <DetailTabTable
      mode="read"
      title="Reference Localities"
      columns={columns}
      data={localitiesData}
      idFieldName="lid"
      url="locality"
      isFetching={false}
      enableColumnFilterModes={true}
      clickableRows={true}
      paginationPlacement="bottom"
    />
  )
}
