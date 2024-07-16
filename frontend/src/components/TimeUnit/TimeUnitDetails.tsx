import { useParams } from 'react-router-dom'
import { useEditTimeUnitMutation, useGetTimeUnitDetailsQuery } from '../../redux/timeUnitReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { LocalityTab } from './Tabs/LocalityTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { EditDataType, TimeUnitDetailsType } from '@/backendTypes'
import { emptyTimeUnit } from '../DetailView/common/defaultValues'

export const TimeUnitDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  const { isLoading, isError, isFetching, data } = useGetTimeUnitDetailsQuery(encodeURIComponent(id!), { skip: isNew })
  const [editTimeUnitRequest] = useEditTimeUnitMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />

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
      isNew={isNew}
      hasStagingMode
      data={isNew ? emptyTimeUnit : data!}
      onWrite={onWrite}
      validator={() => ({ name: '', error: null })}
    />
  )
}
