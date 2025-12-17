import { useEffect, useMemo } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import { useUnsavedChangesPrompt } from '@/hooks/useUnsavedChangesPrompt'

export type LocalityFormValues = {
  localityName: string
  country: string
  latitude: string
  longitude: string
  visibility: 'public' | 'private'
}

type LocalityFormProps = {
  onSubmit: (values: LocalityFormValues) => Promise<void>
  initialValues?: Partial<LocalityFormValues>
  isSubmitting?: boolean
  serverError?: string | null
  submitLabel?: string
}

const normalizeValue = (value: string | undefined) => value ?? ''

export const LocalityForm = ({
  onSubmit,
  initialValues,
  isSubmitting = false,
  serverError,
  submitLabel = 'Save locality',
}: LocalityFormProps) => {
  const defaultValues = useMemo<LocalityFormValues>(
    () => ({
      localityName: normalizeValue(initialValues?.localityName),
      country: normalizeValue(initialValues?.country),
      latitude: normalizeValue(initialValues?.latitude),
      longitude: normalizeValue(initialValues?.longitude),
      visibility: initialValues?.visibility ?? 'public',
    }),
    [initialValues]
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<LocalityFormValues>({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const { setDirty } = useUnsavedChangesPrompt(isDirty)

  const submitHandler = handleSubmit(async values => {
    try {
      setDirty(false)
      await onSubmit({
        ...values,
        localityName: values.localityName.trim(),
        country: values.country.trim(),
        latitude: values.latitude.trim(),
        longitude: values.longitude.trim(),
      })
      setDirty(false)
    } catch (error) {
      setDirty(true)
    }
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
            <Typography variant="h5">Locality information</Typography>
            <Divider />
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Locality Name"
                fullWidth
                {...register('localityName', { required: 'Locality name is required' })}
                error={Boolean(errors.localityName)}
                helperText={errors.localityName?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Country"
                fullWidth
                {...register('country', { required: 'Country is required' })}
                error={Boolean(errors.country)}
                helperText={errors.country?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Latitude (decimal degrees)"
                fullWidth
                type="number"
                inputProps={{ step: 'any' }}
                {...register('latitude')}
                error={Boolean(errors.latitude)}
                helperText={errors.latitude?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Longitude (decimal degrees)"
                fullWidth
                type="number"
                inputProps={{ step: 'any' }}
                {...register('longitude')}
                error={Boolean(errors.longitude)}
                helperText={errors.longitude?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" disabled={isSubmitting}>
                <FormLabel component="legend">Visibility</FormLabel>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="public" control={<Radio />} label="Public" />
                      <FormControlLabel value="private" control={<Radio />} label="Private" />
                    </RadioGroup>
                  )}
                />
                <FormHelperText>
                  Choose whether this locality should be visible to all users or restricted.
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {serverError ? <Alert severity="error">{serverError}</Alert> : null}

          <Box display="flex" justifyContent="flex-end" gap={2} alignItems="center">
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default LocalityForm
