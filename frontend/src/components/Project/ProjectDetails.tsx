import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'
import { useDeleteProjectMutation, useGetProjectDetailsQuery } from '@/redux/projectReducer'
import { useNotify } from '@/hooks/notification'

export const ProjectDetails = () => {
  const { id } = useParams()
  const projectId = useMemo(() => (id ? parseInt(id) : null), [id])
  const { isLoading, isError, data } = useGetProjectDetailsQuery(id!, { skip: !projectId })
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation()
  const { notify } = useNotify()
  const navigate = useNavigate()

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data || isDeleting) return <CircularProgress />
  if (data) {
    document.title = `Project - ${data.proj_name}`
  }

  const deleteFunction = async () => {
    if (!projectId) return

    try {
      await deleteProject(projectId).unwrap()
      notify('Deleted project successfully.')
      navigate('/project')
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error ? (error as { message: string }).message : undefined
      notify(message ?? 'Could not delete project.', 'error')
    }
  }

  const tabs: TabType[] = [
    {
      title: 'Project',
      content: <CoordinatorTab />,
    },
  ]

  return (
    <DetailView tabs={tabs} data={data} validator={() => ({ name: '', error: null })} deleteFunction={deleteFunction} />
  )
}
