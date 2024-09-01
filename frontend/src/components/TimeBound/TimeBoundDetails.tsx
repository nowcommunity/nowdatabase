import { EditDataType, TimeBoundDetailsType } from '@/backendTypes.js'
import { useNotify } from '@/hooks/notification.ts'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteTimeBoundMutation,
  useEditTimeBoundMutation,
  useGetTimeBoundDetailsQuery,
} from '../../redux/timeBoundReducer'
import { emptyTimeBound } from '../DetailView/common/defaultValues.ts'
import { UpdateTab } from '../DetailView/common/UpdateTab.tsx'
import { DetailView, TabType } from '../DetailView/DetailView'
import { BoundTab } from './Tabs/BoundTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab.tsx'

export const TimeBoundDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  const { isLoading, isFetching, isError, data } = useGetTimeBoundDetailsQuery(decodeURIComponent(id!), {
    skip: isNew,
  })
  const [editTimeBoundRequest] = useEditTimeBoundMutation()

  const notify = useNotify()
  const navigate = useNavigate()
  const [deleteMutation, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteTimeBoundMutation()

  useEffect(() => {
    if (deleteSuccess) {
      notify('Deleted item successfully.')
      navigate('/time-bound')
    } else if (deleteError) {
      notify('Could not delete item. Error happened.', 'error')
    }
  }, [deleteSuccess, deleteError, notify, navigate])

  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />

  const deleteFunction = async () => {
    await deleteMutation(parseInt(id!)).unwrap()
  }

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
      data={isNew ? emptyTimeBound : data!}
      hasStagingMode
      isNew={isNew}
      onWrite={onWrite}
      validator={() => ({
        name: 'unknown',
        error: null,
      })}
      deleteFunction={deleteFunction}
    />
  )
}
