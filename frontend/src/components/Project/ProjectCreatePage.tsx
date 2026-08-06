import { CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PermissionDenied } from '@/components/PermissionDenied'
import { ProjectForm, type ProjectFormValues } from '@/components/Project/ProjectForm'
import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { useNotify } from '@/hooks/notification'
import { useUsersApi } from '@/hooks/useUsersApi'
import { useUser } from '@/hooks/user'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import { useEditProjectMutation } from '@/redux/projectReducer'
import { Role, ValidationErrors } from '@/shared/types'

export const ProjectCreatePage = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { users, isLoading: personsLoading, isError: personsError } = useUsersApi()
  const { data: personQueryData, isLoading: personQueryIsLoading } = useGetAllPersonsQuery()
  const [editProject] = useEditProjectMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'New project'
  }, [])

  if (personQueryIsLoading) {
    return <CircularProgress />
  }

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

    const coordinator = users.find(user => user.userId === values.coordinatorUserId!)
    if (coordinator === undefined) {
      setSubmitError('Selected coordinator is not a valid user')
    }

    const filteredPersons = personQueryData!.filter(
      person => person.user && values.memberUserIds.includes(person.user.user_id)
    )
    const nowProjPeople = filteredPersons.map(person => {
      return {
        initials: person.initials,
        com_people: person,
      }
    })

    try {
      const createdProject = await editProject({
        proj_code: values.projectCode.trim(),
        proj_name: values.projectName.trim(),
        contact: coordinator!.initials,
        proj_status: values.projectStatus,
        proj_records: values.recordStatus as boolean,
        now_proj_people: nowProjPeople,
      }).unwrap()

      notify('Project created successfully.')
      navigate(`/project/${createdProject.pid}`)
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  return (
    <UnsavedChangesProvider>
      <Stack spacing={3} sx={{ maxWidth: 900, margin: '0 auto' }}>
        <Typography variant="h4" component="h1">
          Create Project
        </Typography>
        <Typography color="text.secondary">
          Provide project information and choose the coordinator and members from existing users.
        </Typography>

        <ProjectForm users={users} onSubmit={handleSubmit} serverError={submitError} submitLabel="Create Project" />
      </Stack>
    </UnsavedChangesProvider>
  )
}

export default ProjectCreatePage
