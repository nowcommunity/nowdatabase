import { SpeciesDetailsType } from '@/shared/types'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@components/DetailView/Context/DetailContext'

export const SizeTab = () => {
  const { dropdown, textField } = useDetailContext<SpeciesDetailsType>()

  const snoutVentLengthOptions = [
    '',
    { display: '< 10cm', value: '<10cm' },
    { display: '10cm - 1m', value: '10cm-1m' },
    { display: '1m - 2m', value: '1m-2m' },
    { display: '2m - 5m', value: '2m-5m' },
    { display: '> 5m', value: '>5m' },
  ]

  const sexualDimorphismSizeOptions = ['', { display: 'Yes', value: 'y' }, { display: 'No', value: 'n' }]

  const sexualDimorphismDisplayOptions = ['', { display: 'Yes', value: 'y' }, { display: 'No', value: 'n' }]

  const populationStructureOptions = ['', { display: 'Social', value: 'soc' }, { display: 'Solitary ', value: 'sol' }]

  const size = [
    ['Body Mass (g)', textField('body_mass', { type: 'number' })],
    ['Brain Mass (g)', textField('brain_mass', { type: 'number' })],
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
