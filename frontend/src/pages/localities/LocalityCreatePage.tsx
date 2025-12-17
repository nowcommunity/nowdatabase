import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Button, Stack, Typography } from '@mui/material'

import { LocalityForm, LocalityFormValues } from '@/components/Locality/LocalityForm'
import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { localityFormValuesToPayload } from '@/api/localitiesApi'
import { emptyLocality } from '@/components/DetailView/common/defaultValues'
import { useEditLocalityMutation } from '@/redux/localityReducer'
import { useNotify } from '@/hooks/notification'

export const LocalityCreatePage = () => {
  const { notify } = useNotify()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createLocality, { isLoading }] = useEditLocalityMutation()

  useEffect(() => {
    document.title = 'Create locality'
  }, [])

  const handleSubmit = async (values: LocalityFormValues) => {
    setSubmitError(null)
    try {
      const payload = localityFormValuesToPayload(values, { ...emptyLocality })
      const response = await createLocality(payload).unwrap()
      const newId = (response as { id?: number } | undefined)?.id
      notify('Locality created successfully.')
      navigate(newId ? `/locality/${newId}` : '/locality')
    } catch (error) {
      setSubmitError('Failed to create locality.')
      throw error
    }
  }

  return (
    <UnsavedChangesProvider>
      <Stack spacing={3} sx={{ maxWidth: 960, margin: '0 auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h4" component="h1">
              Create locality
            </Typography>
            <Typography color="text.secondary">Enter the basic information needed to add a new locality.</Typography>
          </Stack>
          <Button component={RouterLink} to="/locality" variant="text">
            Back to localities
          </Button>
        </Stack>

        <LocalityForm
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          serverError={submitError}
          submitLabel="Create locality"
        />
      </Stack>
    </UnsavedChangesProvider>
  )
}

export default LocalityCreatePage
