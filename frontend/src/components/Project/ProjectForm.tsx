import { useEffect, useMemo } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { recordStatusOptions, projectStatusOptions } from '@/constants/projectStatus'
import type { RecordStatusValue } from '@/constants/projectStatus'
import type { UserOption } from '@/hooks/useUsersApi'

export type ProjectFormValues = {
  projectCode: string
  projectName: string
  coordinatorUserId: number | null
  projectStatus: string
  recordStatus: RecordStatusValue | ''
  memberUserIds: number[]
}

export type ProjectFormProps = {
  users: UserOption[]
  onSubmit: (values: ProjectFormValues) => Promise<void>
  isSubmitting?: boolean
  serverError?: string | null
}

export const ProjectForm = ({ users, onSubmit, isSubmitting = false, serverError }: ProjectFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ProjectFormValues>({
    defaultValues: {
      projectCode: '',
      projectName: '',
      coordinatorUserId: null,
      projectStatus: '',
      recordStatus: '',
      memberUserIds: [],
    },
  })

  const coordinatorId = watch('coordinatorUserId')
  const memberUserIds = watch('memberUserIds')
  const filteredMembers = useMemo(() => users.filter(user => user.userId !== coordinatorId), [coordinatorId, users])
  const recordStatusError = typeof errors.recordStatus?.message === 'string' ? errors.recordStatus.message : undefined

  useEffect(() => {
    if (!coordinatorId) return
    if (!memberUserIds?.includes(coordinatorId)) return
    setValue(
      'memberUserIds',
      memberUserIds.filter(id => id !== coordinatorId)
    )
  }, [coordinatorId, memberUserIds, setValue])

  const submitHandler = handleSubmit(async values => {
    await onSubmit(values)
  })

  return (
    <Card
      component="form"
      onSubmit={event => {
        void submitHandler(event)
      }}
    >
      <CardContent>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h5">Project Information</Typography>
            <Divider />
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Project Code"
                fullWidth
                {...register('projectCode', { required: 'Project code is required' })}
                error={Boolean(errors.projectCode)}
                helperText={errors.projectCode?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Project Name"
                fullWidth
                {...register('projectName', { required: 'Project name is required' })}
                error={Boolean(errors.projectName)}
                helperText={errors.projectName?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="coordinatorUserId"
                rules={{ required: 'Coordinator is required' }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={users.find(user => user.userId === value) ?? null}
                    onChange={(_event, option) => onChange(option?.userId ?? null)}
                    options={users}
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Coordinator"
                        required
                        error={Boolean(errors.coordinatorUserId)}
                        helperText={errors.coordinatorUserId?.message}
                        disabled={isSubmitting}
                      />
                    )}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={Boolean(errors.projectStatus)} disabled={isSubmitting}>
                <InputLabel id="project-status-label">Project Status</InputLabel>
                <Controller
                  control={control}
                  name="projectStatus"
                  rules={{ required: 'Project status is required' }}
                  render={({ field }) => (
                    <Select {...field} labelId="project-status-label" label="Project Status" value={field.value ?? ''}>
                      {projectStatusOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.projectStatus?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={Boolean(errors.recordStatus)} disabled={isSubmitting}>
                <InputLabel id="record-status-label">Record Status</InputLabel>
                <Controller
                  control={control}
                  name="recordStatus"
                  rules={{ required: 'Record status is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="record-status-label"
                      label="Record Status"
                      value={field.value === '' ? '' : String(field.value)}
                      onChange={event => {
                        const rawValue = event.target.value
                        const mappedValue = rawValue === '' ? '' : rawValue === 'true'
                        field.onChange(mappedValue)
                      }}
                    >
                      {recordStatusOptions.map(option => (
                        <MenuItem key={option.label} value={String(option.value)}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{recordStatusError}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Stack spacing={1}>
            <Typography variant="h5">Project Members</Typography>
            <Divider />
          </Stack>

          <Controller
            control={control}
            name="memberUserIds"
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                multiple
                options={filteredMembers}
                value={filteredMembers.filter(option => value?.includes(option.userId))}
                onChange={(_event, newValue) => onChange(newValue.map(option => option.userId))}
                getOptionLabel={option => option.label}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const { key, ...chipProps } = getTagProps({ index })
                    return (
                      <Box component="span" key={key ?? option.userId} {...chipProps}>
                        {option.label}
                      </Box>
                    )
                  })
                }
                renderInput={params => (
                  <TextField {...params} label="Members" placeholder="Select project members" disabled={isSubmitting} />
                )}
                disabled={isSubmitting || !users.length}
              />
            )}
          />

          {serverError ? <Alert severity="error">{serverError}</Alert> : null}

          <Box display="flex" justifyContent="flex-end" gap={2} alignItems="center">
            {isSubmitting && <CircularProgress size={24} />}
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              Create Project
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProjectForm
