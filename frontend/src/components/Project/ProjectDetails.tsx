import { useParams } from 'react-router-dom'
import { useGetProjectDetailsQuery } from '../../redux/projectReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'

export const ProjectDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetProjectDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Project',
      content: <CoordinatorTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} onWrite={() => {}} validator={() => null} />
}
