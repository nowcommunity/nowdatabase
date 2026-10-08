import { DetailView, TabType } from '@/components/DetailView/DetailView'
import { UpdateTab } from '@/components/DetailView/common/UpdateTab'
import { getErrorMessage, useNotify } from '@/hooks/notification'
import { useEditOccurrenceMutation, useGetOccurrenceDetailsQuery } from '@/redux/api'
import { useEditLocalityMutation, useGetLocalityDetailsQuery } from '@/redux/localityReducer'
import { useLazyGetSpeciesDetailsQuery } from '@/redux/speciesReducer'
import {
  EditableOccurrenceData,
  EditDataType,
  EditMetaData,
  LocalitySpeciesDetailsType,
  OccurrenceDetailsType,
  RowState,
  SpeciesDetailsType,
} from '@/shared/types'
import { validateOccurrence, validateOccurrenceFields } from '@/shared/validators/occurrence'
import { CircularProgress } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { emptySpecies } from '../DetailView/common/defaultValues'
import { OccurrenceCoreTab } from './Tabs/OccurrenceCoreTab'
import { OccurrenceIsotopeTab } from './Tabs/OccurrenceIsotopeTab'
import { OccurrenceWearTab } from './Tabs/OccurrenceWearTab'
import { emptyOccurrence } from './emptyOccurrence'

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
  const { lid, speciesId } = useParams()
  const [searchParams] = useSearchParams()

  const [getSpeciesDetails] = useLazyGetSpeciesDetailsQuery()

  const parsedLid = lid ? parseInt(lid, 10) : -1
  const parsedSpeciesId = speciesId ? parseInt(speciesId, 10) : -1

  // these two should exist if the occurrence is created through a locality's Occurrences tab
  const lidFromSearchParams = searchParams.get('lid')

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

  const [editOccurrenceRequest, { isLoading: occurrenceMutationLoading }] = useEditOccurrenceMutation()
  const [editLocalityRequest, { isLoading: localityMutationLoading }] = useEditLocalityMutation()

  const { notify } = useNotify()
  const navigate = useNavigate()

  if (occurrenceQueryError) return <div>Error loading occurrence data</div>
  if (localityQueryError) return <div>Error loading locality data</div>
  if (occurrenceDataLoading || localityDataLoading || occurrenceMutationLoading || localityMutationLoading)
    return <CircularProgress />

  const initialOccurrence: OccurrenceDetailsType = { ...emptyOccurrence }

  if (occurrenceData) {
    document.title = `Occurrence - ${occurrenceData.lid}/${occurrenceData.species_id}`
  }

  const onWrite = async (editData: EditDataType<OccurrenceDetailsType> & EditMetaData) => {
    try {
      if (!localityData) throw new Error('Could not load the linked locality.')

      const isSpeciesChanged = editData.species_id !== Number(speciesId)
      const isSpeciesNew = editData.species_id === undefined

      // Get this Occurrence, but as a LocalitySpeciesDetailsType
      const existingOccurrence = localityData.now_ls.find(ls => ls.species_id === Number(speciesId))
      let changedSpeciesDetails: SpeciesDetailsType | null = null
      let comSpecies: EditDataType<SpeciesDetailsType> | null = null

      if (isSpeciesNew) {
        comSpecies = {
          ...emptySpecies,
          species_id: undefined,
          order_name: editData.order_name ?? emptySpecies.order_name,
          genus_name: editData.genus_name ?? emptySpecies.genus_name,
          family_name: editData.family_name ?? emptySpecies.family_name,
          species_name: editData.species_name ?? emptySpecies.species_name,
          unique_identifier: editData.unique_identifier ?? emptySpecies.unique_identifier,
        }
      } else if (isSpeciesChanged) {
        changedSpeciesDetails = await getSpeciesDetails(String(editData.species_id)).unwrap()
        if (!changedSpeciesDetails) {
          notify('Could not get details of the changed species.')
          return
        }
        comSpecies = {
          ...emptySpecies,
          species_id: editData.species_id ?? undefined,
          order_name: editData.order_name ?? emptySpecies.order_name,
          genus_name: editData.genus_name ?? emptySpecies.genus_name,
          family_name: editData.family_name ?? emptySpecies.family_name,
          species_name: editData.species_name ?? emptySpecies.species_name,
          unique_identifier: editData.unique_identifier ?? emptySpecies.unique_identifier,
        }
      } else {
        comSpecies = existingOccurrence!.com_species
      }

      const occurrenceData = occurrenceFields.reduce<Record<string, unknown>>((data, field) => {
        if (field in editData) data[field] = editData[field]
        return data
      }, {})

      const occurrence = {
        ...(existingOccurrence ?? {}),
        lid: localityData.lid,
        species_id: editData.species_id,
        com_species: comSpecies,
        ...occurrenceData,
        ...(isSpeciesChanged && { rowState: 'new' }),
      }

      if (isSpeciesChanged) {
        //  removes the old occurrence before adding the update version back in
        const removedRow = localityData.now_ls.find(row => row.species_id === Number(speciesId))
        const updatedNowLs = [
          ...localityData.now_ls,
          { ...removedRow, rowState: 'removed' as RowState } as LocalitySpeciesDetailsType,
          occurrence as LocalitySpeciesDetailsType,
        ]

        await editLocalityRequest({
          ...localityData,
          now_ls: updatedNowLs,
          comment: editData.comment,
          references: editData.references ?? [],
        }).unwrap()

        notify('Occurrence entry finalized successfully.')
        if (isSpeciesNew) {
          // navigates to occurrence table, since getting the ID of the newly created species is difficult
          setTimeout(() => navigate('/occurrence'), 15)
        } else {
          setTimeout(() => navigate(`/occurrence/${occurrence.lid}/${occurrence.species_id}`), 15)
        }
      } else {
        // edit Occurrence directly since species is not updated and the combined ID does not change
        const updatedOccurrence = await editOccurrenceRequest({
          ...(occurrence as EditDataType<OccurrenceDetailsType>),
          comment: editData.comment,
          references: editData.references ?? [],
        }).unwrap()
        notify('Occurrence entry finalized successfully.')
        setTimeout(() => navigate(`/occurrence/${updatedOccurrence.lid}/${updatedOccurrence.species_id}`), 15)
      }
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
