import { useParams } from 'react-router-dom'
import { useGetTimeBoundDetailsQuery } from '../../redux/timeBoundReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { BoundTab } from './Tabs/BoundTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab.tsx'
import { UpdateTab } from './Tabs/UpdateTab'

export const TimeBoundDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetTimeBoundDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Bound',
      content: <BoundTab />,
    },
    {
      title: 'Time Units',
      content: <TimeUnitTab />,
    },
    {
      title: 'Updates',
      content: <UpdateTab />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      data={data}
      onWrite={() => {}}
      validator={() => ({
        name: 'unknown',
        error: null,
      })}
    />
  )
}
