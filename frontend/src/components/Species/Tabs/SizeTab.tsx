import { Box } from '@mui/material'
import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, DataValue } from '@components/DetailView/common/FormComponents'
import { useGetEditableTextField, useGetMultiSelection } from '@components/DetailView/hooks'

export const SizeTab = () => {
  const getEditableTextField = useGetEditableTextField<SpeciesDetails>()
  const getMultiSelection = useGetMultiSelection<SpeciesDetails>()

  const textField = (field: keyof SpeciesDetails) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getEditableTextField(field)} />
  )

  const multiSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getMultiSelection({ fieldName: field, options, name })} />
  )

  const snoutVentLengthOptions = ['', '<10cm', '10cm-1m', '1m-2m', '2m-5m', '>5m']

  const sexualDimorphismSizeOptions = ['', 'y', 'n']

  const sexualDimorphismDisplayOptions = ['', 'y', 'n']

  const populationStructureOptions = ['', 'soc', 'sol']

  const size = [
    ['Body Mass (g)', textField('body_mass')],
    ['Brain Mass (g)', textField('brain_mass')],
    ['Snout-Vent Length', multiSelection('sv_length', snoutVentLengthOptions, 'Snout-Vent Length')],
  ]

  const sexualDimorphism = [
    ['Sexual Dimorphism - Size', multiSelection('sd_size', sexualDimorphismSizeOptions, 'Sexual Dimorphism - Size')],
    ['Sexual Dimorphism - Display', multiSelection('sd_display', sexualDimorphismDisplayOptions, 'Sexual Dimorphism - Display')],
  ]

  const population = [
    ['Population Structure', multiSelection('pop_struc', populationStructureOptions, 'Population Structure')],
  ]

  return (
    <Box>
      <ArrayFrame array={size} title="Size" />
      <ArrayFrame array={sexualDimorphism} title="Sexual Dimorphism" />
      <ArrayFrame array={population} title="Population" />
    </Box>
  )
}
