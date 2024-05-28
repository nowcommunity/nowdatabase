import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/hooks'

export const AgeTab = () => {
  const { textField, radioSelection, dropdown, bigTextField } = useDetailContext<LocalityDetails>()

  const fracOptions = [
    { value: '', display: 'None' },
    'Early half 1:2',
    'Late half 2:2',
    'Early third 1:3',
    'Middle third 2:3',
    'Late third 3:3',
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
    ['Age (Ma)', 'Basis for age (Absolute)', 'Basis for age (Time Unit)', 'Basis for age (Fraction)'],
    [
      'Minimum age',
      textField('min_age', 'number'),
      textField('bfa_min'),
      dropdown('frac_min', fracOptions, 'Minimum fraction'),
    ],
    ['Maximum age', textField('max_age'), textField('bfa_max'), dropdown('frac_max', fracOptions, 'Maximum fraction')],
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
