import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircularProgress, Stack, Typography } from '@mui/material'

import { PermissionDenied } from '@/components/PermissionDenied'
import { ProjectForm, ProjectFormValues } from '@/components/Project/ProjectForm'
import { useUser } from '@/hooks/user'
import { useNotify } from '@/hooks/notification'
import { useUsersApi } from '@/hooks/useUsersApi'
import { Role } from '@/shared/types'
import { useProjectsApi } from '@/hooks/useProjectsApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const ProjectNewPage = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { users, isLoading: personsLoading, isError: personsError } = useUsersApi()
  const { createProject, isSubmitting } = useProjectsApi()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'New project'
  }, [])

  const userOptions = useMemo(() => users, [users])

  if (!user.token) {
    return (
      <PermissionDenied
        title="Sign in to create a project"
        message="You must be signed in as an administrator to add a project."
        actionHref="/login"
        actionLabel="Go to sign in"
      />
    )
  }

  if (user.role !== Role.Admin) {
    return (
      <PermissionDenied
        title="You do not have access to create projects"
        message="Only administrators can create new projects."
      />
    )
  }

  if (personsLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <CircularProgress />
        <Typography>Loading people...</Typography>
      </Stack>
    )
  }

  if (personsError) {
    return (
      <PermissionDenied
        title="Unable to load people"
        message="We could not load users to assign as coordinator or members. Please try again later."
      />
    )
  }

  const handleSubmit = async (values: ProjectFormValues) => {
    setSubmitError(null)
    try {
      const createdProject = await createProject({
        projectCode: values.projectCode.trim(),
        projectName: values.projectName.trim(),
        coordinatorUserId: values.coordinatorUserId!,
        projectStatus: values.projectStatus,
        recordStatus: values.recordStatus as boolean,
        memberUserIds: values.memberUserIds.length ? values.memberUserIds : undefined,
      }).unwrap()

      notify('Project created successfully.')
      navigate(`/project/${createdProject.pid}`)
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
          : 'Failed to create project.'
      setSubmitError(message)
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" component="h1">
        Create Project
      </Typography>
      <Typography color="text.secondary">
        Provide project information and choose the coordinator and members from existing users.
      </Typography>

      <ProjectForm users={userOptions} onSubmit={handleSubmit} isSubmitting={isSubmitting} serverError={submitError} />
    </Stack>
  )
}

export default ProjectNewPage
