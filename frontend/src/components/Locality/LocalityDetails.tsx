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
import { ProjectTab } from './Tabs/ProjectTab'
import { SpeciesTab } from './Tabs/SpeciesTab'
import { TaphonomyTab } from './Tabs/TaphonomyTab'
import { EditDataType, LocalityDetailsType, ValidationErrors } from '@/shared/types'
import { validateLocality } from '@/shared/validators/locality'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { emptyLocality } from '../DetailView/common/defaultValues'
import { useNotify } from '@/hooks/notification'
import { useEffect } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { makeEditData } from '../DetailView/Context/DetailContext'

export const LocalityDetails = () => {
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
    try {
      const { id } = await editLocalityRequest(editData).unwrap()
      if (!isNew) {
        const refreshed = await refetch()
        if (refreshed.data) {
          setEditData(makeEditData(refreshed.data))
        }
      }
      setTimeout(() => navigate(`/locality/${id}`), 15)
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
      title: 'Species',
      content: <SpeciesTab />,
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
      deleteFunction={deleteFunction}
      hasStagingMode
    />
  )
}
