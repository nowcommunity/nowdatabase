import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useNotify } from '@/hooks/notification'
import { useUsersApi } from '@/hooks/useUsersApi'
import {
  UpdateProjectPayload,
  useDeleteProjectMutation,
  useGetProjectDetailsQuery,
  useUpdateProjectMutation,
} from '@/redux/projectReducer'
import { ProjectPeople, RowState } from '@/shared/types'
import { CircularProgress } from '@mui/material'

import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'

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

  const createProjectUpdatePayload = (editData: EditDataType<ProjectDetailsType>): UpdateProjectPayload | null => {
    const userOption = users.find(user => user.initials === editData.contact)
    if (!userOption) {
      notify('Could not find selected coordinator.', 'error')
      return null
    }

    const isRemoved = (member: EditDataType<ProjectPeople>) => {
      const state = (member as EditDataType<ProjectPeople> & { rowState?: RowState }).rowState
      return state === 'removed' || state === 'cancelled'
    }

    const memberUserIds = Array.from(
      new Set(
        (editData.now_proj_people ?? [])
          .filter(member => !isRemoved(member))
          .map(member => {
            const userIdFromPeople = (member.com_people as { user_id?: number } | undefined)?.user_id
            const userIdFromRelation = member.com_people?.user?.user_id
            if (typeof userIdFromPeople === 'number') return userIdFromPeople
            if (typeof userIdFromRelation === 'number') return userIdFromRelation
            return users.find(user => user.initials === member.initials) ?? null
          })
          .filter((id): id is number => typeof id === 'number')
      )
    )
    return {
      pid: editData.pid!,
      projectCode: editData.proj_code!,
      projectName: editData.proj_name!,
      coordinatorUserId: userOption.userId,
      projectStatus: editData.proj_status!,
      recordStatus: editData.proj_records!,
      memberUserIds,
    }
  }

  const onWrite = async (editData: EditDataType<ProjectDetailsType>) => {
    if (!projectId) return

    const payload = createProjectUpdatePayload(editData)
    if (!payload) {
      return
    }

    console.log(editData)
    console.log(payload)

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
