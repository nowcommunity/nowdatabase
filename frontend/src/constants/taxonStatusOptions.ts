import type { EditingFormSelectOption } from '@/components/DetailView/common/EditingForm'
import { taxonStatusOptions, type TaxonStatusOption } from '@/shared/taxonStatusOptions'

const mapToSelectOption = (option: TaxonStatusOption): EditingFormSelectOption => {
  if (typeof option === 'string') return { value: option, label: option }
  const label = option.optionDisplay ?? option.display ?? `${option.value}`
  return { value: option.value, label }
}

export const taxonStatusSelectOptions: EditingFormSelectOption[] = taxonStatusOptions.map(mapToSelectOption)
export const taxonStatusSelectLabels = taxonStatusSelectOptions.map(option => option.label)
