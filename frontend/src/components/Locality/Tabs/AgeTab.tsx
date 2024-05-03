import { Box } from '@mui/material'
import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame, DataValue } from '@components/DetailView/common/FormComponents'
import { useGetEditableTextField, useGetMultiSelection, useGetRadioSelection } from '@components/DetailView/hooks'

export const AgeTab = () => {
  const getEditableTextField = useGetEditableTextField<LocalityDetails>()
  const getRadioSelection = useGetRadioSelection<LocalityDetails>()
  const getMultiSelection = useGetMultiSelection<LocalityDetails>()

  const textField = (field: keyof LocalityDetails) => (
    <DataValue<LocalityDetails> field={field as keyof LocalityDetails} EditElement={getEditableTextField(field)} />
  )

  const radioSelection = (field: keyof LocalityDetails, options: string[], name: string) => (
    <DataValue<LocalityDetails> field={field as keyof LocalityDetails} EditElement={getRadioSelection({ fieldName: field, options, name })} />
  )

  const multiSelection = (field: keyof LocalityDetails, options: string[], name: string) => (
    <DataValue<LocalityDetails> field={field as keyof LocalityDetails} EditElement={getMultiSelection({ fieldName: field, options, name })} />
  )

  const fracOptions = ['', 'Early half 1:2', 'Late half 2:2', 'Early third 1:3', 'Middle third 2:3', 'Late third 3:3']

  // TODO: The date_meth options should come from db: distinct(now_loc.date_meth)
  const age = [
    ['Dating method', radioSelection('date_meth', ['time_unit', 'absolute', 'composite'], 'dating-method')],
    [''],
    ['Age (Ma)', 'Basis for age (Absolute)', 'Basis for age (Time Unit)', 'Basis for age (Fraction)'],
    ['Minimum age', textField('bfa_min_abs'), textField('bfa_min'), multiSelection('frac_min', fracOptions, 'Minimum fraction')],
    ['Maximum age', textField('bfa_max_abs'), textField('bfa_max'), multiSelection('frac_max', fracOptions, 'Maximum fraction')],
    [''],
    ['Chronostrathigraphic age', textField('chron')],
    ['Age Comment', textField('age_comm')],
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
    <Box>
      <ArrayFrame array={age} title="Age" />
      <ArrayFrame array={lithostratigraphy} title="Lithostratigraphy" />
      <ArrayFrame array={sampleUnit} title="Sample Unit" />
      <ArrayFrame array={basinInformation} title="Basin Information" />
    </Box>
  )
}
