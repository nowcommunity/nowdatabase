import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  createFilterOptions,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack as MuiStack,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  DetailContextProvider,
  modeOptionToMode,
  ModeOptions,
  ModeType,
} from '@/components/DetailView/Context/DetailContext'
import { FieldsWithErrorsType, OptionalRadioSelectionProps, TextFieldOptions } from '@/components/DetailView/DetailView'
import {
  DropdownOption,
  DropdownSelector,
  DropdownSelectorWithSearch,
  EditableTextField,
  RadioSelector,
} from '@/components/DetailView/common/editingComponents'
import { ErrorBox, WriteButton } from '@/components/DetailView/components'
import { StagingView } from '@/components/DetailView/StagingView'
import { useUser } from '@/hooks/user'
import { PermissionDenied } from '@/components/PermissionDenied'
import { EditDataType, OccurrenceMergeField, Reference, Role, Species, SpeciesMergeSummary } from '@/shared/types'
import { useGetAllSpeciesQuery, useGetSpeciesMergeSummaryQuery, useMergeSpeciesMutation } from '@/redux/speciesReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import { useNotify } from '@/hooks/notification'
import { PageContextProvider } from '@/components/Page'
import { useNavigate } from 'react-router-dom'

const speciesSummaryFields: Array<{ field: keyof SpeciesMergeSummary['obsolete']; label: string }> = [
  { field: 'species_id', label: 'species_id' },
  { field: 'order_name', label: 'order' },
  { field: 'family_name', label: 'family' },
  { field: 'genus_name', label: 'genus' },
  { field: 'species_name', label: 'species' },
  { field: 'subclass_or_superorder_name', label: 'subclass_or_superorder' },
  { field: 'suborder_or_superfamily_name', label: 'suborder_or_superfamily' },
  { field: 'subfamily_name', label: 'subfamily' },
  { field: 'unique_identifier', label: 'unique' },
  { field: 'localities', label: 'localities' },
  { field: 'sv_length', label: 'sv_length' },
  { field: 'body_mass', label: 'body_mass' },
  { field: 'sd_size', label: 'sd_size' },
  { field: 'sd_display', label: 'sd_display' },
  { field: 'tshm', label: 'tshm' },
  { field: 'tht', label: 'tht' },
  { field: 'crowntype', label: 'crown type' },
  { field: 'diet1', label: 'diet1' },
  { field: 'diet2', label: 'diet2' },
  { field: 'diet3', label: 'diet3' },
  { field: 'locomo1', label: 'locomo1' },
  { field: 'locomo2', label: 'locomo2' },
  { field: 'locomo3', label: 'locomo3' },
]

const occurrenceFieldLabels: Record<string, string> = {
  id_status: 'ID Status',
  orig_entry: 'Additional Information',
  source_name: 'Source Name',
  nis: 'NIS',
  pct: 'PCT',
  quad: 'QUAD',
  mni: 'MNI',
  qua: 'QUA',
  body_mass: 'Body Mass (g)',
  mesowear: 'Mesowear',
  mw_or_low: 'MW Low',
  mw_or_high: 'MW High',
  mw_cs_sharp: 'MW Sharp',
  mw_cs_round: 'MW Round',
  mw_cs_blunt: 'MW Blunt',
  mw_scale_min: 'MW Scale Min',
  mw_scale_max: 'MW Scale Max',
  mw_value: 'MW Value',
  microwear: 'Microwear',
  dc13_mean: 'dC13 Mean',
  dc13_n: 'dC13 n',
  dc13_max: 'dC13 Max',
  dc13_min: 'dC13 Min',
  dc13_stdev: 'dC13 STDEV',
  do18_mean: 'dO18 Mean',
  do18_n: 'dO18 n',
  do18_max: 'dO18 Max',
  do18_min: 'dO18 Min',
  do18_stdev: 'dO18 STDEV',
}

const taxonomyFields = new Set([
  'order_name',
  'family_name',
  'genus_name',
  'species_name',
  'subclass_or_superorder_name',
  'suborder_or_superfamily_name',
  'subfamily_name',
  'unique_identifier',
])

