import { SpeciesDetailsType } from '@/shared/types'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const DietTab = () => {
  const { dropdown } = useDetailContext<SpeciesDetailsType>()

  const diet1Options = [
    emptyOption,
    { display: 'Animal', value: 'a' },
    { display: 'Plant', value: 'p' },
    { display: 'Omnivore', value: 'o' },
  ]

  const diet2Options = [
    emptyOption,
    { display: 'Carnivore', value: 'carnivore' },
    { display: 'Herbivore', value: 'herbivore' },
    { display: 'Invertivore', value: 'invert' },
    { display: 'Omnivore', value: 'omnivore' },
    { display: 'Piscivore', value: 'piscivore' },
  ]

  const diet3Options = [
    emptyOption,
    { display: 'Fresh-grass grazers', value: 'fr_grass' },
    { display: 'Grazer (>90% grass)', value: 'graze' },
    { display: 'Mixed browser/grazer', value: 'br_gr' },
    { display: 'Primarily feed on dicot leaves (folivores)', value: 'browse' },
    { display: 'Bark (tree bark)', value: 'cortex' },
    { display: 'Exudates: Includes gum, resin, nectar, etc.', value: 'exudates' },
    { display: 'Combination of fruit, seed, and exudates', value: 'fr-se-res' },
    { display: 'Fruits (fruit)', value: 'fruit' },
    { display: 'Fruits (h_fruit)', value: 'h_fruit' },
    { display: 'Roots', value: 'roots' },
    { display: 'Granivore (gran)', value: 'gran' },
    { display: 'Seeds (seeds)', value: 'seeds' },
    { display: 'Omnivores, plant foods dominant', value: 'plant_dom' },
    {
      display:
        'Omnivores that consume roughly equal proportions of animal and plant foods, with animal food being dominant',
      value: 'anim_dom',
    },
    { display: 'Omnivores, insects dominant', value: 'insect_dom' },
    { display: 'Meat and specialists on bone consumption (e.g., Hyaena)', value: 'm/bone' },
    { display: 'Meat predominant, but take other animal, some plant foods', value: 'meat' },
    { display: 'Meat specialists, do not eat other foods', value: 'meat_only' },
    { display: 'Molluscivores -- specialists', value: 'hard' },
    { display: 'Soft and hard invertebrate food', value: 'mixed' },
    { display: 'Myrmecophages (ant & termite specialists)', value: 'myrmec' },
    { display: 'Soft invertebrate food', value: 'soft' },
  ]

  const relativeFibreContentOptions = [
    emptyOption,
    { display: 'High level of fibre', value: 'h' },
    { display: 'Medium level of fibre', value: 'm' },
    { display: 'Low level of fibre', value: 'l' },
  ]

  const selectivityOptions = [
    emptyOption,
    { display: 'Feeds selectively', value: 's' },
    { display: 'Feeds unselectively', value: 'u' },
  ]

  const digestionOptions = [
    emptyOption,
    { display: 'Hindgut fermenter', value: 'hg' },
    { display: 'Foregut fermenter', value: 'fg' },
    { display: 'True ruminant', value: 'ru' },
  ]

  const huntForageOptions = [
    emptyOption,
    { display: 'Ambush', value: 'ambush' },
    { display: 'Dig', value: 'dig' },
    { display: 'Pounce/Pursuit', value: 'pounce/p' },
    { display: 'Pursuit', value: 'pursuit' },
  ]

  const diet = [
    ['Diet 1', dropdown('diet1', diet1Options, 'Diet 1')],
    ['Diet 2', dropdown('diet2', diet2Options, 'Diet 2')],
    ['Diet 3', dropdown('diet3', diet3Options, 'Diet 3')],
    ['Relative Fibre Content', dropdown('rel_fib', relativeFibreContentOptions, 'Relative Fibre Content')],
    ['Selectivity', dropdown('selectivity', selectivityOptions, 'Selectivity')],
    ['Digestion', dropdown('digestion', digestionOptions, 'Digestion')],
    ['Hunting or foraging mode for carnivores', dropdown('hunt_forage', huntForageOptions, 'Hunt/Forage')],
  ]

  return (
    <>
      <ArrayFrame array={diet} title="Diet Information" />
    </>
  )
}
