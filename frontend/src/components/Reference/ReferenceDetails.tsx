import { useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { ReferenceTab } from './Tabs/ReferenceTab'
import { useGetReferenceDetailsQuery } from '@/redux/referenceReducer'

export const ReferenceDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetReferenceDetailsQuery(id!)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Reference',
      content: <ReferenceTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} onWrite={() => {}} validator={() => ({ name: '', error: null })} />
}
