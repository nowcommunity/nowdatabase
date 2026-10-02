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
  LocalitySpeciesDetailsType,
  SpeciesDetailsType,
} from '@/shared/types'
import { validateOccurrence, validateOccurrenceFields } from '@/shared/validators/occurrence'
import { getErrorMessage, useNotify } from '@/hooks/notification'
import { useGetOccurrenceDetailsQuery } from '@/redux/api'
import { useEditLocalityMutation, useGetLocalityDetailsQuery } from '@/redux/localityReducer'
import { emptyOccurrence } from './emptyOccurrence'
import { useLazyGetSpeciesDetailsQuery } from '@/redux/speciesReducer'
import { toSpeciesDetailsDraft } from '../common/toSpeciesDetailsDraft'

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

  const [getSpeciesDetails] = useLazyGetSpeciesDetailsQuery()

  const parsedLid = lid ? parseInt(lid, 10) : -1
  const parsedSpeciesId = speciesId ? parseInt(speciesId, 10) : -1

  // these two should exist if the occurrence is created through a locality's Occurrences tab
  const lidFromSearchParams = searchParams.get('lid')
  const locNameFromSearchParams = searchParams.get('loc_name')

  const localityId = lidFromSearchParams ?? lid ?? ''

  const {
    data: occurrenceData,
    isLoading: occurrenceDataLoading,
    isError: occurrenceQueryError,
  } = useGetOccurrenceDetailsQuery(
    { lid: parsedLid, speciesId: parsedSpeciesId },
    {
      skip: Number.isNaN(parsedLid) || Number.isNaN(parsedSpeciesId),
    }
  )

  const {
    data: localityData,
    isLoading: localityDataLoading,
    isError: localityQueryError,
  } = useGetLocalityDetailsQuery(localityId)

  const [editLocalityRequest, { isLoading: mutationLoading }] = useEditLocalityMutation()

  const { notify } = useNotify()
  const navigate = useNavigate()

  if (occurrenceQueryError) return <div>Error loading occurrence data</div>
  if (localityQueryError) return <div>Error loading locality data</div>
  if (occurrenceDataLoading || localityDataLoading || mutationLoading) return <CircularProgress />

  const initialOccurrence: OccurrenceDetailsType = { ...emptyOccurrence }

  if (occurrenceData) {
    document.title = `Occurrence - ${occurrenceData.lid}/${occurrenceData.species_id}`
  }

  const onWrite = async (editData: EditDataType<OccurrenceDetailsType> & EditMetaData) => {
    try {
      if (!localityData) throw new Error('Could not load the linked locality.')

      const isSpeciesChanged = editData.species_id !== Number(speciesId)
      console.log(editData.species_id)
      console.log(speciesId)
      console.log(isSpeciesChanged)

      let changedSpeciesDetails: SpeciesDetailsType | null = null
      if (isSpeciesChanged) {
        changedSpeciesDetails = await getSpeciesDetails(String(editData.species_id)).unwrap()
      }
      console.log('changedSpeciesDetails', changedSpeciesDetails)

      const existingOccurrence = localityData.now_ls.find(ls => ls.species_id === editData.species_id)
      const occurrenceData = occurrenceFields.reduce<Record<string, unknown>>((data, field) => {
        if (field in editData) data[field] = editData[field]
        return data
      }, {})
      console.log(editData)
      const occurrence = {
        ...(existingOccurrence ?? {}),
        lid: localityData.lid,
        species_id: editData.species_id,
        com_species: editData.species_id
          ? toSpeciesDetailsDraft(changedSpeciesDetails)
          : toSpeciesDetailsDraft(editData),
        ...occurrenceData,
        ...(isSpeciesChanged && { rowState: 'new' }),
      } as LocalitySpeciesDetailsType

      console.log(occurrence)

      let updatedNowLs
      if (isSpeciesChanged) {
        // if species was changed, removes this occurrence from the now_ls, and adds a new occurrence with the new species
        const removedRow = localityData.now_ls.find(row => row.species_id === Number(speciesId))
        updatedNowLs = [
          ...localityData.now_ls.filter(row => row.species_id !== removedRow?.species_id),
          { ...removedRow, rowState: 'removed' } as LocalitySpeciesDetailsType,
          occurrence,
        ]
      } else {
        // if species was not changed, simply updates the occurrence
        updatedNowLs = [...localityData.now_ls, occurrence]
      }
      console.log(updatedNowLs)
      await editLocalityRequest({
        ...localityData,
        now_ls: updatedNowLs,
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
    {
      title: 'Occurrence',
      content: <OccurrenceCoreTab clickableLocName={true} existingLocalitySpecies={localityData!.now_ls} />,
    },
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
      validator={validateOccurrence}
      validateFields={validateOccurrenceFields}
      onWrite={onWrite}
      hasStagingMode
    />
  )
}
