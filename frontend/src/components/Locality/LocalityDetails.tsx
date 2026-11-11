import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteLocalityMutation,
  useEditLocalityMutation,
  useGetLocalityDetailsQuery,
} from '../../redux/localityReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { AgeTab } from './Tabs/AgeTab'
import { ArchaeologyTab } from './Tabs/ArchaeologyTab'
import { ClimateTab } from './Tabs/ClimateTab'
import { EcometricsTab } from './Tabs/EcometricsTab'
import { LithologyTab } from './Tabs/LithologyTab'
import { LocalityTab } from './Tabs/LocalityTab'
import { MuseumTab } from './Tabs/MuseumTab'
import { OccurrencesTab } from './Tabs/OccurrencesTab'
import { ProjectTab } from './Tabs/ProjectTab'
import { TaphonomyTab } from './Tabs/TaphonomyTab'
import { EditDataType, LocalityDetailsType, Role, ValidationErrors } from '@/shared/types'
import { validateLocality, validateLocalityFields } from '@/shared/validators/locality'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { emptyLocality } from '../DetailView/common/defaultValues'
import { useNotify } from '@/hooks/notification'
import { useUser } from '@/hooks/user'
import { UserState } from '@/redux/userReducer'
import { useEffect } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { makeEditData } from '../DetailView/Context/DetailContext'
import { occurrenceLabels } from '@/constants/occurrenceLabels'

const removesLastEditEnablingProject = (user: UserState, editData: EditDataType<LocalityDetailsType>) => {
  if (user.role !== Role.EditRestricted || !user.projects || !editData.now_plr) return false
  const userProjects = new Set(user.projects)
  const remaining = editData.now_plr.filter(link => link.rowState !== 'removed')
  const hadAccess = editData.now_plr.some(
    link => link.rowState !== 'new' && link.pid !== undefined && userProjects.has(link.pid)
  )
  return hadAccess && !remaining.some(link => link.pid !== undefined && userProjects.has(link.pid))
}

export const LocalityDetails = ({
  wrapWithUnsavedChangesProvider = true,
}: {
  wrapWithUnsavedChangesProvider?: boolean
} = {}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New locality'
  }
  const [editLocalityRequest, { isLoading: mutationLoading }] = useEditLocalityMutation()
  const { isFetching, isError, data, refetch } = useGetLocalityDetailsQuery(id!, {
    skip: isNew,
  })

  const { notify } = useNotify()
  const user = useUser()
  const [deleteMutation, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteLocalityMutation()

  useEffect(() => {
    if (deleteSuccess) {
      notify('Deleted item successfully.')
      navigate('/locality')
    } else if (deleteError) {
      notify('Could not delete item. Error happened.', 'error')
    }
  }, [deleteSuccess, deleteError, notify, navigate])

  if (isError) return <div>Error loading data</div>
  if (isFetching || (!data && !isNew) || mutationLoading) return <CircularProgress />
  if (data) {
    document.title = `Locality - ${data.loc_name}`
  }

  const deleteFunction = async () => {
    await deleteMutation(parseInt(id!)).unwrap()
  }

  const formatValidationErrors = (error: ValidationErrors) =>
    error.data.map(item => `${item.name}: ${item.error}`).join(', ')

  const isFetchError = (error: unknown): error is FetchBaseQueryError =>
    typeof error === 'object' && error !== null && 'status' in error

  const isValidationError = (error: unknown): error is ValidationErrors => {
    if (typeof error !== 'object' || error === null || !('data' in error) || !('status' in error)) {
      return false
    }
    const possibleError = error as { data?: unknown }
    return Array.isArray(possibleError.data)
  }

  const onWrite = async (
    editData: EditDataType<LocalityDetailsType>,
    setEditData: (next: EditDataType<LocalityDetailsType>) => void
  ) => {
    if (!isNew && removesLastEditEnablingProject(user, editData)) {
      const confirmed = window.confirm(
        'You are removing the last project that enables you to edit this locality. After saving, you will no longer be able to edit it. Continue?'
      )
      if (!confirmed) return { cancelled: true } as const
    }
    try {
      const { id, editAccess } = await editLocalityRequest(editData).unwrap()
      if (!isNew && editAccess !== false) {
        const refreshed = await refetch()
        if (refreshed.data) {
          setEditData(makeEditData(refreshed.data))
        }
      }
      setTimeout(() => navigate(editAccess === false ? '/locality' : `/locality/${id}`), 15)
      notify('Edited item successfully.')
    } catch (e) {
      if (isFetchError(e) && e.status === 403 && isValidationError(e.data)) {
        notify('Following validators failed: ' + formatValidationErrors(e.data), 'error')
        return
      }
      if (isValidationError(e)) {
        notify('Following validators failed: ' + formatValidationErrors(e), 'error')
        return
      }
      notify('Could not edit item. Error happened.', 'error')
    }
  }

  const tabs: TabType[] = [
    {
      title: 'Age',
      content: <AgeTab />,
    },
    {
      title: 'Locality',
      content: <LocalityTab />,
    },
    {
      title: occurrenceLabels.plural,
      content: <OccurrencesTab />,
    },
    {
      title: 'Lithology',
      content: <LithologyTab />,
    },
    {
      title: 'Taphonomy',
      content: <TaphonomyTab />,
    },
    {
      title: 'Climate',
      content: <ClimateTab />,
    },
    {
      title: 'Ecometrics',
      content: <EcometricsTab />,
    },
    {
      title: 'Archaeology',
      content: <ArchaeologyTab />,
    },
    {
      title: 'Museum',
      content: <MuseumTab />,
    },
    {
      title: 'Projects',
      content: <ProjectTab />,
    },
    {
      title: 'Updates',
      content: <UpdateTab refFieldName="now_lr" updatesFieldName="now_lau" prefix="lau" />,
    },
  ]

  return (
    <DetailView<LocalityDetailsType>
      tabs={tabs}
      data={isNew ? emptyLocality : data!}
      isNew={isNew}
      onWrite={onWrite}
      validator={validateLocality}
      validateFields={validateLocalityFields}
      deleteFunction={deleteFunction}
      hasStagingMode
      wrapWithUnsavedChangesProvider={wrapWithUnsavedChangesProvider}
    />
  )
}
