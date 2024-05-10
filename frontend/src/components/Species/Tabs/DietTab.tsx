import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame } from '@components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'

export const DietTab = () => {
  
  const { dropdown } = useDetailContext<SpeciesDetails>()

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
    ['Diet 1', dropdown('diet1', diet1Options, 'Diet 1')],
    ['Diet 2', dropdown('diet2', diet2Options, 'Diet 2')],
    ['Diet 3', dropdown('diet3', diet3Options, 'Diet 3')],
    ['Relative Fibre Content', dropdown('rel_fib', relativeFibreContentOptions, 'Relative Fibre Content')],
    ['Selectivity', dropdown('selectivity', selectivityOptions, 'Selectivity')],
    ['Digestion', dropdown('digestion', digestionOptions, 'Digestion')],
    ['Hunt/Forage', dropdown('hunt_forage', huntForageOptions, 'Hunt/Forage')],
  ]

  return (
    <>
      <ArrayFrame array={diet} title="Diet Information" />
    </>
  )
}
