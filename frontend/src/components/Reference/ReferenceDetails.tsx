import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { ReferenceTab } from './Tabs/ReferenceTab'
import {
  useEditReferenceMutation,
  useGetReferenceDetailsQuery,
  useDeleteReferenceMutation,
} from '@/redux/referenceReducer'
import { EditDataType, ReferenceDetailsType, ValidationErrors } from '@/backendTypes'
import { emptyReference } from '../DetailView/common/defaultValues'
import { validateReference } from '@/validators/reference'
import { useNotify } from '@/hooks/notification'
import { useEffect } from 'react'

export const ReferenceDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New reference'
  }
  const { isFetching, isError, data } = useGetReferenceDetailsQuery(id!, { skip: isNew })
  const [editReferenceRequest, { isLoading: mutationLoading }] = useEditReferenceMutation()
  const [deleteMutation, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteReferenceMutation()
  const notify = useNotify()
  const navigate = useNavigate()

  useEffect(() => {
    if (deleteSuccess) {
      notify('Deleted item successfully.')
      navigate('/reference')
    } else if (deleteError) {
      notify('Could not delete item. Error happened.', 'error')
    }
  }, [deleteSuccess, deleteError, notify, navigate])

  if (isError) return <div>Error loading data</div>
  if (isFetching || (!data && !isNew) || mutationLoading) return <CircularProgress />

  const onWrite = async (editData: EditDataType<ReferenceDetailsType>) => {
    try {
      const { rid } = await editReferenceRequest(editData).unwrap()
      notify('Saved reference successfully.')
      setTimeout(() => navigate(`/reference/${rid}`), 15)
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  const deleteFunction = async () => {
    await deleteMutation(parseInt(id!)).unwrap()
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
      deleteFunction={deleteFunction}
    />
  )
}
