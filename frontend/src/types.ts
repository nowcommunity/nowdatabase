import { EditDataType, LocalityDetailsType } from './shared/types'

export const calculateMeanHypsodonty = (locality: LocalityDetailsType) => {
  // Mean hypsodonty calculation has been made based on html/include/database.php line 2567 onwards
  const relevantOrderNames = [
    'Perissodactyla',
    'Artiodactyla',
    'Primates',
    'Proboscidea',
    'Hyracoidea',
    'Dinocerata',
    'Embrithopoda',
    'Notoungulata',
    'Astrapotheria',
    'Pyrotheria',
    'Litopterna',
    'Condylarthra',
    'Pantodonta',
  ]

  const thtToValue = {
    bra: 1.0,
    mes: 2.0,
    hyp: 3.0,
    hys: 3.0,
    none: 0.0,
  } as Record<string, number>

  const species = locality.now_ls
    .map(ls => ls.com_species)
    .filter(species => relevantOrderNames.includes(species.order_name))
    .map(species => thtToValue[species.tht ?? 'none'])
  const sum = species.reduce((sum, cur) => sum + cur, 0.0)
  const meanHypsodonty = species.length > 0 ? sum / (species.length * 1.0) : 0.0
  return parseFloat((Math.floor(meanHypsodonty * 100) / 100).toFixed(2))
}

const hominins = [
  'sahelanthropus',
  'orrorin',
  'ardipithecus',
  'kenyanthropus',
  'australopithecus',
  'paranthropus',
  'homo',
]

export const getHomininSkeletalRemains = (locality: EditDataType<LocalityDetailsType>) =>
  !!locality.now_ls.find(
    ({ com_species }) => com_species?.genus_name && hominins.includes(com_species.genus_name.toLowerCase())
  )
