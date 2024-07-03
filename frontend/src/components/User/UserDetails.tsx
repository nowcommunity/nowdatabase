import { useParams } from 'react-router-dom'
import { useGetUserDetailsQuery } from '../../redux/userReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { UserTab } from './Tabs/UserTab'

export const UserDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetUserDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Person',
      content: <UserTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} validator={() => ({ name: '', error: null })} />
}
