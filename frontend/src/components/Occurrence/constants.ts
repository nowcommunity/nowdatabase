import { emptyOption } from '@/components/DetailView/common/misc'
import { occurrenceDropdownValues } from '@/shared/validators/occurrence'

const idStatusDisplayByValue: Record<string, string> = {
  'family id uncertain': 'family id uncertain',
  'genus id uncertain': 'genus id uncertain',
  'species id uncertain': 'species id uncertain',
}

const quantityDisplayByValue: Record<string, string> = {
  a: 'Abundant',
  c: 'Common',
  r: 'Rare',
  v: 'Very rare',
}

const mesowearDisplayByValue: Record<string, string> = {
  bil: 'Abrasion-dominated',
  mix: 'Mixed-dominated',
  att: 'Attrition-dominated',
  unw: 'Unworn',
}

const microwearDisplayByValue: Record<string, string> = {
  pit_dom: 'Pits predominant',
  pit_str: 'Pits and striae appear equally dominant',
  str_dom: 'Striations predominant',
}

const formatDropdownValue = (value: string | null | undefined, displayByValue: Record<string, string>) => {
  if (!value) return '-'
  return displayByValue[value] ?? value
}

export const quantityOptions = [
  emptyOption,
  {
    value: occurrenceDropdownValues.quantity[0],
    display: quantityDisplayByValue[occurrenceDropdownValues.quantity[0]],
  },
  {
    value: occurrenceDropdownValues.quantity[1],
    display: quantityDisplayByValue[occurrenceDropdownValues.quantity[1]],
  },
  {
    value: occurrenceDropdownValues.quantity[2],
    display: quantityDisplayByValue[occurrenceDropdownValues.quantity[2]],
  },
  {
    value: occurrenceDropdownValues.quantity[3],
    display: quantityDisplayByValue[occurrenceDropdownValues.quantity[3]],
  },
]

export const idStatusOptions = [
  emptyOption,
  ...occurrenceDropdownValues.idStatus.map(value => ({ value, display: idStatusDisplayByValue[value] ?? value })),
]

export const mesowearOptions = [
  emptyOption,
  {
    value: occurrenceDropdownValues.mesowear[0],
    display: mesowearDisplayByValue[occurrenceDropdownValues.mesowear[0]],
  },
  {
    value: occurrenceDropdownValues.mesowear[1],
    display: mesowearDisplayByValue[occurrenceDropdownValues.mesowear[1]],
  },
  {
    value: occurrenceDropdownValues.mesowear[2],
    display: mesowearDisplayByValue[occurrenceDropdownValues.mesowear[2]],
  },
  {
    value: occurrenceDropdownValues.mesowear[3],
    display: mesowearDisplayByValue[occurrenceDropdownValues.mesowear[3]],
  },
]

export const microwearOptions = [
  emptyOption,
  {
    value: occurrenceDropdownValues.microwear[0],
    display: microwearDisplayByValue[occurrenceDropdownValues.microwear[0]],
  },
  {
    value: occurrenceDropdownValues.microwear[1],
    display: microwearDisplayByValue[occurrenceDropdownValues.microwear[1]],
  },
  {
    value: occurrenceDropdownValues.microwear[2],
    display: microwearDisplayByValue[occurrenceDropdownValues.microwear[2]],
  },
]

export const formatIdStatus = (value: string | null | undefined) => formatDropdownValue(value, idStatusDisplayByValue)
export const formatQuantity = (value: string | null | undefined) => formatDropdownValue(value, quantityDisplayByValue)
export const formatMesowear = (value: string | null | undefined) => formatDropdownValue(value, mesowearDisplayByValue)
export const formatMicrowear = (value: string | null | undefined) => formatDropdownValue(value, microwearDisplayByValue)

export const calculateNormalizedMesowearScore = (
  value: number | null | undefined,
  min: number | null | undefined,
  max: number | null | undefined
) => {
  if (value === null || value === undefined || min === null || min === undefined || max === null || max === undefined)
    return null

  const scale = max - min
  if (scale <= 0) return null

  return ((value - min) / scale) * 100
}
