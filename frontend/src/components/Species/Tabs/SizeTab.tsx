import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@components/DetailView/hooks'

export const SizeTab = () => {
  const { dropdown, textField } = useDetailContext<SpeciesDetails>()

  const snoutVentLengthOptions = ['', '<10cm', '10cm-1m', '1m-2m', '2m-5m', '>5m']

  const sexualDimorphismSizeOptions = ['', 'y', 'n']

  const sexualDimorphismDisplayOptions = ['', 'y', 'n']

  const populationStructureOptions = ['', 'soc', 'sol']

  const size = [
    ['Body Mass (g)', textField('body_mass')],
    ['Brain Mass (g)', textField('brain_mass')],
    ['Snout-Vent Length', dropdown('sv_length', snoutVentLengthOptions, 'Snout-Vent Length')],
  ]

  const sexualDimorphism = [
    ['Sexual Dimorphism - Size', dropdown('sd_size', sexualDimorphismSizeOptions, 'Sexual Dimorphism - Size')],
    [
      'Sexual Dimorphism - Display',
      dropdown('sd_display', sexualDimorphismDisplayOptions, 'Sexual Dimorphism - Display'),
    ],
  ]

  const population = [
    ['Population Structure', dropdown('pop_struc', populationStructureOptions, 'Population Structure')],
  ]

  return (
    <>
      <ArrayFrame array={size} title="Size" />
      <HalfFrames>
        <ArrayFrame half array={sexualDimorphism} title="Sexual Dimorphism" />
        <ArrayFrame half array={population} title="Population" />
      </HalfFrames>
    </>
  )
}
