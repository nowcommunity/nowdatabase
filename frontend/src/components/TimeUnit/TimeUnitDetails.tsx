import { EditDataType, TimeUnitDetailsType } from '@/backendTypes'
import { useNotify } from '@/hooks/notification'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteTimeUnitMutation,
  useEditTimeUnitMutation,
  useGetTimeUnitDetailsQuery,
} from '../../redux/timeUnitReducer'
import { emptyTimeUnit } from '../DetailView/common/defaultValues'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { DetailView, TabType } from '../DetailView/DetailView'
import { LocalityTab } from './Tabs/LocalityTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab'
import { validateTimeUnit } from '@/validators/timeUnit'

export const TimeUnitDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New time unit'
  }
  const { isLoading, isError, isFetching, data } = useGetTimeUnitDetailsQuery(encodeURIComponent(id!), { skip: isNew })
  const [editTimeUnitRequest] = useEditTimeUnitMutation()

  const notify = useNotify()
  const navigate = useNavigate()
  const [deleteMutation, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteTimeUnitMutation()

  useEffect(() => {
    if (deleteSuccess) {
      notify('Deleted item successfully.')
      navigate('/time-unit')
    } else if (deleteError) {
      notify('Could not delete item. Error happened.', 'error')
    }
  }, [deleteSuccess, deleteError, notify, navigate])

  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />
  if (data) {
    document.title = `Time Unit - ${data.tu_display_name}`
  }

  const deleteFunction = async () => {
    await deleteMutation(id!).unwrap()
  }

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
      validator={validateTimeUnit}
      deleteFunction={deleteFunction}
    />
  )
}
