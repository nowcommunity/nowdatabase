import { useMemo } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'

import { projectToFormValues } from '@/api/projectsApi'
import type { ProjectFormValues } from '@/components/Project/ProjectForm'
import { useGetProjectDetailsQuery } from '@/redux/projectsSlice'
import type { ProjectDetailsType } from '@/shared/types'
import { useUsersApi } from './useUsersApi'

type UseProjectResult = {
  project: ProjectDetailsType | undefined
  initialValues: ProjectFormValues | null
  users: ReturnType<typeof useUsersApi>['users']
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<unknown>
}

export const useProject = (id: string | number | null): UseProjectResult => {
  const projectId = id ? String(id) : null
  const projectQuery = useGetProjectDetailsQuery(projectId ?? skipToken)
  const usersQuery = useUsersApi()

  const initialValues = useMemo(() => {
    if (!projectQuery.data) return null
    if (!usersQuery.users.length) return null
    return projectToFormValues(projectQuery.data, usersQuery.users)
  }, [projectQuery.data, usersQuery.users])

  return {
    project: projectQuery.data,
    initialValues,
    users: usersQuery.users,
    isLoading: projectQuery.isLoading || usersQuery.isLoading,
    isError: projectQuery.isError || usersQuery.isError,
    refetch: projectQuery.refetch,
  }
}

export default useProject
