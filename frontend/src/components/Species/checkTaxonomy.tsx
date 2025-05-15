import { EditDataType, Species } from '@/shared/types'

export const checkTaxonomy = (editData: EditDataType<Species>, speciesData: Species[]) => {
  const {
    subclass_or_superorder_name,
    order_name,
    suborder_or_superfamily_name,
    family_name,
    subfamily_name,
    genus_name,
    species_name,
    unique_identifier,
  } = editData
  const errors = new Set<string>()

  for (const species of speciesData) {
    if (
      genus_name === species.genus_name &&
      species_name === species.species_name &&
      unique_identifier === species.unique_identifier
    ) {
      return new Set(['The taxon already exists in the database.'])
    }

    if (genus_name === species.genus_name && family_name !== species.family_name) {
      errors.add(`Genus ${genus_name} belongs to family ${species.family_name}, not ${family_name}.`)
    }

    if (family_name === species.family_name && order_name !== species.order_name) {
      errors.add(`Family ${family_name} belongs to order ${species.order_name}, not ${order_name}.`)
    }
  }
  return errors
}
