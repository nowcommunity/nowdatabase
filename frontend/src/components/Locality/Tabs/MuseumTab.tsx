import { Editable, LocalityDetailsType, Museum, ValidationErrors } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useEditMuseumMutation, useGetAllMuseumsQuery } from '@/redux/museumReducer'
import { Box, MenuItem, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { skipToken } from '@reduxjs/toolkit/query'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { useForm } from 'react-hook-form'
import { useNotify } from '@/hooks/notification'
import { validCountries } from '@/shared/validators/countryList'

export const MuseumTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const {
    data: museumData,
    isError,
    refetch: refetchMuseums,
  } = useGetAllMuseumsQuery(mode.read ? skipToken : undefined)
  const [editMuseumRequest, { isLoading: isSavingMuseum }] = useEditMuseumMutation()
  const { notify } = useNotify()

  type CreateMuseumForm = {
    institution: string
    alt_int_name?: string
    city: string
    country: string
    state?: string
    state_code?: string
    museum: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMuseumForm>({
    mode: 'onSubmit',
    defaultValues: {
      institution: '',
      alt_int_name: '',
      city: '',
      country: '',
      state: '',
      state_code: '',
      museum: '',
    },
  })

  const columns: MRT_ColumnDef<Museum>[] = [
    {
      accessorKey: 'museum',
      header: 'Museum code',
    },
    {
      accessorKey: 'institution',
      header: 'Institution',
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ]

  const onCreateMuseumSave = async () => {
    let shouldClose = false

    await handleSubmit(
      async values => {
        const normalized: CreateMuseumForm = {
          institution: values.institution.trim(),
          alt_int_name: values.alt_int_name?.trim() ?? '',
          city: values.city.trim(),
          country: values.country.trim(),
          state: values.state?.trim() ?? '',
          state_code: values.state_code?.trim() ?? '',
          museum: values.museum.trim(),
        }

        try {
          const { museum: museumId } = await editMuseumRequest({
            ...normalized,
            alt_int_name: normalized.alt_int_name || null,
            state: normalized.state || null,
            state_code: normalized.state_code || null,
          } as Museum).unwrap()

          const refetchResult = await refetchMuseums()
          const refreshedMuseums = refetchResult.data ?? museumData ?? []
          const resolvedMuseum =
            refreshedMuseums.find(museum => museum.museum === museumId) ??
            ({
              ...normalized,
              museum: museumId,
              alt_int_name: normalized.alt_int_name || null,
              state: normalized.state || null,
              state_code: normalized.state_code || null,
            } as Museum)

          if (editData.now_mus.some(link => link.museum === museumId)) {
            notify('Museum already linked to this locality.', 'warning')
            shouldClose = true
            return
          }

          setEditData({
            ...editData,
            now_mus: [
              ...editData.now_mus,
              { lid: editData.lid, museum: museumId, com_mlist: resolvedMuseum, rowState: 'new' },
            ],
          })
          reset()
          notify('Museum created and linked to locality.', 'success')
          shouldClose = true
        } catch (error) {
          const validationError = error as ValidationErrors
          if (validationError?.data?.length) {
            notify('Following validators failed: ' + validationError.data.map(e => e.name).join(', '), 'error')
          } else {
            notify('Failed to create museum.', 'error')
          }
          shouldClose = false
        }
      },
      submissionErrors => {
        const firstError = Object.values(submissionErrors)[0]
        if (firstError?.message) notify(firstError.message, 'error')
        shouldClose = false
      }
    )()

    return shouldClose
  }

  const createMuseumModal = (
    <EditingModal buttonText="Create Museum" onSave={onCreateMuseumSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField
          {...register('institution', { required: 'Institution is required' })}
          label="Institution"
          required
          error={Boolean(errors.institution)}
          helperText={errors.institution?.message}
        />
        <TextField
          {...register('alt_int_name')}
          label="Alt. name"
          error={Boolean(errors.alt_int_name)}
          helperText={errors.alt_int_name?.message}
        />
        <TextField
          {...register('city', { required: 'City is required' })}
          label="City"
          required
          error={Boolean(errors.city)}
          helperText={errors.city?.message}
        />
        <TextField
          select
          label="Country"
          id="create-museum-country"
          defaultValue=""
          {...register('country', { required: 'Country is required' })}
          error={Boolean(errors.country)}
          helperText={errors.country?.message}
        >
          {['', ...validCountries].map(country => (
            <MenuItem key={country} value={country}>
              {country || 'Select country'}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          {...register('state')}
          label="State"
          error={Boolean(errors.state)}
          helperText={errors.state?.message}
        />
        <TextField
          {...register('state_code', {
            validate: value => {
              if (!value) return true
              return value.length <= 5 || 'State code must contain a maximum of 5 characters'
            },
          })}
          label="State code"
          error={Boolean(errors.state_code)}
          helperText={errors.state_code?.message}
        />
        <TextField
          {...register('museum', {
            required: 'Museum code is required',
            validate: value => (value.includes(' ') ? 'Museum code must not contain a space' : true),
          })}
          label="Museum code"
          required
          error={Boolean(errors.museum)}
          helperText={errors.museum?.message}
        />
      </Box>
    </EditingModal>
  )

  return (
    <Grouped title="Museums">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <SelectingTable<Museum, LocalityDetailsType>
            buttonText="Select Museum"
            data={museumData}
            title="Museums"
            isError={isError}
            columns={columns}
            fieldName="now_mus"
            idFieldName="museum"
            editingAction={(newMuseum: Museum) => {
              setEditData({
                ...editData,
                now_mus: [
                  ...editData.now_mus,
                  { lid: editData.lid, museum: newMuseum.museum, com_mlist: newMuseum, rowState: 'new' },
                ],
              })
            }}
          />
          <Box display="flex" alignItems="center">
            <Box sx={{ opacity: isSavingMuseum ? 0.7 : 1 }}>{createMuseumModal}</Box>
          </Box>
        </Box>
      )}
      <EditableTable<Editable<Museum>, LocalityDetailsType>
        columns={columns.map(col => ({ ...col, accessorKey: `com_mlist.${col.accessorKey}` }))}
        field="now_mus"
        enableAdvancedTableControls={true}
        idFieldName="museum"
        url="museum"
      />
    </Grouped>
  )
}
