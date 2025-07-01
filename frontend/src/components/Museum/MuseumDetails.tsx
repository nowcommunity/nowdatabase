import { useGetMuseumDetailsQuery } from '../../redux/museumReducer'
import { DetailView, TabType } from '../DetailView/DetailView'
import { MuseumInfoTab } from './Tabs/MuseumInfoTab'
import { emptyMuseum } from '../DetailView/common/defaultValues'
import { validateMuseum } from '@/shared/validators/museum'
import { useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { Museum } from '@/shared/types'
import { LocalityTab } from './Tabs/LocalityTab'

export const MuseumDetails = () => {
  const { id } = useParams()
  const { isError, isFetching, data } = useGetMuseumDetailsQuery(id!)

  const tabs: TabType[] = [
    {
      title: 'Museum',
      content: <MuseumInfoTab />,
    },
    {
      title: 'Localities',
      content: <LocalityTab />,
    },
  ]

  if (isError) return <div>Error loading data</div>
  if (isFetching || !data) return <CircularProgress />
  if (data) {
    document.title = `Museum - ${data.institution}`
  }

  return (
    <DetailView<Museum>
      tabs={tabs}
      data={!data ? emptyMuseum : data}
      onWrite={undefined}
      isNew={false}
      validator={validateMuseum}
      deleteFunction={undefined}
      hasStagingMode
    />
  )
}
