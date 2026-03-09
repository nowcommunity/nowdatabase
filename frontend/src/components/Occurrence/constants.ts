import { emptyOption } from '@/components/DetailView/common/misc'
import { occurrenceDropdownValues } from '@/shared/validators/occurrence'

export const quantityOptions = [
  emptyOption,
  { value: occurrenceDropdownValues.quantity[0], display: 'Abundant' },
  { value: occurrenceDropdownValues.quantity[1], display: 'Common' },
  { value: occurrenceDropdownValues.quantity[2], display: 'Rare' },
  { value: occurrenceDropdownValues.quantity[3], display: 'Very rare' },
]

export const idStatusOptions = [
  emptyOption,
  ...occurrenceDropdownValues.idStatus.map(value => ({ value, display: value })),
]

export const mesowearOptions = [
  emptyOption,
  { value: occurrenceDropdownValues.mesowear[0], display: 'Abrasion-dominated' },
  { value: occurrenceDropdownValues.mesowear[1], display: 'Mixed-dominated' },
  { value: occurrenceDropdownValues.mesowear[2], display: 'Attrition-dominated' },
  { value: occurrenceDropdownValues.mesowear[3], display: 'Unworn' },
]

export const microwearOptions = [
  emptyOption,
  { value: occurrenceDropdownValues.microwear[0], display: 'Pits predominant' },
  { value: occurrenceDropdownValues.microwear[1], display: 'Pits and striae appear equally dominant' },
  { value: occurrenceDropdownValues.microwear[2], display: 'Striations predominant' },
]
