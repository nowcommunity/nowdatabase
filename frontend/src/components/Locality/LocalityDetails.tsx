import { useParams } from 'react-router-dom'
import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { AgeTab } from './Tabs/AgeTab'
import { LocalityTab } from './Tabs/LocalityTab'
import { MuseumTab } from './Tabs/MuseumTab'

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
      title: 'Museum',
      content: <MuseumTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} />
}
