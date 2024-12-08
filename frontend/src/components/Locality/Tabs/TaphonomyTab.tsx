import { Editable, LocalityDetailsType, CollectingMethod } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped, ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { emptyOption } from '@/components/DetailView/common/misc'

export const TaphonomyTab = () => {
  const { textField, dropdown } = useDetailContext<LocalityDetailsType>()
  const { mode } = useDetailContext<LocalityDetailsType>()

  const assemblageFormationOptions = [
    emptyOption,
    { display: 'Attritional', value: 'attritional' },
    { display: 'Bone collecting vertebrate', value: 'bone_collctr' },
    { display: 'Carnivore ingestion', value: 'carn_ingest' },
    { display: 'Herbivore accumulation', value: 'herb_accum' },
    { display: 'Isolated death', value: 'isol_death' },
    { display: 'Mass death', value: 'mass_death' },
  ]

  const transportOptions = [
    emptyOption,
    { display: 'Highly transported', value: 'high_trans' },
    { display: 'All three', value: 'high_trans_winn' },
    { display: 'Transported', value: 'trans' },
    { display: 'Transported and winnowed', value: 'trans_winn' },
    { display: 'Untransported', value: 'untrans' },
    { display: 'Untransported and winnowed', value: 'untrans_winn' },
  ]

  const abrasionOptions = [
    emptyOption,
    { display: 'Abraded', value: 'abraded' },
    { display: 'Mixed', value: 'mixed_abr' },
    { display: 'Unabraded', value: 'unabrade' },
  ]

  const weatheringTramplingOptions = [
    emptyOption,
    { display: 'Mixed weathered and unweathered', value: 'mx' },
    { display: 'Mixed weathered and trampled', value: 'mx_trmp' },
    { display: 'Trampled', value: 'trmp' },
    { display: 'Unweathered', value: 'unwe' },
    { display: 'Unweathered and trampled', value: 'unwe_trmp' },
    { display: 'Weathered', value: 'we' },
    { display: 'Weathered and trampled', value: 'we_trmp' },
  ]

  const partConcentrationOptions = [
    emptyOption,
    '1-10/m2',
    '10-100/m2',
    '100-1000/m2',
    '>1000/m2',
    '<1/100m2',
    '1-10/100m2',
    '1-10/m3',
    '10-100/m3',
    '100-1000/m3',
    '1000-10000/m3',
    '>10000/m3',
    '<1/100m3',
    '1-10/100m3',
    '<10^2/cm3',
    '10^2-10^3/cm3',
    '10^3-10^4/cm3',
    '10^4-10^5/cm3',
    '10^5-10^6/cm3',
    '>10^6/cm3',
    { display: 'Isolated occurrence', value: 'isol_occur' },
  ]

  const assemblageComponentSizeOptions = [emptyOption, 'both', 'macro', 'micro']

  const timeRepresentedOptions = [
    emptyOption,
    '<1',
    '1-10^1',
    '10^1-10^2',
    '10^2-10^3',
    '10^3-10^4',
    '10^4-10^5',
    '10^5-10^6',
    '>10^6',
  ]

  const vertebratePreservationOptions = [
    emptyOption,
    'artic_pts',
    'assoc_pts',
    'compression',
    'delic_frags',
    'disartic_pts',
    'isol_teeth',
    'mixed_assem',
    'not_known',
  ]

  const unbiasedCollectingOptions = [emptyOption, { display: 'Yes', value: 'y' }, { display: 'No', value: 'n' }]

  const speciesListCompleteOptions = [emptyOption, { display: 'Yes', value: 'y' }, { display: 'No', value: 'n' }]

  const fossilAssemblage = [
    ['Assemblage Formation', dropdown('assem_fm', assemblageFormationOptions, 'Assemblage Formation')],
    ['Transport', dropdown('transport', transportOptions, 'Transport')],
    ['Abrasion', dropdown('trans_mod', abrasionOptions, 'Abrasion')],
    ['Weathering / Trampling', dropdown('weath_trmp', weatheringTramplingOptions, 'Weathering / Trampling')],
    ['Part Concentration', dropdown('pt_conc', partConcentrationOptions, 'Part Concentration')],
    ['Assemblage Component Size', dropdown('size_type', assemblageComponentSizeOptions, 'Assemblage Component Size')],
  ]

  const taphonomy = [
    ['Time Represented (years)', dropdown('time_rep', timeRepresentedOptions, 'Time Represented (years)')],
    ['Vertebrate Preservation', dropdown('vert_pres', vertebratePreservationOptions, 'Vertebrate Preservation')],
    ['Approx. Number of Specimens', textField('appr_num_spm')],
    ['Exact Number of Specimens', textField('num_spm')],
    ['Number of Quadrats', textField('num_quad')],
    ['Unbiased Collecting', dropdown('true_quant', unbiasedCollectingOptions, 'Unbiased Collecting')],
    ['Species List Complete', dropdown('complete', speciesListCompleteOptions, 'Species List Complete')],
  ]

  const columns: MRT_ColumnDef<CollectingMethod>[] = [
    {
      accessorKey: 'coll_meth',
      header: 'Collecting Methods',
    },
  ]

  const editingForm = (
    <EditingForm
      formFields={[{ name: 'coll_meth', label: 'Collection method', required: true }]}
      buttonText="Add collecting method"
      arrayFieldName="now_coll_meth"
    />
  )

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={fossilAssemblage} title="Fossil Assemblage" />
        <ArrayFrame half array={taphonomy} title="Taphonomy" />
      </HalfFrames>

      <HalfFrames>
        <Grouped title="Collecting Methods">
          {!mode.read && editingForm}
          <EditableTable<Editable<CollectingMethod>, LocalityDetailsType> columns={columns} field="now_coll_meth" />
        </Grouped>
        <></>
      </HalfFrames>
    </>
  )
}
