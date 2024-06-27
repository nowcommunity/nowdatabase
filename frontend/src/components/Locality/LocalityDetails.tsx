import { useParams } from 'react-router-dom'
import { useEditLocalityMutation, useGetLocalityDetailsQuery } from '../../redux/localityReducer'
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
import { EditDataType, LocalityDetailsType } from '@/backendTypes'
import { validateLocality } from '@/validators/locality'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { emptyLocality } from '../DetailView/common/defaultValues'

export const LocalityDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  const { isLoading, isFetching, isError, data } = useGetLocalityDetailsQuery(id!, { skip: isNew })
  const [editLocalityRequest] = useEditLocalityMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />

  const onWrite = async (editData: EditDataType<LocalityDetailsType>) => {
    await editLocalityRequest(editData)
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
    />
  )
}
