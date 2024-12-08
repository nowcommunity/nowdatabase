import { LocalityDetailsType, TimeUnitDetailsType } from '@/shared/types'
import { BasisForAgeSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { TimeUnitTable } from '@/components/TimeUnit/TimeUnitTable'

export const AgeTab = () => {
  const { textField, radioSelection, dropdown, bigTextField, editData, setEditData } =
    useDetailContext<LocalityDetailsType>()

  const fracOptions = [
    emptyOption,
    { display: 'Early half 1:2', value: '1:2' },
    { display: 'Late half 2:2', value: '2:2' },
    { display: 'Early third 1:3', value: '1:3' },
    { display: 'Middle third 2:3', value: '2:3' },
    { display: 'Late third 3:3', value: '3:3' },
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

  const handleDateMethChange = (value: number | string | boolean) => {
    // this is to satisfy type requirements of handleSetEditData
    if (typeof value !== 'string') return
    setEditData({
      ...editData,
      date_meth: value,
      min_age: undefined,
      bfa_min_abs: '',
      bfa_min: '',
      frac_min: '',
      max_age: undefined,
      bfa_max_abs: '',
      bfa_max: '',
      frac_max: '',
    })
  }

  const minAgeAbsoluteDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_max_abs) ||
    (editData.date_meth === 'composite' && !!editData.bfa_min) ||
    editData.date_meth === 'time_unit'
  const minAgeTimeUnitDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_max) ||
    (editData.date_meth === 'composite' && !!editData.bfa_min_abs) ||
    editData.date_meth === 'absolute'
  const maxAgeAbsoluteDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_min_abs) ||
    (editData.date_meth === 'composite' && !!editData.bfa_max) ||
    editData.date_meth === 'time_unit'
  const maxAgeTimeUnitDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_min) ||
    (editData.date_meth === 'composite' && !!editData.bfa_max_abs) ||
    editData.date_meth === 'absolute'

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
        'dating-method',
        { handleSetEditData: handleDateMethChange }
      ),
    ],
    [''],
    ['', 'Age (Ma)', 'Basis for age (Absolute)', 'Basis for age (Time Unit)', 'Basis for age (Fraction)'],
    [
      'Minimum age',
      textField('min_age', { type: 'number', round: 3, readonly: minAgeAbsoluteDisabled }),
      dropdown('bfa_min_abs', bfa_abs_options, 'Min Basis for age (absolute)', minAgeAbsoluteDisabled),
      <BasisForAgeSelection<TimeUnitDetailsType, LocalityDetailsType>
        key="bfa_min"
        sourceField="tu_name"
        targetField="bfa_min"
        lowBoundField="low_bound"
        upBoundField="up_bound"
        fraction={editData.frac_min}
        selectorTable={<TimeUnitTable />}
        disabled={minAgeTimeUnitDisabled}
      />,
      dropdown('frac_min', fracOptions, 'Minimum fraction', minAgeTimeUnitDisabled),
    ],
    [
      'Maximum age',
      textField('max_age', { type: 'number', round: 3, readonly: maxAgeAbsoluteDisabled }),
      dropdown('bfa_max_abs', bfa_abs_options, 'Max Basis for age (absolute)', maxAgeAbsoluteDisabled),
      <BasisForAgeSelection<TimeUnitDetailsType, LocalityDetailsType>
        key="bfa_max"
        sourceField="tu_name"
        targetField="bfa_max"
        lowBoundField="low_bound"
        upBoundField="up_bound"
        fraction={editData.frac_max}
        selectorTable={<TimeUnitTable />}
        disabled={maxAgeTimeUnitDisabled}
      />,
      dropdown('frac_max', fracOptions, 'Maximum fraction', maxAgeTimeUnitDisabled),
    ],
    [''],
    ['Chronostratigraphic Age', textField('chron')],
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
