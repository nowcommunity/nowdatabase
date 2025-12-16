import type { EditingFormSelectOption } from '@/components/DetailView/common/EditingForm'
import { taxonStatusOptions } from '@/shared/taxonStatusOptions'

const mapToSelectOption = (option: (typeof taxonStatusOptions)[number]): EditingFormSelectOption => {
  if (typeof option === 'string') return { value: option, label: option }

  const label = option.optionDisplay ?? option.display ?? `${option.value}`

  return { value: option.value, label }
}

export const taxonStatusSelectOptions: EditingFormSelectOption[] = taxonStatusOptions.map(mapToSelectOption)
