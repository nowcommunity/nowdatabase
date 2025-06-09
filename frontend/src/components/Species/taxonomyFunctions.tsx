import { EditDataType, Species, SpeciesSynonym } from '@/shared/types'

const isDuplicateTaxon = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  if (
    newSpecies.species_id !== existingSpecies.species_id &&
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.species_name === existingSpecies.species_name &&
    newSpecies.unique_identifier === existingSpecies.unique_identifier &&
    !(newSpecies.genus_name === 'indet.' || newSpecies.species_name === 'indet.')
  ) {
    return true
  }

  return false
}

const isDuplicateSynonym = (newSpecies: EditDataType<Species>, existingSynonyms: SpeciesSynonym[]) => {
  for (const synonym of existingSynonyms) {
    if (synonym.syn_genus_name === newSpecies.genus_name && synonym.syn_species_name === newSpecies.species_name) {
      return true
    }
  }
}

const speciesEqualsUniqueIdentifier = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.species_name === existingSpecies.unique_identifier
  )
}

const checkOrderFamily = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    newSpecies.family_name === existingSpecies.family_name &&
    newSpecies.order_name !== existingSpecies.order_name
  )
}

const checkFamilyGenus = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    newSpecies.subfamily_name !== 'indet.' &&
    newSpecies.genus_name !== 'indet.' &&
    newSpecies.genus_name !== 'gen.' &&
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.family_name !== existingSpecies.family_name
  )
}

const checkSubClassOrder = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name &&
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    existingSpecies.subclass_or_superorder_name &&
    newSpecies.order_name === existingSpecies.order_name &&
    newSpecies.subclass_or_superorder_name !== existingSpecies.subclass_or_superorder_name
  )
}
const checkOrderSubOrder = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.suborder_or_superfamily_name === existingSpecies.suborder_or_superfamily_name &&
    newSpecies.order_name !== existingSpecies.order_name
  )
}

const checkSubOrderFamily = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    existingSpecies.suborder_or_superfamily_name &&
    newSpecies.family_name === existingSpecies.family_name &&
    newSpecies.suborder_or_superfamily_name !== existingSpecies.suborder_or_superfamily_name
  )
}

const checkFamilySubFamily = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    newSpecies.subfamily_name &&
    newSpecies.subfamily_name !== 'indet.' &&
    newSpecies.subfamily_name === existingSpecies.subfamily_name &&
    newSpecies.family_name !== existingSpecies.family_name
  )
}

const checkSubFamilyGenus = (newSpecies: EditDataType<Species>, existingSpecies: Species) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    newSpecies.subfamily_name &&
    newSpecies.subfamily_name !== 'indet.' &&
    newSpecies.genus_name !== 'indet.' &&
    newSpecies.genus_name !== 'gen.' &&
    existingSpecies.subfamily_name &&
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.subfamily_name !== existingSpecies.subfamily_name
  )
}

