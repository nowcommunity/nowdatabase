import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CircularProgress, Stack, Typography } from '@mui/material'

import { PermissionDenied } from '@/components/PermissionDenied'
import { ProjectForm, ProjectFormValues } from '@/components/Project/ProjectForm'
import { useUser } from '@/hooks/user'
import { useNotify } from '@/hooks/notification'
import { useUsersApi } from '@/hooks/useUsersApi'
import { Role } from '@/shared/types'
import { useGetProjectDetailsQuery, useUpdateProjectMutation } from '@/redux/projectReducer'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const ProjectEditPage = () => {
  const { id } = useParams()
  const projectId = id ? Number(id) : null
  const user = useUser()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { users, isLoading: personsLoading, isError: personsError } = useUsersApi()
  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useGetProjectDetailsQuery(id ?? '', { skip: !projectId })
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      document.title = `Edit project - ${project.proj_name ?? project.pid}`
    }
  }, [project])

  const initialValues = useMemo(() => {
    if (!project) {
      return {
        projectCode: '',
        projectName: '',
        coordinatorUserId: null,
        projectStatus: '',
        recordStatus: '' as const,
        memberUserIds: [] as number[],
      }
    }

    const coordinatorOption = users.find(option => option.initials === project.contact)
    const memberIds = project.now_proj_people
      .map(member => users.find(option => option.initials === member.initials)?.userId)
      .filter((id): id is number => typeof id === 'number')

    return {
      projectCode: project.proj_code ?? '',
      projectName: project.proj_name ?? '',
      coordinatorUserId: coordinatorOption?.userId ?? null,
      projectStatus: project.proj_status ?? '',
      recordStatus: project.proj_records ?? ('' as const),
      memberUserIds: memberIds,
    }
  }, [project, users])

  if (!user.token) {
    return (
      <PermissionDenied
        title="Sign in to edit a project"
        message="You must be signed in as an administrator to edit a project."
        actionHref="/login"
        actionLabel="Go to sign in"
      />
    )
  }

  if (user.role !== Role.Admin) {
    return (
      <PermissionDenied
        title="You do not have access to edit projects"
        message="Only administrators can edit projects."
      />
    )
  }

  if (projectLoading || personsLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <CircularProgress />
        <Typography>Loading project...</Typography>
      </Stack>
    )
  }

  if (projectError || !project || personsError) {
    return (
      <PermissionDenied
        title="Unable to load project"
        message="We could not load the project or people data. Please try again later."
      />
    )
  }

  const handleSubmit = async (values: ProjectFormValues) => {
    if (!projectId) return
    setSubmitError(null)

    try {
      await updateProject({
        pid: projectId,
        projectCode: values.projectCode.trim(),
        projectName: values.projectName.trim(),
        coordinatorUserId: values.coordinatorUserId!,
        projectStatus: values.projectStatus,
        recordStatus: values.recordStatus as boolean,
        memberUserIds: values.memberUserIds.length ? values.memberUserIds : undefined,
      }).unwrap()

      notify('Project updated successfully.')
      navigate(`/project/${projectId}`)
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
          : 'Failed to update project.'
      setSubmitError(message)
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" component="h1">
        Edit Project
      </Typography>
      <Typography color="text.secondary">Update project information, coordinator, and members.</Typography>

      <ProjectForm
        users={users}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        serverError={submitError}
        initialValues={initialValues}
        submitLabel="Save Changes"
      />
    </Stack>
  )
}

export default ProjectEditPage
