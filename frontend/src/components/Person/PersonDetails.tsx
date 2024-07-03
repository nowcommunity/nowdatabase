import { useParams } from 'react-router-dom'
import { useGetPersonDetailsQuery } from '../../redux/personReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { PersonTab } from './Tabs/PersonTab'
import { UserTab } from './Tabs/UserTab'

export const PersonDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetPersonDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Person',
      content: <PersonTab />,
    },
  ]

  if (data.user) tabs.push({ title: 'User', content: <UserTab /> })

  return <DetailView tabs={tabs} data={data} validator={() => ({ name: '', error: null })} />
}
