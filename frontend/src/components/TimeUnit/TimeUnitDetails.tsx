import { EditDataType, TimeUnitDetailsType, ValidationErrors } from '@/backendTypes'
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
import { makeEditData } from '../DetailView/Context/DetailContext'

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

  const onWrite = async (
    editData: EditDataType<TimeUnitDetailsType>,
    setEditData: (editData: EditDataType<TimeUnitDetailsType>) => void
  ) => {
    try {
      const { tu_name } = await editTimeUnitRequest(editData).unwrap()
      setTimeout(() => navigate(`/time-unit/${tu_name}`), 15)
      notify('Edited item succesfully.')
    } catch (e) {
      if (data) {
        setEditData(makeEditData(data))
      }
      if (e && typeof e === 'object' && 'status' in e && e.status !== 403) {
        notify('Could not edit item. Error happened.', 'error')
      } else {
        const error = e as ValidationErrors
        let message = 'Could not save item. Missing: '
        Object.keys(error.data).forEach(key => {
          message += `${error.data[key].name}. `
        })
        notify(message, 'error')
      }
    }
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