export const checkTaxonomy = (
  newSpecies: EditDataType<Species>,
  existingSpeciesArray: Species[],
  synonyms: SpeciesSynonym[]
) => {
  const {
    subclass_or_superorder_name: subClass,
    order_name: order,
    suborder_or_superfamily_name: subOrder,
    family_name: family,
    subfamily_name: subfamily,
    genus_name: genus,
    species_name: speciesName,
  } = newSpecies

  const errors = new Set<string>()

  for (const existingSpecies of existingSpeciesArray) {
    if (isDuplicateTaxon(newSpecies, existingSpecies)) {
      errors.add('The taxon already exists in the database.')
      return errors
    }

    const relatedSynonyms = synonyms.filter(syn => syn.species_id === existingSpecies.species_id)
    if (isDuplicateSynonym(newSpecies, relatedSynonyms)) {
      errors.add(
        `${existingSpecies.genus_name} ${existingSpecies.species_name} already has ${genus} ${speciesName} as a synonym.`
      )
      return errors
    }

    if (speciesEqualsUniqueIdentifier(newSpecies, existingSpecies)) {
      errors.add(`The taxon already exists in the database.`)
      errors.add(
        `(${existingSpecies.genus_name} ${existingSpecies.species_name} already has ${newSpecies.species_name} as a unique identifier.)`
      )
      return errors
    }

    if (checkOrderFamily(newSpecies, existingSpecies)) {
      errors.add(`Family ${family} belongs to order ${existingSpecies.order_name}, not ${order}.`)
    }

    if (checkFamilyGenus(newSpecies, existingSpecies)) {
      errors.add(`Genus ${genus} belongs to family ${existingSpecies.family_name}, not ${family}.`)
    }

    if (checkSubClassOrder(newSpecies, existingSpecies)) {
      errors.add(`Order ${order} belongs to subclass ${existingSpecies.subclass_or_superorder_name}, not ${subClass}.`)
    }

    if (checkOrderSubOrder(newSpecies, existingSpecies)) {
      errors.add(`Suborder ${subOrder} belongs to order ${existingSpecies.order_name}, not ${order}.`)
    }

    if (checkSubOrderFamily(newSpecies, existingSpecies)) {
      errors.add(
        `Family ${family} belongs to suborder ${existingSpecies.suborder_or_superfamily_name}, not ${subOrder}.`
      )
    }

    if (checkFamilySubFamily(newSpecies, existingSpecies)) {
      errors.add(`Subfamily ${subfamily} belongs to family ${existingSpecies.family_name}, not ${family}.`)
    }

    if (checkSubFamilyGenus(newSpecies, existingSpecies)) {
      errors.add(`Genus ${genus} belongs to subfamily ${existingSpecies.subfamily_name}, not ${subfamily}.`)
    }
  }
  return errors
}

export const convertTaxonomyFields = (species: EditDataType<Species>) => {
  const subClass = species.subclass_or_superorder_name
  const capitalizedSubClass = subClass ? subClass[0].toUpperCase() + subClass.slice(1).toLowerCase() : ''

  const order = species.order_name
  let capitalizedOrder = ''
  if (order) {
    if (order !== 'indet.' && order !== 'incertae sedis') {
      capitalizedOrder = order[0].toUpperCase() + order.slice(1).toLowerCase()
    } else {
      capitalizedOrder = order
    }
  }

  const subOrder = species.suborder_or_superfamily_name
  const capitalizedSubOrder = subOrder ? subOrder[0].toUpperCase() + subOrder.slice(1).toLowerCase() : ''

  const family = species.family_name
  let capitalizedFamily = ''
  if (family) {
    if (family !== 'fam.' && family !== 'indet.' && family !== 'incertae sedis') {
      capitalizedFamily = family[0].toUpperCase() + family.slice(1).toLowerCase()
    } else {
      capitalizedFamily = family
    }
  }

  const subFamily = species.subfamily_name
  const capitalizedSubfamily = subFamily ? subFamily[0].toUpperCase() + subFamily.slice(1).toLowerCase() : ''

  const genus = species.genus_name
  let capitalizedGenus = ''
  if (genus) {
    if (genus !== 'gen.' && genus !== 'indet.') {
      capitalizedGenus = genus[0].toUpperCase() + genus.slice(1).toLowerCase()
    } else {
      capitalizedGenus = genus
    }
  }

  const speciesName = species.species_name
  let lowercasedSpeciesName = ''
  if (speciesName) {
    if (speciesName !== 'indet.') {
      lowercasedSpeciesName = speciesName.toLowerCase()
    } else {
      lowercasedSpeciesName = speciesName
    }
  }

  return {
    ...species,
    subclass_or_superorder_name: capitalizedSubClass,
    order_name: capitalizedOrder,
    suborder_or_superfamily_name: capitalizedSubOrder,
    family_name: capitalizedFamily,
    subfamily_name: capitalizedSubfamily,
    genus_name: capitalizedGenus,
    species_name: lowercasedSpeciesName,
  } as EditDataType<Species>
}
