import { useParams } from 'react-router-dom'
import { useEditTimeBoundMutation, useGetTimeBoundDetailsQuery } from '../../redux/timeBoundReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { BoundTab } from './Tabs/BoundTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab.tsx'
import { UpdateTab } from '../DetailView/common/UpdateTab.tsx'
import { EditDataType, TimeBoundDetailsType } from '@/backendTypes.js'

export const TimeBoundDetails = () => {
  const { id } = useParams()
  const { isLoading, isFetching, isError, data } = useGetTimeBoundDetailsQuery(decodeURIComponent(id!))
  const [editTimeBoundRequest] = useEditTimeBoundMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || !data) return <CircularProgress />

  const onWrite = async (editedTimeBound: EditDataType<TimeBoundDetailsType>) => {
    await editTimeBoundRequest(editedTimeBound)
  }

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
      content: <UpdateTab refFieldName="now_br" updatesFieldName="now_bau" prefix="bau" />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      data={data}
      onWrite={onWrite}
      validator={() => ({
        name: 'unknown',
        error: null,
      })}
    />
  )
}
