import { EditDataType, Species } from '@/shared/types'

export const checkTaxonomy = (editData: EditDataType<Species>, speciesData: Species[]) => {
  const {
    subclass_or_superorder_name: subClass,
    order_name: order,
    suborder_or_superfamily_name: subOrder,
    family_name: family,
    subfamily_name: subfamily,
    genus_name: genus,
    species_name: speciesName,
    unique_identifier,
    species_id,
  } = editData
  const errors = new Set<string>()

  for (const species of speciesData) {
    if (
      species_id !== species.species_id &&
      genus === species.genus_name &&
      speciesName === species.species_name &&
      unique_identifier === species.unique_identifier &&
      !(genus === 'indet.' || speciesName === 'indet.')
    ) {
      errors.add('The taxon already exists in the database.')
      return errors
    }

    if (genus !== 'indet.' && speciesName !== 'indet.') {
      if (subClass !== '' && species.subclass_or_superorder_name) {
        if (order === species.order_name && subClass !== species.subclass_or_superorder_name) {
          errors.add(`Order ${order} belongs to subclass ${species.subclass_or_superorder_name}, not ${subClass}.`)
        }
      }

      if (subOrder !== '' && species.suborder_or_superfamily_name) {
        if (subOrder === species.suborder_or_superfamily_name && order !== species.order_name) {
          errors.add(`Suborder ${subOrder} belongs to order ${species.order_name}, not ${order}.`)
        }
      }

      if (family === species.family_name && order !== species.order_name) {
        errors.add(`Family ${family} belongs to order ${species.order_name}, not ${order}.`)
      }

      if (subOrder !== '' && species.suborder_or_superfamily_name) {
        if (family === species.family_name && subOrder !== species.suborder_or_superfamily_name) {
          errors.add(`Family ${family} belongs to suborder ${species.suborder_or_superfamily_name}, not ${subOrder}.`)
        }
      }

      if (subfamily !== '' && species.subfamily_name) {
        if (subfamily === species.subfamily_name && family !== species.family_name) {
          errors.add(`Subfamily ${subfamily} belongs to family ${species.family_name}, not ${family}.`)
        }
      }

      if (genus === species.genus_name && family !== species.family_name) {
        errors.add(`Genus ${genus} belongs to family ${species.family_name}, not ${family}.`)
      }

      if (subfamily !== '' && species.subfamily_name) {
        if (genus === species.genus_name && subfamily !== species.subfamily_name) {
          errors.add(`Genus ${genus} belongs to subfamily ${species.subfamily_name}, not ${subfamily}.`)
        }
      }
    }
  }
  return errors
}

export const convertTaxonomyFields = (speciesEditData: EditDataType<Species>) => {
  const subClass = speciesEditData.subclass_or_superorder_name
  const capitalizedSubClass = subClass ? subClass[0].toUpperCase() + subClass.slice(1) : ''

  const order = speciesEditData.order_name
  const capitalizedOrder = order ? order[0].toUpperCase() + order.slice(1) : ''

  const subOrder = speciesEditData.suborder_or_superfamily_name
  const capitalizedSubOrder = subOrder ? subOrder[0].toUpperCase() + subOrder.slice(1) : ''

  const family = speciesEditData.family_name
  let capitalizedFamily = ''
  if (family) {
    if (family !== 'fam.' && family !== 'indet.') {
      capitalizedFamily = family[0].toUpperCase() + family.slice(1)
    } else {
      capitalizedFamily = family
    }
  }

  const subFamily = speciesEditData.subfamily_name
  const capitalizedSubfamily = subFamily ? subFamily[0].toUpperCase() + subFamily.slice(1) : ''

  const genus = speciesEditData.genus_name
  let capitalizedGenus = ''
  if (genus) {
    if (genus !== 'gen.' && genus !== 'indet.') {
      capitalizedGenus = genus[0].toUpperCase() + genus.slice(1)
    } else {
      capitalizedGenus = genus
    }
  }

  const species = speciesEditData.species_name
  let lowercasedSpecies = ''
  if (species) {
    if (species !== 'indet.') {
      lowercasedSpecies = species.toLowerCase()
    } else {
      lowercasedSpecies = species
    }
  }

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
