import { useParams } from 'react-router-dom'
import { useGetTimeUnitDetailsQuery } from '../../redux/timeUnitReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { LocalityTab } from './Tabs/LocalityTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab'

export const TimeUnitDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetTimeUnitDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Time Unit',
      content: <TimeUnitTab />,
    },
    {
      title: 'Localities',
      content: <LocalityTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} onWrite={() => {}} validator={() => null} />
}
