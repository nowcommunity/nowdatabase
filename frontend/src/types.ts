export enum Role {
  Admin = 1,
  EditUnrestricted = 2,
  EditRestricted = 3,
  NowOffice = 4,
  Project = 5,
  ProjectPrivate = 6,
  ReadOnly = 7,
}

import { EditDataType, LocalityDetailsType } from '../src/backendTypes'

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

export const convertDmsToDec = (dms: string | null | undefined) => {
  if (typeof dms !== 'string') return

  const dmsArray = dms.split(/[^\d\w.]+/)

  const degrees = dmsArray[0]
  const minutes = dmsArray[1]
  const seconds = dmsArray[2]
  const direction = dmsArray[3]

  let dec = Number((Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600).toFixed(12))

  if (direction == 'S' || direction == 'W') {
    dec = dec * -1
  }

  return dec
}

export const convertDecToDms = (dec: number | null | undefined, isLatitude: boolean) => {
  if (typeof dec !== 'number') return

  const absolute = Math.abs(dec)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Number(((minutesNotTruncated - minutes) * 60).toFixed(2))

  let direction = ''
  if (isLatitude) {
    direction = dec >= 0 ? 'N' : 'S'
  } else {
    direction = dec >= 0 ? 'E' : 'W'
  }

  return degrees + ' ' + minutes + ' ' + seconds + ' ' + direction
}
