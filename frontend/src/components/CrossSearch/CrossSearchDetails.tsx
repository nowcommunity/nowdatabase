import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteLocalityMutation,
  useEditLocalityMutation,
  useGetLocalityDetailsQuery,
} from '../../redux/localityReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { AgeTab } from '../Locality/Tabs/AgeTab'
import { ArchaeologyTab } from '../Locality/Tabs/ArchaeologyTab'
import { ClimateTab } from '../Locality/Tabs/ClimateTab'
import { EcometricsTab } from '../Locality/Tabs/EcometricsTab'
import { LithologyTab } from '../Locality/Tabs/LithologyTab'
import { LocalityTab } from '../Locality/Tabs/LocalityTab'
import { MuseumTab } from '../Locality/Tabs/MuseumTab'
import { ProjectTab } from '../Locality/Tabs/ProjectTab'
import { SpeciesTab } from '../Locality/Tabs/SpeciesTab'
import { TaphonomyTab } from '../Locality/Tabs/TaphonomyTab'
import { EditDataType, LocalityDetailsType } from '@/backendTypes'
import { validateLocality } from '@/validators/locality'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { emptyLocality } from '../DetailView/common/defaultValues'
import { useNotify } from '@/hooks/notification'
import { useEffect } from 'react'

export const LocalityDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [editLocalityRequest, { isLoading: mutationLoading }] = useEditLocalityMutation()
  const { isFetching, isError, data } = useGetLocalityDetailsQuery(id!, {
    skip: isNew,
  })
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

  const deleteFunction = async () => {
    await deleteMutation(parseInt(id!)).unwrap()
  }

  const onWrite = async (editData: EditDataType<LocalityDetailsType>) => {
    const { id } = await editLocalityRequest(editData).unwrap()
    navigate(`/locality/${id}`)
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
