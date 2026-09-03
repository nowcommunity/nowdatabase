import { CircularProgress } from '@mui/material'
import { useParams, useSearchParams } from 'react-router-dom'
import { DetailView, TabType } from '@/components/DetailView/DetailView'
import { UpdateTab } from '@/components/DetailView/common/UpdateTab'
import { OccurrenceCoreTab } from './Tabs/OccurrenceCoreTab'
import { OccurrenceWearTab } from './Tabs/OccurrenceWearTab'
import { OccurrenceIsotopeTab } from './Tabs/OccurrenceIsotopeTab'
import { EditDataType, EditableOccurrenceData, OccurrenceDetailsType } from '@/shared/types'
import { validateOccurrence } from '@/shared/validators/occurrence'
import { getErrorMessage, useNotify } from '@/hooks/notification'
import { ValidationObject } from '@/shared/validators/validator'
import { useEditOccurrenceMutation, useGetOccurrenceDetailsQuery } from '@/redux/api'

const validateOccurrenceDetail = (
  editData: EditDataType<OccurrenceDetailsType>,
  fieldName: keyof EditDataType<OccurrenceDetailsType>
): ValidationObject => {
  return validateOccurrence(editData as EditableOccurrenceData, fieldName as keyof EditableOccurrenceData)
}

const emptyOccurrence: OccurrenceDetailsType = {
  lid: 0,
  species_id: 0,
  loc_status: null,
  loc_name: '',
  country: '',
  genus_name: '',
  family_name: null,
  species_name: '',
  unique_identifier: null,
  dms_lat: null,
  dms_long: null,
  bfa_max: null,
  bfa_min: null,
  max_age: null,
  min_age: null,
  nis: null,
  pct: null,
  quad: null,
  mni: null,
  qua: null,
  id_status: null,
  orig_entry: null,
  source_name: null,
  body_mass: null,
  mesowear: null,
  mw_or_high: null,
  mw_or_low: null,
  mw_cs_sharp: null,
  mw_cs_round: null,
  mw_cs_blunt: null,
  mw_scale_min: null,
  mw_scale_max: null,
  mw_value: null,
  microwear: null,
  dc13_mean: null,
  dc13_n: null,
  dc13_max: null,
  dc13_min: null,
  dc13_stdev: null,
  do18_mean: null,
  do18_n: null,
  do18_max: null,
  do18_min: null,
  do18_stdev: null,
  now_oau: [],
}

export const OccurrenceDetails = () => {
  const { id, lid, speciesId } = useParams()
  const [searchParams] = useSearchParams()
  console.log(searchParams)
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New locality'
  }
  const parsedLid = lid ? parseInt(lid, 10) : -1
  const parsedSpeciesId = speciesId ? parseInt(speciesId, 10) : -1
  const {
    data: occurrenceData,
    isLoading,
    isError,
  } = useGetOccurrenceDetailsQuery(
    { lid: parsedLid, speciesId: parsedSpeciesId },
    {
      skip: isNew,
    }
  )
  const { notify } = useNotify()
  const [editOccurrenceRequest, { isLoading: mutationLoading }] = useEditOccurrenceMutation()

  const lidFromSearchParams = searchParams.get('lid')
  const locNameFromSearchParams = searchParams.get('loc_name')

  if (isError) return <div>Error loading occurrence data</div>
  if (isLoading || (!occurrenceData && !isNew) || mutationLoading) return <CircularProgress />

  const initialOccurrence = emptyOccurrence

  if (isNew) {
    initialOccurrence.lid = parseInt(lidFromSearchParams!, 10)
    initialOccurrence.loc_name = locNameFromSearchParams!
  }

  if (occurrenceData) {
    document.title = `Occurrence - ${occurrenceData.lid}/${occurrenceData.species_id}`
  }

  const onWrite = async (editData: EditDataType<OccurrenceDetailsType>) => {
    try {
      console.log(editData)
      await editOccurrenceRequest(editData).unwrap()
      notify('Occurrence entry finalized successfully.')
    } catch (error) {
      notify(getErrorMessage(error, 'Could not finalize occurrence entry.'), 'error')
      throw error
    }
  }

  const tabs: TabType[] = [
    { title: 'Occurrence', content: <OccurrenceCoreTab /> },
    { title: 'Wear', content: <OccurrenceWearTab /> },
    { title: 'Isotopes', content: <OccurrenceIsotopeTab /> },
    {
      title: 'Updates',
      content: <UpdateTab prefix="occ" refFieldName="references" updatesFieldName="now_oau" />,
    },
  ]

  return (
    <DetailView<OccurrenceDetailsType>
      tabs={tabs}
      data={occurrenceData ?? initialOccurrence}
      isNew={isNew}
      validator={validateOccurrenceDetail}
      onWrite={onWrite}
      hasStagingMode
    />
  )
}
