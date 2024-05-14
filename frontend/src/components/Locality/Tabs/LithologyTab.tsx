import { Editable, LocalityDetails, SedimentaryStructure } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '../../DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { EditableTable, EditingModal, Grouped } from '@/components/DetailView/common/FormComponents'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'

export const LithologyTab = () => {
  const { textField, dropdown } = useDetailContext<LocalityDetails>()

  const rockTypeOptions = [
    '',
    'chert',
    'claystone',
    'coal',
    'conglomerate',
    'gravel',
    'grit',
    'limestone',
    'mudstone',
    'sandstone',
    'shale',
    'siltstone',
    'tuff',
  ]

  const generalOptions = [
    '',
    'coastal',
    'deltaic',
    'eolian',
    'fluvial',
    'fluv_deltaic',
    'fluv_lacustr',
    'freshwater',
    'karst',
    'lacustrine',
    'lacustrine_lg',
    'lacustrine_sm',
    'marine',
    'trap',
    'volcanic',
  ]

  const specificOptions = [
    '',
    'ab_chan_fill',
    'alluvial_fan',
    'beach',
    'cave',
    'chan_bar',
    'channel',
    'crev_splay',
    'deep_lake',
    'dry_floodplain',
    'dune',
    'estuary',
    'fissure',
    'floodplain',
    'interdist_bay',
    'interdune',
    'interfluv',
    'lagoon',
    'lake_margin',
    'levee',
    'loess',
    'offshore',
    'overbank',
    'paleosol',
    'raised_bog',
    'shallow_lake',
    'sinkhole',
    'spring',
    'swamp',
    'wet_floodplain',
  ]

  const circumstanceOptions = [
    '',
    'airfall',
    'amber',
    'burrow',
    'coprolite',
    'explosion',
    'flood',
    'midden',
    'mudflow',
    'paleosol',
    'storm',
    'tar',
    'tree_trunk',
  ]

  const depoContext1Options = [
    '',
    { display: 'FC: Floodplain Channel', value: 'FC' },
    { display: 'FP: Floodplain', value: 'FP' },
    { display: 'FL: Float', value: 'FL' },
    { display: 'MC: Major Channel', value: 'MC' },
    { display: 'SD: Sheet Deposit', value: 'SD' },
    'multiple',
    'unknown',
  ]

  const depoContext2Options = [
    '',
    { display: 'FC-C: Complex Fill', value: 'FC-C' },
    { display: 'FC-S: Simple Fill', value: 'FC-S' },
    { display: 'FP-C: Continuous', value: 'FP-C' },
    { display: 'FP-L: Laminated', value: 'FP-L' },
    { display: 'FP-P: Patchy', value: 'FP-P' },
    { display: 'MC-L: Lower', value: 'MC-L' },
    { display: 'MC-U: Upper', value: 'MC-U' },
    'multiple',
  ]

  const depoContext3Options = [
    '',
    { display: 'FC-C1: Basal Lag and Bar', value: 'FC-C1' },
    { display: 'FC-C2: Cross-cutting Lenses', value: 'FC-C2' },
    { display: 'FC-S1: Basal Lag and Bar', value: 'FC-S1' },
    { display: 'FC-S2: Mixed Lithologies', value: 'FC-S2' },
    { display: 'FC-S3: Fine-grained', value: 'FC-S3' },
    { display: 'MC-U1: Channel Bar', value: 'MC-U1' },
    { display: 'MC-U2: Large-scale Channel Fill', value: 'MC-U2' },
    { display: 'MC-U3: Small-scale Channel Fill', value: 'MC-U3' },
    'multiple',
  ]

  const depoContext4Options = [
    '',
    { display: 'MC-U2a: Coarse-grained', value: 'MC-U2a' },
    { display: 'MC-U2b: Fine-grained', value: 'MC-U2b' },
    { display: 'MC-U3a: Coarse-grained', value: 'MC-U3a' },
    { display: 'MC-U3b: Fine-grained', value: 'MC-U3b' },
    'multiple',
  ]

  const lithology = [
    ['Rock Type', dropdown('rock_type', rockTypeOptions, 'Rock Type')],
    ['Short Descriptor', textField('rt_adj')],
    ['Comments', textField('lith_comm')],
  ]

  const sedimentryEnvironment = [
    ['General', dropdown('sed_env_1', generalOptions, 'General')],
    ['Specific', dropdown('sed_env_2', specificOptions, 'Specific')],
    ['GeneralEvent / Circumstance', dropdown('event_circum', circumstanceOptions, 'Event / Circumstance')],
    ['Comments', textField('se_comm')],
  ]

  const depositionalContext = [
    ['Depo Context 1', dropdown('depo_context1', depoContext1Options, 'Depo Context 1')],
    ['Depo Context 2', dropdown('depo_context2', depoContext2Options, 'Depo Context 2')],
    ['Depo Context 3', dropdown('depo_context3', depoContext3Options, 'Depo Context 3')],
    ['Depo Context 4', dropdown('depo_context4', depoContext4Options, 'Depo Context 4')],
    ['Comments', textField('depo_comm')],
  ]

  const { editData, mode } = useDetailContext<LocalityDetails>()
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm()

  const columns: MRT_ColumnDef<SedimentaryStructure>[] = [
    {
      accessorKey: 'sed_struct',
      header: 'Sedimentary Structure',
    },
  ]

  const onSave = async () => {
    // TODO: Saving logic here (add Sedimentary Structure to editData)
    const result = await trigger()
    return result
  }

  const editingModal = (
    <EditingModal buttonText="Add new Sedimentary Structure" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('sed_struct', { required: true })} label="Sedimentary Structure" error={!!errors.sed_struct} required />
      </Box>
    </EditingModal>
  )

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={lithology} title="Lithology" />
        <ArrayFrame half array={sedimentryEnvironment} title="Sedimentry Environment" />
      </HalfFrames>
      <HalfFrames>
        <Grouped title="Sedimentary Structure & Taphonomic Detail">
          {mode === 'edit' && editingModal}
          <EditableTable<Editable<SedimentaryStructure>, LocalityDetails>
            columns={columns}
            data={editData.now_ss}
            editable
            field="now_ss"
          />
        </Grouped>
        <ArrayFrame array={depositionalContext} title="Depositional Context" />
      </HalfFrames>
    </>
  )
}
