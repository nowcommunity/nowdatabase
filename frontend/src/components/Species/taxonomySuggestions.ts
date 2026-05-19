import type { Species } from '@/shared/types'

export type TaxonomySuggestionField =
  | 'subclass_or_superorder_name'
  | 'order_name'
  | 'suborder_or_superfamily_name'
  | 'family_name'
  | 'subfamily_name'
  | 'genus_name'
  | 'species_name'

export const buildTaxonomySuggestionOptions = (
  speciesData: Species[] | undefined,
  field: TaxonomySuggestionField
): string[] => {
  if (!speciesData) return []

  return Array.from(
    speciesData.reduce<Set<string>>((options, species) => {
      const value = species[field]

      if (typeof value === 'string') {
        const trimmedValue = value.trim()
        if (trimmedValue.length > 0) options.add(trimmedValue)
      }

      return options
    }, new Set<string>())
  ).sort((a, b) => a.localeCompare(b))
}
