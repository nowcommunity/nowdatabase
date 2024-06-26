import { useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { ReferenceTab } from './Tabs/ReferenceTab'
import { useEditReferenceMutation, useGetReferenceDetailsQuery } from '@/redux/referenceReducer'
import { EditDataType, ReferenceDetailsType } from '@/backendTypes'

export const ReferenceDetails = () => {
  const { id } = useParams()
  const { isLoading, isFetching, isError, data } = useGetReferenceDetailsQuery(id!)
  const [editReferenceMutation] = useEditReferenceMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || !data) return <CircularProgress />

  const onWrite = async (editedReference: EditDataType<ReferenceDetailsType>) => {
    await editReferenceMutation(editedReference)
  }

  const tabs: TabType[] = [
    {
      title: 'Reference',
      content: <ReferenceTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} onWrite={onWrite} validator={() => ({ name: '', error: null })} />
}
