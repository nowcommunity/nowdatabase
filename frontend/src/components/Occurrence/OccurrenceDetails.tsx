import { DetailView, TabType } from '@/components/DetailView/DetailView'
import { UpdateTab } from '@/components/DetailView/common/UpdateTab'
import { getErrorMessage, useNotify } from '@/hooks/notification'
import { useEditOccurrenceMutation, useGetOccurrenceDetailsQuery } from '@/redux/api'
import { useGetLocalityDetailsQuery } from '@/redux/localityReducer'
import { EditDataType, EditMetaData, OccurrenceDetailsType } from '@/shared/types'
import { validateOccurrence, validateOccurrenceFields } from '@/shared/validators/occurrence'
import { CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { OccurrenceCoreTab } from './Tabs/OccurrenceCoreTab'
import { OccurrenceIsotopeTab } from './Tabs/OccurrenceIsotopeTab'
import { OccurrenceWearTab } from './Tabs/OccurrenceWearTab'
import { emptyOccurrence } from './emptyOccurrence'

export const OccurrenceDetails = () => {
  const { lid, speciesId } = useParams()
  const [searchParams] = useSearchParams()

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
      refetchOnMountOrArgChange: true,
    }
  )

  const {
    data: localityData,
    isLoading: localityDataLoading,
    isError: localityQueryError,
  } = useGetLocalityDetailsQuery(localityId)

  const [editOccurrenceRequest, { isLoading: occurrenceMutationLoading }] = useEditOccurrenceMutation()

  const { notify } = useNotify()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo

  if (occurrenceQueryError) return <div>Error loading occurrence data</div>
  if (localityQueryError) return <div>Error loading locality data</div>
  if (!occurrenceData || !localityData || occurrenceDataLoading || localityDataLoading || occurrenceMutationLoading)
    return <CircularProgress />

  const initialOccurrence: OccurrenceDetailsType = { ...emptyOccurrence }

  if (occurrenceData) {
    document.title = `Occurrence - ${occurrenceData.lid}/${occurrenceData.species_id}`
  }

  const onWrite = async (editData: EditDataType<OccurrenceDetailsType> & EditMetaData) => {
    const isSpeciesChanged = editData.species_id !== Number(speciesId)
    if (isSpeciesChanged) {
      notify('Changing the species of an Occurrence is not currently possible.')
      return
    }

    try {
      const updatedOccurrence = await editOccurrenceRequest({
        ...editData,
        comment: editData.comment,
        references: editData.references ?? [],
      }).unwrap()
      notify('Occurrence entry finalized successfully.')
      setTimeout(() => {
        if (returnTo) {
          navigate(returnTo, { replace: true })
          return
        }
        navigate(`/occurrence/${updatedOccurrence.lid}/${updatedOccurrence.species_id}`)
      }, 15)
    } catch (error) {
      notify(getErrorMessage(error, 'Could not finalize occurrence entry.'), 'error')
      throw error
    }
  }

  const tabs: TabType[] = [
    {
      title: 'Occurrence',
      content: (
        <OccurrenceCoreTab
          showSpeciesEditButtons={false}
          clickableLocName={true}
          existingLocalitySpecies={localityData.now_ls}
        />
      ),
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
