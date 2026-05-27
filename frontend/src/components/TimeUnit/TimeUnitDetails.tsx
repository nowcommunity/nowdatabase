import { EditDataType, TimeUnitDetailsType } from '@/shared/types'
import { useNotify } from '@/hooks/notification'
import { CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from 'react'
import {
  formatTimeUnitWriteError,
  useEditTimeUnitMutation,
  useGetTimeUnitDetailsQuery,
} from '../../redux/timeUnitReducer'
import { emptyTimeUnit } from '../DetailView/common/defaultValues'
import { DetailView, TabType } from '../DetailView/DetailView'
import { LocalityTab } from './Tabs/LocalityTab'
import { TimeUnitTab } from './Tabs/TimeUnitTab'
import { TimeUnitUpdateTab } from './Tabs/TimeUnitUpdateTab'
import { validateTimeUnit } from '@/shared/validators/timeUnit'
import { makeEditData } from '../DetailView/Context/DetailContext'
import { useDeleteTimeUnit } from '@/hooks/useDeleteTimeUnit'
import { getApiErrorMessage, isDuplicateNameError } from '@/utils/api'
import { useTimeUnitForm } from '@/hooks/useTimeUnitForm'
import { UnsavedChangesContext } from '../unsavedChangesContext'

export const TimeUnitDetails = ({
  wrapWithUnsavedChangesProvider = true,
}: {
  wrapWithUnsavedChangesProvider?: boolean
} = {}) => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New Time Unit'
  }
  const { isLoading, isError, isFetching, data } = useGetTimeUnitDetailsQuery(encodeURIComponent(id!), { skip: isNew })
  const [editTimeUnitRequest] = useEditTimeUnitMutation()

  const { notify } = useNotify()
  const unsavedChanges = useContext(UnsavedChangesContext)
  const navigate = useNavigate()
  const { deleteTimeUnit } = useDeleteTimeUnit({
    onSuccess: () => navigate('/time-unit'),
  })
  const { normalizeRank } = useTimeUnitForm()

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
    setEditData: (editData: EditDataType<TimeUnitDetailsType>) => void,
    markEditDataClean?: (editData?: EditDataType<TimeUnitDetailsType>) => void
  ) => {
    try {
      const normalizedEditData = normalizeRank(editData)
      const { tu_name } = await editTimeUnitRequest(normalizedEditData).unwrap()
      markEditDataClean?.({
        ...normalizedEditData,
        tu_name,
      })
      unsavedChanges?.setDirty(false)
      notify('Edited item successfully.')
      return () => {
        unsavedChanges?.allowNextNavigation?.()
        navigate(`/time-unit/${tu_name}`)
      }
    } catch (e) {
      if (data) {
        setEditData(makeEditData(data))
      }

      if (isDuplicateNameError(e)) {
        notify(getApiErrorMessage(e, 'Time unit with the provided name already exists'), 'warning')
        return
      }
      const parsedErrorMessage = formatTimeUnitWriteError(e)
      if (parsedErrorMessage) {
        notify(parsedErrorMessage, 'error', null)
        return
      }

      notify('Could not edit item. Uncaught error happened.', 'error')
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
      content: <TimeUnitUpdateTab />,
    },
  ]

  return (
    <DetailView
      key={isNew ? 'new' : data!.tu_name}
      tabs={tabs}
      isNew={isNew}
      hasStagingMode
      data={isNew ? emptyTimeUnit : data!}
      onWrite={onWrite}
      validator={validateTimeUnit}
      deleteFunction={deleteFunction}
      wrapWithUnsavedChangesProvider={wrapWithUnsavedChangesProvider}
    />
  )
}
