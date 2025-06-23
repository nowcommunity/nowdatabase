import { useGetMuseumDetailsQuery } from '../../redux/museumReducer'
import { DetailView, TabType } from '../DetailView/DetailView'
import { MuseumInfoTab } from '../Locality/Tabs/MuseumInfoTab'
import { emptyMuseum } from '../DetailView/common/defaultValues'
import { validateMuseum } from '@/shared/validators/museum'
import { useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

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
      content: <>localities tab</>,
    },
  ]

  if (isError) return <div>Error loading data</div>
  if (isFetching || !data) return <CircularProgress />
  if (data) {
    document.title = `Museum - ${data.institution}`
  }

  return (
    <DetailView
      tabs={tabs}
      data={!data ? emptyMuseum : data}
      onWrite={undefined}
      isNew={false}
      hasStagingMode={false}
      validator={validateMuseum}
      deleteFunction={undefined}
    />
  )
}
