import { useParams } from 'react-router-dom'
import { useGetRegionDetailsQuery } from '../../redux/regionReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'

export const RegionDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetRegionDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />
  if (data) {
    document.title = `${data.region}`
  }

  const tabs: TabType[] = [
    {
      title: 'Regional',
      content: <CoordinatorTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} validator={() => []} />
}
