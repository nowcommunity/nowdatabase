import { Box } from '@mui/material'
import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, DataValue } from '@components/DetailView/common/FormComponents'
import { useGetMultiSelection } from '@components/DetailView/hooks'

export const DietTab = () => {
  const getMultiSelection = useGetMultiSelection<SpeciesDetails>()

  const multiSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getMultiSelection({ fieldName: field, options, name })} />
  )

  const diet1Options = ['', 'animal', 'omnivore', 'plant']

  const diet2Options = ['', 'carnivore', 'herbivore', 'invert',
    'omnivore', 'piscivore']

  const diet3Options = ['', 'anim_dom', 'br/gr', 'browse', 'cortex',
  'exudates', 'fr_grass', 'fr-se-res', 'fruit', 'gran', 'graze',
  'h_fruit', 'hard', 'insect_dom', 'm/bone', 'meat', 'meat_only', 'mixed',
  'myrmec', 'plant_dom', 'roots', 'seeds', 'soft']

  const relativeFibreContentOptions = ['', 'h', 'l', 'm']

  const selectivityOptions = ['', 's', 'u']

  const digestionOptions = ['', 'fg', 'hg', 'ru']

  const huntForageOptions = ['', 'ambush', 'dig', 'pounce/p', 'pursuit']

  const diet = [
    ['Diet 1', multiSelection('diet1', diet1Options, 'Diet 1')],
    ['Diet 2', multiSelection('diet2', diet2Options, 'Diet 2')],
    ['Diet 3', multiSelection('diet3', diet3Options, 'Diet 3')],
    ['Relative Fibre Content', multiSelection('rel_fib', relativeFibreContentOptions, 'Relative Fibre Content')],
    ['Selectivity', multiSelection('selectivity', selectivityOptions, 'Selectivity')],
    ['Digestion', multiSelection('digestion', digestionOptions, 'Digestion')],
    ['Hunt/Forage', multiSelection('hunt_forage', huntForageOptions, 'Hunt/Forage')],
  ]

  return (
    <Box>
      <ArrayFrame array={diet} title="Diet Information" />
    </Box>
  )
}
