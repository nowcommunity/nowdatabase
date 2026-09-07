import { CircularProgress } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DetailView, TabType } from '@/components/DetailView/DetailView'
import { UpdateTab } from '@/components/DetailView/common/UpdateTab'
import { OccurrenceCoreTab } from './Tabs/OccurrenceCoreTab'
import { OccurrenceWearTab } from './Tabs/OccurrenceWearTab'
import { OccurrenceIsotopeTab } from './Tabs/OccurrenceIsotopeTab'
import {
  EditDataType,
  EditableOccurrenceData,
  EditMetaData,
  LocalityDetailsType,
  OccurrenceDetailsType,
} from '@/shared/types'
import { validateOccurrence } from '@/shared/validators/occurrence'
import { getErrorMessage, useNotify } from '@/hooks/notification'
import { ValidationObject } from '@/shared/validators/validator'
import { useGetOccurrenceDetailsQuery } from '@/redux/api'
import { useEditLocalityMutation, useGetLocalityDetailsQuery } from '@/redux/localityReducer'

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

const occurrenceFields: Array<keyof EditableOccurrenceData> = [
  'nis',
  'pct',
  'quad',
  'mni',
  'qua',
  'id_status',
  'orig_entry',
  'source_name',
  'body_mass',
  'mesowear',
  'mw_or_high',
  'mw_or_low',
  'mw_cs_sharp',
  'mw_cs_round',
  'mw_cs_blunt',
  'mw_scale_min',
  'mw_scale_max',
  'mw_value',
  'microwear',
  'dc13_mean',
  'dc13_n',
  'dc13_max',
  'dc13_min',
  'dc13_stdev',
  'do18_mean',
  'do18_n',
  'do18_max',
  'do18_min',
  'do18_stdev',
]

export const OccurrenceDetails = () => {
  const { id, lid, speciesId } = useParams()
  const [searchParams] = useSearchParams()
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
  const navigate = useNavigate()
  const [editLocalityRequest, { isLoading: mutationLoading }] = useEditLocalityMutation()

  const lidFromSearchParams = searchParams.get('lid')
  const locNameFromSearchParams = searchParams.get('loc_name')
  const localityId = lidFromSearchParams ?? lid ?? ''
  const { data: localityData } = useGetLocalityDetailsQuery(localityId)

  if (isError) return <div>Error loading occurrence data</div>
  if (isLoading || (!occurrenceData && !isNew) || mutationLoading) return <CircularProgress />

  const initialOccurrence = emptyOccurrence

  if (isNew) {
    initialOccurrence.lid = parseInt(localityId, 10)
    initialOccurrence.loc_name = locNameFromSearchParams ?? ''
  }

  if (occurrenceData) {
    document.title = `Occurrence - ${occurrenceData.lid}/${occurrenceData.species_id}`
  }

  const onWrite = async (editData: EditDataType<OccurrenceDetailsType> & EditMetaData) => {
    try {
      if (!localityData) throw new Error('Could not load the linked locality.')

      const occurrenceSpeciesId = isNew ? editData.species_id : parsedSpeciesId
      const existingOccurrence = localityData.now_ls.find(row => row.species_id === occurrenceSpeciesId)
      const occurrenceData = occurrenceFields.reduce<Record<string, unknown>>((data, field) => {
        if (field in editData) data[field] = editData[field]
        return data
      }, {})
      const occurrence = {
        ...(existingOccurrence ?? {}),
        lid: localityData.lid,
        species_id: occurrenceSpeciesId ?? existingOccurrence?.species_id,
        ...occurrenceData,
        ...(isNew
          ? {
              rowState: 'new' as const,
              com_species: {
                com_taxa_synonym: [],
                now_sau: [],
                species_id: editData.species_id,
                family_name: editData.family_name,
                genus_name: editData.genus_name,
                species_name: editData.species_name,
                unique_identifier: editData.unique_identifier,
              },
            }
          : {}),
      }

      const nowLs = (
        isNew
          ? [...localityData.now_ls, occurrence]
          : localityData.now_ls.map(row => (row.species_id === occurrenceSpeciesId ? occurrence : row))
      ) as EditDataType<LocalityDetailsType>['now_ls']
      await editLocalityRequest({
        ...localityData,
        now_ls: nowLs,
        comment: editData.comment,
        references: editData.references ?? [],
      }).unwrap()
      notify('Occurrence entry finalized successfully.')
      setTimeout(() => navigate(`/occurrence/${editData.lid}/${editData.species_id}`), 15)
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
