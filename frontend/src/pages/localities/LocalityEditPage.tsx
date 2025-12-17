import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { Button, CircularProgress, Stack, Typography } from '@mui/material'

import { LocalityForm, LocalityFormValues } from '@/components/Locality/LocalityForm'
import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { localityDetailsToFormValues, localityFormValuesToPayload } from '@/api/localitiesApi'
import { useGetLocalityDetailsQuery, useEditLocalityMutation } from '@/redux/localityReducer'
import { useNotify } from '@/hooks/notification'

export const LocalityEditPage = () => {
  const { id } = useParams()
  const localityId = id ? Number(id) : null
  const navigate = useNavigate()
  const { notify } = useNotify()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [updateLocality, { isLoading: isUpdating }] = useEditLocalityMutation()

  const { data, isFetching, isError, refetch } = useGetLocalityDetailsQuery(id ?? '', {
    skip: !id,
  })

  useEffect(() => {
    if (data?.loc_name) {
      document.title = `Edit locality - ${data.loc_name}`
    }
  }, [data])

  const initialValues = useMemo(() => (data ? localityDetailsToFormValues(data) : null), [data])

  const handleSubmit = async (values: LocalityFormValues) => {
    if (!data || !localityId) return
    setSubmitError(null)
    try {
      const payload = localityFormValuesToPayload(values, { ...data })
      await updateLocality(payload).unwrap()
      notify('Locality updated successfully.')
      navigate(`/locality/${localityId}`)
    } catch (error) {
      setSubmitError('Failed to update locality.')
      throw error
    }
  }

  if (!localityId) {
    return <Typography>Locality not found.</Typography>
  }

  if (isError || !data) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Typography>Unable to load locality.</Typography>
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

  if (isFetching || !initialValues) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <CircularProgress />
        <Typography>Loading locality...</Typography>
      </Stack>
    )
  }

  return (
    <UnsavedChangesProvider>
      <Stack spacing={3} sx={{ maxWidth: 960, margin: '0 auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h4" component="h1">
              Edit locality
            </Typography>
            <Typography color="text.secondary">
              Update the locality details and navigate away safely once you are done.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/locality" variant="text">
              Back to localities
            </Button>
            <Button component={RouterLink} to={`/locality/${localityId}`} variant="outlined">
              Return to locality
            </Button>
          </Stack>
        </Stack>

        <LocalityForm
          initialValues={initialValues ?? undefined}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          serverError={submitError}
          submitLabel="Save changes"
        />
      </Stack>
    </UnsavedChangesProvider>
  )
}

export default LocalityEditPage
