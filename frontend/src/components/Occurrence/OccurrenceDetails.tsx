import { CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { DetailView, TabType } from '@/components/DetailView/DetailView'
import { UpdateTab } from '@/components/DetailView/common/UpdateTab'
import { OccurrenceCoreTab } from './Tabs/OccurrenceCoreTab'
import { OccurrenceWearTab } from './Tabs/OccurrenceWearTab'
import { OccurrenceIsotopeTab } from './Tabs/OccurrenceIsotopeTab'
import { useOccurrenceDetails } from '@/hooks/useOccurrenceDetails'
import { OccurrenceDetailsType } from '@/shared/types'
import { ValidationObject } from '@/shared/validators/validator'

const validateOccurrence = (): ValidationObject => ({ error: null, name: '' })

const emptyOccurrence: OccurrenceDetailsType = {
  lid: 0,
  species_id: 0,
  loc_status: null,
  loc_name: '',
  country: '',
  genus_name: '',
  species_name: '',
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
  const { lid, speciesId } = useParams()
  const parsedLid = lid ? parseInt(lid, 10) : null
  const parsedSpeciesId = speciesId ? parseInt(speciesId, 10) : null
  const { occurrence, isLoading, isError } = useOccurrenceDetails(parsedLid, parsedSpeciesId)

  if (isError) return <div>Error loading occurrence data</div>
  if (isLoading || !occurrence) return <CircularProgress />

  document.title = `Occurrence - ${occurrence.lid}/${occurrence.species_id}`

  const tabs: TabType[] = [
    { title: 'Core', content: <OccurrenceCoreTab /> },
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
      data={occurrence ?? emptyOccurrence}
      validator={validateOccurrence}
    />
  )
}
