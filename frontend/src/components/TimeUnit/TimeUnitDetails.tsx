import { useParams } from 'react-router-dom'
import { useEditTimeUnitMutation, useGetTimeUnitDetailsQuery } from '../../redux/timeUnitReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { LocalityTab } from './Tabs/LocalityTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { EditDataType, TimeUnitDetailsType } from '@/backendTypes'

export const TimeUnitDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetTimeUnitDetailsQuery(encodeURIComponent(id!))
  const [editTimeUnitRequest, status] = useEditTimeUnitMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const onWrite = async (editData: EditDataType<TimeUnitDetailsType>) => {
    await editTimeUnitRequest(editData)
  }

  const tabs: TabType[] = [
    {
      title: 'Time Unit',
      content: <TimeUnitTab />,
    },
    {
      title: 'Localities',
      content: <LocalityTab />,
    },
    {
      title: 'Updates',
      content: <UpdateTab refFieldName="now_tr" updatesFieldName="now_tau" prefix="tau" />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      data={data}
      onWrite={onWrite}
      loading={status.isLoading}
      validator={() => ({ name: '', error: null })}
    />
  )
}
