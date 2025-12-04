import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'
import { useDeleteProjectMutation, useGetProjectDetailsQuery, useUpdateProjectMutation } from '@/redux/projectReducer'
import { useNotify } from '@/hooks/notification'
import { useUsersApi } from '@/hooks/useUsersApi'
import { mapProjectEditDataToUpdatePayload } from '@/api/projectsApi'
import type { EditDataType, ProjectDetailsType } from '@/shared/types'
import type { ValidationObject } from '@/shared/validators/validator'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const ProjectDetails = () => {
  const { id } = useParams()
  const projectId = useMemo(() => (id ? parseInt(id) : null), [id])
  const { isLoading, isError, data } = useGetProjectDetailsQuery(id!, { skip: !projectId })
  const { users, isLoading: isUsersLoading, isError: isUsersError } = useUsersApi()
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
  const { notify } = useNotify()
  const navigate = useNavigate()

  if (isError || isUsersError) return <div>Error loading data</div>
  if (isLoading || !data || isDeleting || isUsersLoading || isUpdating) return <CircularProgress />
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

  const validator = (
    _editData: EditDataType<ProjectDetailsType>,
    field: keyof EditDataType<ProjectDetailsType>
  ): ValidationObject => ({
    name: String(field),
    error: null,
  })

  const onWrite = async (editData: EditDataType<ProjectDetailsType>) => {
    if (!projectId) return
    const payload = mapProjectEditDataToUpdatePayload(editData, users)

    if (!payload) {
      notify('Coordinator selection is required to save project changes.', 'error')
      return
    }

    try {
      await updateProject(payload).unwrap()
      notify('Saved project successfully.')
    } catch (error) {
      const fetchError = error as FetchBaseQueryError
      const message =
        fetchError &&
        typeof fetchError === 'object' &&
        'data' in fetchError &&
        fetchError.data &&
        typeof fetchError.data === 'object' &&
        'error' in fetchError.data &&
        typeof fetchError.data.error === 'string'
          ? fetchError.data.error
          : 'Could not save project.'
      notify(message, 'error')
    }
  }

  return <DetailView tabs={tabs} data={data} validator={validator} deleteFunction={deleteFunction} onWrite={onWrite} />
}
