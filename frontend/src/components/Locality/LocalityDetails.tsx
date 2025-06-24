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

export const LocalityDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New locality'
  }
  const [editLocalityRequest, { isLoading: mutationLoading }] = useEditLocalityMutation()
  const { isFetching, isError, data } = useGetLocalityDetailsQuery(id!, {
    skip: isNew,
  })
  console.log('LocalityDetails: ', data)

  const notify = useNotify()
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

  const onWrite = async (editData: EditDataType<LocalityDetailsType>) => {
    try {
      const { id } = await editLocalityRequest(editData).unwrap()
      setTimeout(() => navigate(`/locality/${id}`), 15)
      notify('Edited item successfully.')
    } catch (e) {
      if (e && typeof e === 'object' && 'status' in e && e.status === 403) {
        const error = e as ValidationErrors
        notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
      } else {
        notify('Could not edit item. Error happened.', 'error')
      }
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
