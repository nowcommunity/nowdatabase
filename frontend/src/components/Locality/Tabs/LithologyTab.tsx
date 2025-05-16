import { Editable, LocalityDetailsType, SedimentaryStructure, SedimentaryStructureValues } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { emptyOption } from '@/components/DetailView/common/misc'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { ArrayFrame, HalfFrames, Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSedimentaryStructuresQuery } from '@/redux/sedimentaryStructureReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_ColumnDef } from 'material-react-table'

export const LithologyTab = () => {
  const { mode, textField, dropdown, editData, setEditData, bigTextField } = useDetailContext<LocalityDetailsType>()
  const { data: sedimentaryStructuresData, isError } = useGetAllSedimentaryStructuresQuery(
    mode.read ? skipToken : undefined
  )

  const rockTypeOptions = [
    emptyOption,
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
    emptyOption,
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
    emptyOption,
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
    emptyOption,
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
    emptyOption,
    { display: 'FC: Floodplain Channel', value: 'FC' },
    { display: 'FP: Floodplain', value: 'FP' },
    { display: 'FL: Float', value: 'FL' },
    { display: 'MC: Major Channel', value: 'MC' },
    { display: 'SD: Sheet Deposit', value: 'SD' },
    'multiple',
    'unknown',
  ]

  const depoContext2Options = [
    emptyOption,
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
    emptyOption,
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
    emptyOption,
    { display: 'MC-U2a: Coarse-grained', value: 'MC-U2a' },
    { display: 'MC-U2b: Fine-grained', value: 'MC-U2b' },
    { display: 'MC-U3a: Coarse-grained', value: 'MC-U3a' },
    { display: 'MC-U3b: Fine-grained', value: 'MC-U3b' },
    'multiple',
  ]

  const lithology = [
    ['Rock Type', dropdown('rock_type', rockTypeOptions, 'Rock Type')],
    ['Short Descriptor', textField('rt_adj')],
    ['Comments', bigTextField('lith_comm')],
  ]

  const sedimentryEnvironment = [
    ['General', dropdown('sed_env_1', generalOptions, 'General')],
    ['Specific', dropdown('sed_env_2', specificOptions, 'Specific')],
    ['GeneralEvent / Circumstance', dropdown('event_circum', circumstanceOptions, 'Event / Circumstance')],
    ['Comments', bigTextField('se_comm')],
  ]

  const depositionalContext = [
    ['Depo Context 1', dropdown('depo_context1', depoContext1Options, 'Depo Context 1')],
    ['Depo Context 2', dropdown('depo_context2', depoContext2Options, 'Depo Context 2')],
    ['Depo Context 3', dropdown('depo_context3', depoContext3Options, 'Depo Context 3')],
    ['Depo Context 4', dropdown('depo_context4', depoContext4Options, 'Depo Context 4')],
    ['Comments', bigTextField('depo_comm')],
  ]

  const columns: MRT_ColumnDef<SedimentaryStructure>[] = [
    {
      accessorKey: 'sed_struct',
      header: 'Sedimentary Structure',
    },
  ]

  const selectingTableColumns: MRT_ColumnDef<SedimentaryStructureValues>[] = [
    {
      header: 'Sedimentary structure',
      accessorKey: 'ss_value',
    },
  ]

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={lithology} title="Lithology" />
        <ArrayFrame half array={sedimentryEnvironment} title="Sedimentry Environment" />
      </HalfFrames>
      <HalfFrames>
        <Grouped title="Sedimentary Structure & Taphonomic Detail">
          {!mode.read && (
            <>
              <SelectingTable<SedimentaryStructureValues, LocalityDetailsType>
                buttonText="Select Sedimentary structure"
                isError={isError}
                columns={selectingTableColumns}
                data={sedimentaryStructuresData}
                fieldName="now_ss"
                idFieldName="ss_value"
                editingAction={(newSed: SedimentaryStructureValues) => {
                  setEditData({
                    ...editData,
                    now_ss: [...editData.now_ss, { lid: editData.lid!, sed_struct: newSed.ss_value, rowState: 'new' }],
                  })
                }}
                selectedValues={editData.now_ss.map(ss => ss.sed_struct ?? '')} // TODO ss.sed_struct may be null. is empty string ok default?
              />
            </>
          )}
          <EditableTable<Editable<SedimentaryStructure>, LocalityDetailsType> columns={columns} field="now_ss" />
        </Grouped>
        <ArrayFrame half array={depositionalContext} title="Depositional Context" />
      </HalfFrames>
    </>
  )
}
