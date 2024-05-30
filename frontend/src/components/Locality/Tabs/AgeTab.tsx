import { LocalityDetailsType, TimeUnitDetailsType } from '@/backendTypes'
import { FieldWithTableSelection } from '@/components/DetailView/common/editingComponents'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { TimeUnitTable } from '@/components/TimeUnit/TimeUnitTable'

export const AgeTab = () => {
  const { textField, radioSelection, dropdown, bigTextField, editData } = useDetailContext<LocalityDetailsType>()
  const fracOptions = [
    { value: '', display: 'None' },
    'Early half 1:2',
    'Late half 2:2',
    'Early third 1:3',
    'Middle third 2:3',
    'Late third 3:3',
  ]

  const bfa_abs_options = [
    'AAR',
    'Ar/Ar',
    'C14',
    'chemical',
    'Delta_018',
    'ESR',
    'fission_track',
    'K/Ar',
    'obsidian_hyd',
    'other_absolute',
    'other_radiometric',
    'Rb/Sr',
    'Sr/Sr',
    'TL',
    'tree_ring',
    'U-series',
    'U/Th',
  ]

  // TODO: The date_meth options should come from db: distinct(now_loc.date_meth)
  const age = [
    [
      'Dating method',
      radioSelection(
        'date_meth',
        [
          { value: 'time_unit', display: 'Time unit' },
          { value: 'absolute', display: 'Absolute' },
          { value: 'composite', display: 'Composite' },
        ],
        'dating-method'
      ),
    ],
    [''],
    ['', 'Age (Ma)', 'Basis for age (Absolute)', 'Basis for age (Time Unit)', 'Basis for age (Fraction)'],
    [
      'Minimum age',
      textField('min_age', 'number'),
      dropdown('bfa_min_abs', bfa_abs_options, 'Min Basis for age (absolute)', editData.date_meth === 'time_unit'),
      <FieldWithTableSelection<TimeUnitDetailsType, LocalityDetailsType>
        key="bfa_min"
        sourceField="tu_name"
        targetField="bfa_min"
        selectorTable={<TimeUnitTable />}
        disabled={editData.date_meth === 'absolute'}
      />,
      dropdown('frac_min', fracOptions, 'Minimum fraction', editData.date_meth === 'absolute'),
    ],
    [
      'Maximum age',
      textField('max_age', 'number'),
      dropdown('bfa_max_abs', bfa_abs_options, 'Max Basis for age (absolute)', editData.date_meth === 'time_unit'),
      <FieldWithTableSelection<TimeUnitDetailsType, LocalityDetailsType>
        key="bfa_max"
        sourceField="tu_name"
        targetField="bfa_max"
        selectorTable={<TimeUnitTable />}
        disabled={editData.date_meth === 'absolute'}
      />,
      dropdown('frac_max', fracOptions, 'Maximum fraction', editData.date_meth === 'absolute'),
    ],
    [''],
    ['Chronostrathigraphic age', textField('chron')],
    ['Age Comment', bigTextField('age_comm')],
  ]

  const lithostratigraphy = [
    ['Group', textField('lgroup')],
    ['Formation', textField('formation')],
    ['Member', textField('member')],
    ['Bed', textField('bed')],
  ]

  const sampleUnit = [
    ['Datum Plane', textField('datum_plane')],
    ['Top of Sample Unit (m)', textField('tos')],
    ['Bottom of Sample Unit (m)', textField('bos')],
  ]

  const basinInformation = [
    ['Basin', textField('basin')],
    ['Subbasin', textField('subbasin')],
  ]

  return (
    <>
      <ArrayFrame array={age} title="Age" />
      <ArrayFrame array={lithostratigraphy} title="Lithostratigraphy" />
      <HalfFrames>
        <ArrayFrame half array={sampleUnit} title="Sample Unit" />
        <ArrayFrame half array={basinInformation} title="Basin Information" />
      </HalfFrames>
    </>
  )
}
