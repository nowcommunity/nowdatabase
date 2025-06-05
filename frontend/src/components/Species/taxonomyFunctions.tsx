import { EditDataType, Species, SpeciesSynonym } from '@/shared/types'

const isDuplicateTaxon = (newSpecies: EditDataType<Species>, existingSpecies: Species, synonyms: SpeciesSynonym[]) => {
  if (
    newSpecies.species_id !== existingSpecies.species_id &&
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.species_name === existingSpecies.species_name &&
    newSpecies.unique_identifier === existingSpecies.unique_identifier &&
    !(newSpecies.genus_name === 'indet.' || newSpecies.species_name === 'indet.')
  ) {
    return true
  }

  for (const synonym of synonyms) {
    if (synonym.syn_genus_name === newSpecies.genus_name && synonym.syn_species_name === newSpecies.species_name) {
      console.log(synonym)
      return true
    }
  }

  return false
}

export const checkTaxonomy = (editData: EditDataType<Species>, speciesData: Species[], synonyms: SpeciesSynonym[]) => {
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

  const checkSubClass = () => {
    return subClass && subClass !== 'indet.'
  }
  const checkOrder = () => {
    return order !== 'indet.' && order !== 'incertae sedis'
  }
  const checkSubOrder = () => {
    return checkOrder() && subOrder && subOrder !== 'indet.'
  }
  const checkFamily = () => {
    return checkOrder() && family !== 'indet.' && family !== 'incertae sedis'
  }
  const checkSubfamily = () => {
    return checkFamily() && subfamily && subfamily !== 'indet.'
  }
  const checkGenus = () => {
    return checkFamily() && genus !== 'indet.'
  }

  const errors = new Set<string>()

  for (const species of speciesData) {
    const relatedSynonyms = synonyms.filter(syn => syn.species_id === species.species_id)
    if (isDuplicateTaxon(editData, species, relatedSynonyms)) {
      errors.add('The taxon already exists in the database.')
      return errors
    }

    if (checkOrder()) {
      if (
        checkSubClass() &&
        species.subclass_or_superorder_name &&
        order === species.order_name &&
        subClass !== species.subclass_or_superorder_name
      ) {
        errors.add(`Order ${order} belongs to subclass ${species.subclass_or_superorder_name}, not ${subClass}.`)
      }
    }

    if (checkSubOrder()) {
      if (subOrder === species.suborder_or_superfamily_name && order !== species.order_name) {
        errors.add(`Suborder ${subOrder} belongs to order ${species.order_name}, not ${order}.`)
      }
    }

    if (checkFamily()) {
      if (family === species.family_name && order !== species.order_name) {
        errors.add(`Family ${family} belongs to order ${species.order_name}, not ${order}.`)
      }
      if (
        checkSubOrder() &&
        species.suborder_or_superfamily_name &&
        family === species.family_name &&
        subOrder !== species.suborder_or_superfamily_name
      ) {
        errors.add(`Family ${family} belongs to suborder ${species.suborder_or_superfamily_name}, not ${subOrder}.`)
      }
    }

    if (checkSubfamily()) {
      if (subfamily === species.subfamily_name && family !== species.family_name) {
        errors.add(`Subfamily ${subfamily} belongs to family ${species.family_name}, not ${family}.`)
      }
    }

    if (checkGenus()) {
      if (genus === species.genus_name && family !== species.family_name) {
        errors.add(`Genus ${genus} belongs to family ${species.family_name}, not ${family}.`)
      }
      if (
        checkSubfamily() &&
        species.subfamily_name &&
        genus === species.genus_name &&
        subfamily !== species.subfamily_name
      ) {
        errors.add(`Genus ${genus} belongs to subfamily ${species.subfamily_name}, not ${subfamily}.`)
      }
    }
  }
  return errors
}

export const convertTaxonomyFields = (speciesEditData: EditDataType<Species>) => {
  const subClass = speciesEditData.subclass_or_superorder_name
  const capitalizedSubClass = subClass ? subClass[0].toUpperCase() + subClass.slice(1).toLowerCase() : ''

  const order = speciesEditData.order_name
  let capitalizedOrder = ''
  if (order) {
    if (order !== 'indet.' && order !== 'incertae sedis') {
      capitalizedOrder = order[0].toUpperCase() + order.slice(1).toLowerCase()
    } else {
      capitalizedOrder = order
    }
  }

  const subOrder = speciesEditData.suborder_or_superfamily_name
  const capitalizedSubOrder = subOrder ? subOrder[0].toUpperCase() + subOrder.slice(1).toLowerCase() : ''

  const family = speciesEditData.family_name
  let capitalizedFamily = ''
  if (family) {
    if (family !== 'fam.' && family !== 'indet.' && family !== 'incertae sedis') {
      capitalizedFamily = family[0].toUpperCase() + family.slice(1).toLowerCase()
    } else {
      capitalizedFamily = family
    }
  }

  const subFamily = speciesEditData.subfamily_name
  const capitalizedSubfamily = subFamily ? subFamily[0].toUpperCase() + subFamily.slice(1).toLowerCase() : ''

  const genus = speciesEditData.genus_name
  let capitalizedGenus = ''
  if (genus) {
    if (genus !== 'gen.' && genus !== 'indet.') {
      capitalizedGenus = genus[0].toUpperCase() + genus.slice(1).toLowerCase()
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