const isEmptyValue = (value: unknown) => value === null || value === undefined || value === ''
const normalizeValue = (value: unknown) => (isEmptyValue(value) ? '' : String(value))
const isSameValue = (left: unknown, right: unknown) => normalizeValue(left) === normalizeValue(right)

const resolveMergeErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data
    if (typeof data === 'string') {
      return data
    }
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message
      if (typeof message === 'string') {
        return message
      }
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') {
      return message
    }
  }

  return 'Merge failed. Please review selections and try again.'
}

const formatSpeciesLabel = (species: Species | null) => {
  if (!species) return ''
  const name = `${species.genus_name ?? ''} ${species.species_name ?? ''}`.trim()
  const base = name || species.unique_identifier || 'Unnamed species'
  const uniqueIdentifier =
    species.unique_identifier && species.unique_identifier !== '-' && base !== species.unique_identifier
      ? ` (${species.unique_identifier})`
      : ''
  return `${species.species_id} ${base}${uniqueIdentifier}`
}

export const SpeciesMergePage = () => {
  const user = useUser()
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { data: speciesList, isError: speciesError } = useGetAllSpeciesQuery()
  const [mergeSpecies, { data: mergeResult }] = useMergeSpeciesMutation()

  const [obsoleteSpecies, setObsoleteSpecies] = useState<Species | null>(null)
  const [acceptedSpecies, setAcceptedSpecies] = useState<Species | null>(null)
  const [copyParameters, setCopyParameters] = useState<'yes' | 'no'>('no')
  const [addSourceName, setAddSourceName] = useState<'yes' | 'no'>('no')
  const [addSynonym, setAddSynonym] = useState<'yes' | 'no'>('no')
  const [synonymComment, setSynonymComment] = useState('')
  const [readyToFinalize, setReadyToFinalize] = useState(false)
  const [speciesFieldChoices, setSpeciesFieldChoices] = useState<Record<string, 'accepted' | 'obsolete'>>({})
  const [mergeErrorMessage, setMergeErrorMessage] = useState<string | null>(null)
  const [occurrenceChoices, setOccurrenceChoices] = useState<Record<number, Record<string, 'accepted' | 'obsolete'>>>(
    {}
  )
  const [mode, setModeState] = useState<ModeType>(modeOptionToMode.edit)
  const [fieldsWithErrors, setFieldsWithErrors] = useState<FieldsWithErrorsType>({})
  const [mergeConfirmations, setMergeConfirmations] = useState({
    reviewedDetails: false,
    confirmRemoval: false,
  })
  const initializedMergeKeyRef = useRef<string | null>(null)

  const obsoleteId = obsoleteSpecies?.species_id
  const acceptedId = acceptedSpecies?.species_id

  const summaryQueryArgs =
    obsoleteId && acceptedId && obsoleteId !== acceptedId ? { obsoleteId, acceptedId } : skipToken

  const {
    data: summary,
    isFetching: summaryLoading,
    isError: summaryError,
  } = useGetSpeciesMergeSummaryQuery(summaryQueryArgs)

  useEffect(() => {
    if (!summary) return

    const mergeKey = obsoleteId && acceptedId ? `${obsoleteId}-${acceptedId}` : null
    if (!mergeKey || initializedMergeKeyRef.current === mergeKey) return
    initializedMergeKeyRef.current = mergeKey

    const fieldChoices: Record<string, 'accepted' | 'obsolete'> = {}
    for (const choice of summary.speciesFieldChoices) {
      fieldChoices[choice.field] = choice.defaultChoice
    }
    setSpeciesFieldChoices(fieldChoices)

    const occurrenceChoiceMap: Record<number, Record<string, 'accepted' | 'obsolete'>> = {}
    for (const conflict of summary.occurrenceConflicts) {
      occurrenceChoiceMap[conflict.lid] = { ...conflict.defaultChoice }
    }
    setOccurrenceChoices(occurrenceChoiceMap)
  }, [summary, obsoleteId, acceptedId])

  useEffect(() => {
    if (obsoleteId && acceptedId && obsoleteId === acceptedId) {
      notify('Obsolete and accepted species must be different.', 'warning')
    }
  }, [obsoleteId, acceptedId, notify])

  useEffect(() => {
    if (!obsoleteId || !acceptedId) {
      initializedMergeKeyRef.current = null
    }
  }, [obsoleteId, acceptedId])

  const speciesOptions = useMemo(() => speciesList ?? [], [speciesList])
  const speciesFilterOptions = useMemo(
    () =>
      createFilterOptions<Species>({
        stringify: option =>
          [
            option.species_id,
            option.genus_name,
            option.species_name,
            option.unique_identifier,
            option.family_name,
            option.order_name,
          ]
            .filter(value => value !== null && value !== undefined && value !== '')
            .join(' '),
      }),
    []
  )
  const mergeContextData = useMemo<{ references: Reference[]; comment: string }>(
    () => ({ references: [], comment: '' }),
    []
  )

  const setMode = (newMode: ModeOptions) => {
    setModeState(modeOptionToMode[newMode])
  }

  const mergeValidator = (
    _editData: EditDataType<{ references: Reference[]; comment: string }>,
    field: keyof EditDataType<{ references: Reference[]; comment: string }>
  ) => {
    return { name: String(field), error: null }
  }

  const textField = (
    field: keyof EditDataType<{ references: Reference[]; comment: string }>,
    options?: TextFieldOptions
  ) => <EditableTextField<{ references: Reference[]; comment: string }> field={field} {...options} />

  const dropdown = (
    field: keyof EditDataType<{ references: Reference[]; comment: string }>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean
  ) => (
    <DropdownSelector<{ references: Reference[]; comment: string }>
      field={field}
      options={options}
      name={name}
      disabled={disabled}
    />
  )

  const dropdownWithSearch = (
    field: keyof EditDataType<{ references: Reference[]; comment: string }>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean,
    label?: string
  ) => (
    <DropdownSelectorWithSearch<{ references: Reference[]; comment: string }>
      field={field}
      options={options}
      name={name}
      disabled={disabled}
      label={label}
    />
  )

  const radioSelection = (
    field: keyof EditDataType<{ references: Reference[]; comment: string }>,
    options: Array<DropdownOption | string>,
    name: string,
    optionalRadioSelectionProps?: OptionalRadioSelectionProps
  ) => (
    <RadioSelector<{ references: Reference[]; comment: string }>
      field={field}
      options={options}
      name={name}
      {...optionalRadioSelectionProps}
    />
  )

  const bigTextField = (field: keyof EditDataType<{ references: Reference[]; comment: string }>) => (
    <EditableTextField<{ references: Reference[]; comment: string }> field={field} type="text" big />
  )

  if (user.role !== Role.Admin) {
    return (
      <PermissionDenied title="Permission denied" message="Only administrators can access the Species Merge tool." />
    )
  }

  const handleSpeciesChoiceChange = (field: string, value: 'accepted' | 'obsolete') => {
    setSpeciesFieldChoices(prev => ({ ...prev, [field]: value }))
  }

  const handleOccurrenceChoiceChange = (lid: number, field: string, value: 'accepted' | 'obsolete') => {
    setOccurrenceChoices(prev => ({
      ...prev,
      [lid]: {
        ...(prev[lid] ?? {}),
        [field]: value,
      },
    }))
  }

  const handleMergeWrite = async (editData: EditDataType<{ references: Reference[]; comment: string }>) => {
    if (!summary || !obsoleteId || !acceptedId) return

    if (!readyToFinalize) {
      const message = 'Please confirm the merge action before finalizing.'
      setMergeErrorMessage(message)
      notify(message, 'warning')
      return
    }

    if (!mergeConfirmations.reviewedDetails || !mergeConfirmations.confirmRemoval) {
      const message = 'Please confirm the merge checklist before saving.'
      setMergeErrorMessage(message)
      notify(message, 'warning')
      return
    }

    const cleanedReferences = (editData.references ?? [])
      .filter(ref => !ref.rowState || ref.rowState !== 'removed')
      .map(ref => {
        const { rowState, ...rest } = ref as Reference & { rowState?: string }
        return rest
      })

    if (cleanedReferences.length === 0) {
      const message = 'Please add at least one reference before saving.'
      setMergeErrorMessage(message)
      notify(message, 'warning')
      return
    }

    const selectedSpeciesFieldValues: Record<string, string | number | boolean | null> = {}
    if (copyParameters === 'yes') {
      for (const choice of summary.speciesFieldChoices) {
        if (taxonomyFields.has(choice.field)) continue
        if (isEmptyValue(choice.obsoleteValue) && isEmptyValue(choice.acceptedValue)) continue
        const selection = speciesFieldChoices[choice.field] ?? choice.defaultChoice
        selectedSpeciesFieldValues[choice.field] =
          selection === 'obsolete' ? choice.obsoleteValue : choice.acceptedValue
      }
    }

    const occurrenceFieldChoices = summary.occurrenceConflicts.map(conflict => ({
      lid: conflict.lid,
      fieldChoice: occurrenceChoices[conflict.lid] ?? conflict.defaultChoice,
    }))

    try {
      setMergeErrorMessage(null)
      await mergeSpecies({
        obsoleteSpeciesId: obsoleteId,
        acceptedSpeciesId: acceptedId,
        selectedSpeciesFieldValues,
        occurrenceFieldChoices,
        addObsoleteAsSynonym: addSynonym === 'yes',
        synonymComment: synonymComment.trim() || undefined,
        addSourceNameToOccurrences: addSourceName === 'yes',
        comment: editData.comment?.trim() || `Merging ${formatSpeciesLabel(obsoleteSpecies)} as synonym`,
        references: cleanedReferences,
      }).unwrap()

      notify('Species merged successfully.')
      setMode('read')
      if (acceptedId) {
        setTimeout(() => navigate(`/species/${acceptedId}`), 50)
      }
    } catch (error) {
      const message = resolveMergeErrorMessage(error)
      setMergeErrorMessage(message)
      notify(message, 'error')
    }
  }

  const detailContextState = {
    data: mergeContextData,
    mode,
    setMode,
    editData: mergeContextData as EditDataType<{ references: Reference[]; comment: string }>,
    textField,
    dropdown,
    dropdownWithSearch,
    radioSelection,
    bigTextField,
    validator: mergeValidator,
    fieldsWithErrors,
    setFieldsWithErrors,
  }

  const checklistComplete = mergeConfirmations.reviewedDetails && mergeConfirmations.confirmRemoval

  return (
    <PageContextProvider
      idFieldName="species_id"
      viewName="species-merge"
      createTitle={() => 'Merge Species'}
      createSubtitle={() => ''}
      editRights={{ edit: true }}
    >
      <DetailContextProvider contextState={detailContextState}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4">Merge Species (Admin)</Typography>

          {speciesError ? <Alert severity="error">Failed to load species list.</Alert> : null}
          {summaryError ? <Alert severity="error">Failed to load merge summary.</Alert> : null}
          {mergeErrorMessage ? <Alert severity="error">{mergeErrorMessage}</Alert> : null}

          {!mode.staging ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Autocomplete
                options={speciesOptions}
                filterOptions={speciesFilterOptions}
                value={obsoleteSpecies}
                onChange={(_event, value) => {
                  setObsoleteSpecies(value)
                  setReadyToFinalize(false)
                  setMergeErrorMessage(null)
                }}
                getOptionLabel={formatSpeciesLabel}
                renderInput={params => <TextField {...params} label="Obsolete taxonomy" />}
                sx={{ flex: 1 }}
              />
              <Autocomplete
                options={speciesOptions}
                filterOptions={speciesFilterOptions}
                value={acceptedSpecies}
                onChange={(_event, value) => {
                  setAcceptedSpecies(value)
                  setReadyToFinalize(false)
                  setMergeErrorMessage(null)
                }}
                getOptionLabel={formatSpeciesLabel}
                renderInput={params => <TextField {...params} label="Accepted taxonomy" />}
                sx={{ flex: 1 }}
              />
            </Stack>
          ) : null}

          {summaryLoading ? <Alert severity="info">Loading merge summary…</Alert> : null}

          {summary && !mode.staging ? (
            <>
              <Divider />
              <Typography variant="h6">Selected taxonomies</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">Obsolete taxonomy</Typography>
                  <Typography>{formatSpeciesLabel(obsoleteSpecies)}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">Accepted taxonomy</Typography>
                  <Typography>{formatSpeciesLabel(acceptedSpecies)}</Typography>
                </Box>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Obsolete taxonomy</TableCell>
                    <TableCell>Accepted taxonomy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {speciesSummaryFields.map(field => (
                    <TableRow
                      key={`summary-${field.field}`}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{field.label}</TableCell>
                      <TableCell>{summary.obsolete?.[field.field] ?? '-'}</TableCell>
                      <TableCell>{summary.accepted?.[field.field] ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider />
              <Typography variant="h6">Copy selected parameters from obsolete to accepted?</Typography>
              <RadioGroup
                row
                value={copyParameters}
                onChange={event => setCopyParameters(event.target.value as 'yes' | 'no')}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

              {copyParameters === 'yes' ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell>Obsolete</TableCell>
                      <TableCell>Accepted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.speciesFieldChoices
                      .filter(
                        choice =>
                          !taxonomyFields.has(choice.field) &&
                          !isEmptyValue(choice.obsoleteValue) &&
                          !isSameValue(choice.obsoleteValue, choice.acceptedValue)
                      )
                      .map(choice => {
                        const selected = speciesFieldChoices[choice.field] ?? choice.defaultChoice
                        return (
                          <TableRow key={choice.field}>
                            <TableCell>{choice.field}</TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={selected === 'obsolete'}
                                    onChange={() => handleSpeciesChoiceChange(choice.field, 'obsolete')}
                                  />
                                }
                                label={isEmptyValue(choice.obsoleteValue) ? '-' : String(choice.obsoleteValue)}
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={selected === 'accepted'}
                                    onChange={() => handleSpeciesChoiceChange(choice.field, 'accepted')}
                                  />
                                }
                                label={isEmptyValue(choice.acceptedValue) ? '-' : String(choice.acceptedValue)}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              ) : null}

              <Divider />
              <Typography variant="h6">Source name</Typography>
              <Typography>
                Add {formatSpeciesLabel(obsoleteSpecies)} to the Source Name field in locality-species records when
                merging locality data?
              </Typography>
              <RadioGroup
                row
                value={addSourceName}
                onChange={event => setAddSourceName(event.target.value as 'yes' | 'no')}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

              <Divider />
              <Typography variant="h6">Occurrence conflict resolution</Typography>
              {summary.occurrenceConflicts.length === 0 ? (
                <Typography>No conflicting occurrences found.</Typography>
              ) : (
                summary.occurrenceConflicts
                  .map(conflict => {
                    const fields = (Object.keys(conflict.obsolete) as OccurrenceMergeField[]).filter(
                      field =>
                        !isEmptyValue(conflict.obsolete[field]) &&
                        !isSameValue(conflict.obsolete[field], conflict.accepted[field])
                    )
                    return { conflict, fields }
                  })
                  .filter(entry => entry.fields.length > 0)
                  .map(({ conflict, fields }) => (
                    <Box key={conflict.lid} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">
                        Locality {conflict.lid} - {conflict.localityName ?? 'Unknown'} ({conflict.country ?? '-'})
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell>Obsolete</TableCell>
                            <TableCell>Accepted</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fields.map(field => {
                            const selected = occurrenceChoices[conflict.lid]?.[field] ?? conflict.defaultChoice[field]
                            const obsoleteValue = conflict.obsolete[field]
                            const acceptedValue = conflict.accepted[field]
                            return (
                              <TableRow key={`${conflict.lid}-${field}`}>
                                <TableCell>{occurrenceFieldLabels[field] ?? field}</TableCell>
                                <TableCell>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={selected === 'obsolete'}
                                        onChange={() => handleOccurrenceChoiceChange(conflict.lid, field, 'obsolete')}
                                      />
                                    }
                                    label={isEmptyValue(obsoleteValue) ? '-' : String(obsoleteValue)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={selected === 'accepted'}
                                        onChange={() => handleOccurrenceChoiceChange(conflict.lid, field, 'accepted')}
                                      />
                                    }
                                    label={isEmptyValue(acceptedValue) ? '-' : String(acceptedValue)}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  ))
              )}

              <Divider />
              <Typography variant="h6">Add obsolete species as synonym?</Typography>
              <RadioGroup row value={addSynonym} onChange={event => setAddSynonym(event.target.value as 'yes' | 'no')}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {addSynonym === 'yes' ? (
                <TextField
                  label="Synonym comment"
                  value={synonymComment}
                  onChange={event => setSynonymComment(event.target.value)}
                  fullWidth
                />
              ) : null}

              <Divider />
              <Button
                variant="contained"
                onClick={() => {
                  setReadyToFinalize(true)
                  setMergeErrorMessage(null)
                  setMode('staging-edit')
                  setMergeConfirmations({ reviewedDetails: false, confirmRemoval: false })
                }}
                disabled={!obsoleteId || !acceptedId || obsoleteId === acceptedId}
              >
                Remove {formatSpeciesLabel(obsoleteSpecies)} and keep {formatSpeciesLabel(acceptedSpecies)} (occurrence
                data will be merged)
              </Button>

              {mergeResult ? (
                <Alert severity="success">
                  <Typography>SPECIES MERGED SUCCESSFULLY</Typography>
                  <Typography>SUID {mergeResult.suid}</Typography>
                  <Typography>Coordinator {mergeResult.coordinator}</Typography>
                  <Typography>Editor {mergeResult.editor}</Typography>
                  <Typography>Date {mergeResult.date}</Typography>
                  <Typography>Comment {mergeResult.comment}</Typography>
                </Alert>
              ) : null}
            </>
          ) : null}

          {mode.staging ? (
            <>
              <Divider />
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Reference Selection</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setMode('edit')
                  }}
                >
                  Back to merge details
                </Button>
              </Stack>

              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1">Merge summary</Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Obsolete species
                    </Typography>
                    <Typography>{formatSpeciesLabel(obsoleteSpecies)}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Accepted species
                    </Typography>
                    <Typography>{formatSpeciesLabel(acceptedSpecies)}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Alert severity="warning">
                You are about to merge and remove the obsolete species. This action will update occurrences and cannot
                be easily undone.
              </Alert>

              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1">Merge checklist</Typography>
                {!checklistComplete ? (
                  <MuiStack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <WarningAmberIcon fontSize="small" color="warning" />
                    <Typography variant="body2" color="warning.main">
                      Please complete the checklist before saving.
                    </Typography>
                  </MuiStack>
                ) : null}
                <Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mergeConfirmations.reviewedDetails}
                        onChange={event =>
                          setMergeConfirmations(prev => ({ ...prev, reviewedDetails: event.target.checked }))
                        }
                      />
                    }
                    label={
                      <MuiStack direction="row" spacing={1} alignItems="center">
                        {!mergeConfirmations.reviewedDetails ? (
                          <WarningAmberIcon fontSize="small" color="warning" />
                        ) : null}
                        <Typography color={mergeConfirmations.reviewedDetails ? 'text.primary' : 'error'}>
                          I reviewed the merge details and parameter selections.
                        </Typography>
                      </MuiStack>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mergeConfirmations.confirmRemoval}
                        onChange={event =>
                          setMergeConfirmations(prev => ({ ...prev, confirmRemoval: event.target.checked }))
                        }
                      />
                    }
                    label={
                      <MuiStack direction="row" spacing={1} alignItems="center">
                        {!mergeConfirmations.confirmRemoval ? (
                          <WarningAmberIcon fontSize="small" color="warning" />
                        ) : null}
                        <Typography color={mergeConfirmations.confirmRemoval ? 'text.primary' : 'error'}>
                          I understand the obsolete species will be removed after saving.
                        </Typography>
                      </MuiStack>
                    }
                  />
                </Stack>
              </Box>

              <StagingView />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {!mergeConfirmations.reviewedDetails || !mergeConfirmations.confirmRemoval ? (
                  <Typography variant="body2" color="text.secondary">
                    Complete the checklist above to enable saving.
                  </Typography>
                ) : (
                  <span />
                )}
                <ErrorBox />
                <Tooltip title={checklistComplete ? '' : 'Complete the checklist to enable saving.'}>
                  <span>
                    <WriteButton onWrite={handleMergeWrite} disabled={!checklistComplete} />
                  </span>
                </Tooltip>
              </Box>
            </>
          ) : null}
        </Box>
      </DetailContextProvider>
    </PageContextProvider>
  )
}

export default SpeciesMergePage
