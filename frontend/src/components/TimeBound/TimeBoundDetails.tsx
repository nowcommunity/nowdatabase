import { EditDataType, TimeBoundDetailsType, ValidationErrors } from '@/shared/types.js'
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
import { validateTimeBound } from '@/validators/timeBound.ts'

export const TimeBoundDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New Time Bound'
  }
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
  if (data) {
    document.title = `Time Bound - ${data.b_name}`
  }

  const deleteFunction = async () => {
    await deleteMutation(parseInt(id!)).unwrap()
  }

  const onWrite = async (editedTimeBound: EditDataType<TimeBoundDetailsType>) => {
    try {
      const { bid } = await editTimeBoundRequest(editedTimeBound).unwrap()
      setTimeout(() => navigate(`/time-bound/${bid}`), 15)
      notify('Edited item successfully.')
    } catch (e) {
      if (
        e &&
        typeof e === 'object' &&
        'status' in e &&
        e.status === 403 &&
        'data' in e &&
        e.data &&
        typeof e.data === 'object'
      ) {
        if ('name' in e.data) {
          if ('cascadeErrors' in e.data && e.data.cascadeErrors !== '') {
            notify(e.data.cascadeErrors as string, 'error', null)
          }
          if ('calculatorErrors' in e.data && e.data.calculatorErrors !== '') {
            notify(e.data.calculatorErrors as string, 'error', null)
          }
        } else {
          const error = e as ValidationErrors
          notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
        }
      } else {
        notify('Could not edit item. Uncaught error happened.', 'error')
      }
    }
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
      validator={validateTimeBound}
      deleteFunction={deleteFunction}
    />
  )
}
