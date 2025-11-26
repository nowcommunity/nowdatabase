import { EditDataType, TimeUnitDetailsType, ValidationErrors } from '@/shared/types'
import { useNotify } from '@/hooks/notification'
import { CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditTimeUnitMutation, useGetTimeUnitDetailsQuery } from '../../redux/timeUnitReducer'
import { emptyTimeUnit } from '../DetailView/common/defaultValues'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { DetailView, TabType } from '../DetailView/DetailView'
import { LocalityTab } from './Tabs/LocalityTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab'
import { validateTimeUnit } from '@/shared/validators/timeUnit'
import { makeEditData } from '../DetailView/Context/DetailContext'
import { useDeleteTimeUnit } from '@/hooks/useDeleteTimeUnit'
import { getApiErrorMessage, isDuplicateNameError } from '@/utils/api'

export const TimeUnitDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New Time Unit'
  }
  const { isLoading, isError, isFetching, data } = useGetTimeUnitDetailsQuery(encodeURIComponent(id!), { skip: isNew })
  const [editTimeUnitRequest] = useEditTimeUnitMutation()

  const { notify } = useNotify()
  const navigate = useNavigate()
  const { deleteTimeUnit } = useDeleteTimeUnit({
    onSuccess: () => navigate('/time-unit'),
  })

  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />
  if (data) {
    document.title = `Time Unit - ${data.tu_display_name}`
  }

  const deleteFunction = async () => {
    await deleteTimeUnit(id!)
  }

  const onWrite = async (
    editData: EditDataType<TimeUnitDetailsType>,
    setEditData: (editData: EditDataType<TimeUnitDetailsType>) => void
  ) => {
    try {
      const { tu_name } = await editTimeUnitRequest(editData).unwrap()
      setTimeout(() => navigate(`/time-unit/${tu_name}`), 15)
      notify('Edited item successfully.')
    } catch (e) {
      if (data) {
        setEditData(makeEditData(data))
      }

      if (isDuplicateNameError(e)) {
        notify(getApiErrorMessage(e, 'Time unit with the provided name already exists'), 'warning')
        return
      }
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
