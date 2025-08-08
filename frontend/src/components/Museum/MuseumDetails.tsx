import { useEditMuseumMutation, useGetMuseumDetailsQuery } from '../../redux/museumReducer'
import { DetailView, TabType } from '../DetailView/DetailView'
import { MuseumInfoTab } from './Tabs/MuseumInfoTab'
import { emptyMuseum } from '../DetailView/common/defaultValues'
import { validateMuseum } from '@/shared/validators/museum'
import { useNavigate, useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { Museum, EditDataType, ValidationErrors } from '@/shared/types'
import { LocalityTab } from './Tabs/LocalityTab'
import { useNotify } from '@/hooks/notification'

export const MuseumDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  const { isError, isFetching, data } = useGetMuseumDetailsQuery(id!, {
    skip: isNew,
  })
  const [editMuseumRequest, { isLoading: mutationLoading }] = useEditMuseumMutation()
  const notify = useNotify()
  const navigate = useNavigate()

  const tabs: TabType[] = [
    {
      title: 'Museum',
      content: <MuseumInfoTab isNew={isNew} />,
    },
    {
      title: 'Localities',
      content: <LocalityTab isNew={isNew} />,
    },
  ]

  if (isError) return <div>Error loading data</div>
  if (isFetching || (!data && !isNew) || mutationLoading) return <CircularProgress />
  if (data) {
    document.title = `Museum - ${data.institution}`
  }

  const onWrite = async (editData: EditDataType<Museum>) => {
    try {
      const { museum } = await editMuseumRequest(editData).unwrap()
      notify('Saved region successfully.')
      setTimeout(() => navigate(`/museum/${museum}`), 15)
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  return (
    <DetailView<Museum>
      tabs={tabs}
      data={isNew ? emptyMuseum : data!}
      onWrite={onWrite}
      isNew={isNew}
      validator={validateMuseum}
      deleteFunction={undefined}
      hasStagingMode
    />
  )
}
