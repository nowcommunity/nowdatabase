import { useParams } from 'react-router-dom'
import { useGetSpeciesDetailsQuery } from '../../redux/speciesReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { DietTab } from './Tabs/DietTab'
import { LocomotionTab } from './Tabs/LocomotionTab'
import { SizeTab } from './Tabs/SizeTab'
import { TaxonomyTab } from './Tabs/TaxonomyTab'
import { TeethTab } from './Tabs/TeethTab'
import { UpdateTab } from './Tabs/UpdateTab'

export const SpeciesDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetSpeciesDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Taxonomy',
      content: <TaxonomyTab />,
    },
    {
      title: 'Diet',
      content: <DietTab />,
    },
    {
      title: 'Locomotion',
      content: <LocomotionTab />,
    },
    {
      title: 'Size',
      content: <SizeTab />,
    },
    {
      title: 'Teeth',
      content: <TeethTab />,
    },
    {
      title: 'Updates',
      content: <UpdateTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} />
}
