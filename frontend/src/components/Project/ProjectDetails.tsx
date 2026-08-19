import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useNotify } from '@/hooks/notification'
import { useDeleteProjectMutation, useEditProjectMutation, useGetProjectDetailsQuery } from '@/redux/projectReducer'
import { validateProject, validateProjectFields } from '@/shared/validators/project'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'

import type { EditDataType, ProjectDetailsType } from '@/shared/types'
import { ValidationErrors } from '@/shared/types'

export const ProjectDetails = () => {
  const { id } = useParams()
  const projectId = useMemo(() => (id ? parseInt(id) : null), [id])
  const { isLoading, isError, error, data } = useGetProjectDetailsQuery(id!, { skip: !projectId })
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation()
  const [editProject, { isLoading: isUpdating }] = useEditProjectMutation()
  const { notify } = useNotify()
  const navigate = useNavigate()

  if (isError) {
    if ('status' in error && error.status === 403) {
      return <div>Your user is not authorized to view this page.</div>
    }
    return <div>Error loading data</div>
  }
  if (isLoading || !data || isDeleting || isUpdating) return <CircularProgress />
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

  const onWrite = async (editData: EditDataType<ProjectDetailsType>) => {
    if (!projectId) return

    try {
      await editProject(editData).unwrap()
      notify('Saved project successfully.')
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  return (
    <DetailView
      tabs={tabs}
      data={data}
      validator={validateProject}
      validateFields={validateProjectFields}
      deleteFunction={deleteFunction}
      onWrite={onWrite}
    />
  )
}
