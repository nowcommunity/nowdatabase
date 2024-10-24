import { useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { ReferenceTab } from './Tabs/ReferenceTab'
import { useEditReferenceMutation, useGetReferenceDetailsQuery } from '@/redux/referenceReducer'
import { EditDataType, ReferenceDetailsType } from '@/backendTypes'
import { emptyReference } from '../DetailView/common/defaultValues'
import { validateReference } from '@/validators/reference'

export const ReferenceDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New reference'
  }
  const { isLoading, isFetching, isError, data } = useGetReferenceDetailsQuery(id!, { skip: isNew })
  const [editReferenceMutation] = useEditReferenceMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />

  const onWrite = async (editedReference: EditDataType<ReferenceDetailsType>) => {
    await editReferenceMutation(editedReference)
  }

  const tabs: TabType[] = [
    {
      title: 'Reference',
      content: <ReferenceTab />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      isNew={isNew}
      data={isNew ? emptyReference : data!}
      onWrite={onWrite}
      validator={validateReference}
    />
  )
}
