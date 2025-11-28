import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircularProgress, Stack, Typography } from '@mui/material'

import { PermissionDenied } from '@/components/PermissionDenied'
import { ProjectForm, ProjectFormValues, UserOption } from '@/components/Project/ProjectForm'
import { useUser } from '@/hooks/user'
import { useNotify } from '@/hooks/notification'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import { Role, type PersonDetailsType } from '@/shared/types'
import { useProjectsApi } from '@/hooks/useProjectsApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type PersonWithUserId = PersonDetailsType & { user: NonNullable<PersonDetailsType['user']> & { user_id: number } }

const hasUserId = (person: PersonDetailsType): person is PersonWithUserId => typeof person.user?.user_id === 'number'

const formatUserLabel = ({
  surname,
  first_name,
  user,
}: {
  surname: string | null
  first_name: string | null
  user?: { user_name: string | null }
}) => {
  if (surname) {
    return `${surname}${first_name ? `, ${first_name}` : ''}`
  }

  if (user?.user_name) return user.user_name

  return 'Unknown user'
}

export const ProjectNewPage = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { data: persons, isLoading: personsLoading, isError: personsError } = useGetAllPersonsQuery()
  const { createProject, isSubmitting } = useProjectsApi()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'New project'
  }, [])

  const userOptions: UserOption[] = useMemo(() => {
    const personsWithUserIds: PersonWithUserId[] = (persons ?? []).filter(hasUserId)

    return personsWithUserIds
      .map(person => ({
        userId: person.user.user_id,
        label: formatUserLabel({ surname: person.surname, first_name: person.first_name, user: person.user }),
        initials: person.initials,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [persons])

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
        recordStatus: values.recordStatus === 'private',
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
