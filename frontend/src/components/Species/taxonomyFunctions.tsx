import { EditDataType, Species } from '@/shared/types'

export const checkTaxonomy = (editData: EditDataType<Species>, speciesData: Species[]) => {
  const { order_name, family_name, genus_name, species_name, unique_identifier } = editData
  const errors = new Set<string>()

  for (const species of speciesData) {
    if (
      genus_name === species.genus_name &&
      species_name === species.species_name &&
      unique_identifier === species.unique_identifier
    ) {
      errors.add('The taxon already exists in the database.')
      return errors
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

export const convertTaxonomyFields = (speciesEditData: EditDataType<Species>) => {
  const capitalizedSubClass = speciesEditData.subclass_or_superorder_name
    ? speciesEditData.subclass_or_superorder_name[0].toUpperCase() +
      speciesEditData.subclass_or_superorder_name.slice(1)
    : ''
  const capitalizedOrder = speciesEditData.order_name
    ? speciesEditData.order_name[0].toUpperCase() + speciesEditData.order_name.slice(1)
    : ''
  const capitalizedSubOrder = speciesEditData.suborder_or_superfamily_name
    ? speciesEditData.suborder_or_superfamily_name[0].toUpperCase() +
      speciesEditData.suborder_or_superfamily_name.slice(1)
    : ''

  const capitalizedFamily = speciesEditData.family_name
    ? speciesEditData.family_name[0].toUpperCase() + speciesEditData.family_name.slice(1)
    : ''

  const capitalizedSubfamily = speciesEditData.subfamily_name
    ? speciesEditData.subfamily_name[0].toUpperCase() + speciesEditData.subfamily_name.slice(1)
    : ''
  const capitalizedGenus = speciesEditData.genus_name
    ? speciesEditData.genus_name[0].toUpperCase() + speciesEditData.genus_name.slice(1)
    : ''
  const lowercasedSpecies = speciesEditData.species_name ? speciesEditData.species_name.toLowerCase() : ''

  return {
    ...speciesEditData,
    subclass_or_superorder_name: capitalizedSubClass,
    order_name: capitalizedOrder,
    suborder_or_superfamily_name: capitalizedSubOrder,
    family_name: capitalizedFamily,
    subfamily_name: capitalizedSubfamily,
    genus_name: capitalizedGenus,
    species_name: lowercasedSpecies,
  } as EditDataType<Species>
}
