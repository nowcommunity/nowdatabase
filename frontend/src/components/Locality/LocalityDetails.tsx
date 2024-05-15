import { useParams } from 'react-router-dom'
import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { AgeTab } from './Tabs/AgeTab'
import { ClimateTab } from './Tabs/ClimateTab'
import { EcometricsTab } from './Tabs/EcometricsTab'
import { LithologyTab } from './Tabs/LithologyTab'
import { LocalityTab } from './Tabs/LocalityTab'
import { MuseumTab } from './Tabs/MuseumTab'
import { ProjectTab } from './Tabs/ProjectTab'
import { SpeciesTab } from './Tabs/SpeciesTab'
import { TaphonomyTab } from './Tabs/TaphonomyTab'
import { UpdateTab } from './Tabs/UpdateTab'

export const LocalityDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetLocalityDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

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
      title: 'Museum',
      content: <MuseumTab />,
    },
    {
      title: 'Projects',
      content: <ProjectTab />,
    },
    {
      title: 'Updates',
      content: <UpdateTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} />
}
