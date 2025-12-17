import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, CircularProgress, Stack, Typography } from '@mui/material'

import { PermissionDenied } from '@/components/PermissionDenied'
import { ProjectForm, type ProjectFormValues } from '@/components/Project/ProjectForm'
import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { useNotify } from '@/hooks/notification'
import { useProject } from '@/hooks/useProject'
import { useUser } from '@/hooks/user'
import { useUpdateProjectMutation } from '@/redux/projectReducer'
import { Role } from '@/shared/types'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const ProjectEditPage = () => {
  const { id } = useParams()
  const projectId = id ? Number(id) : null
  const user = useUser()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { project, initialValues, users, isLoading, isError, refetch } = useProject(projectId)
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      document.title = `Edit project - ${project.proj_name ?? project.pid}`
    }
  }, [project])

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

  if (isLoading || !initialValues) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <CircularProgress />
        <Typography>Loading project...</Typography>
      </Stack>
    )
  }

  if (isError || !project || !initialValues) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <PermissionDenied
          title="Unable to load project"
          message="We could not load the project or people data. Please try again later."
        />
        <Button
          variant="contained"
          onClick={() => {
            void refetch()
          }}
        >
          Retry
        </Button>
      </Stack>
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
    <UnsavedChangesProvider>
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
    </UnsavedChangesProvider>
  )
}

export default ProjectEditPage
