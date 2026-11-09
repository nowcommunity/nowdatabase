import { EditDataType, Species, SpeciesSynonym } from '@/shared/types'

export type TaxonomySpecies = {
  species_id: number | undefined
  subclass_or_superorder_name: string | null | undefined
  order_name: string | null | undefined
  suborder_or_superfamily_name: string | null | undefined
  family_name: string | null | undefined
  subfamily_name: string | null | undefined
  genus_name: string | null | undefined
  species_name: string | null | undefined
  unique_identifier: string | null | undefined
}

const generateMultipleParentsError = (
  invalidField: string,
  invalidValue1: string | null | undefined,
  invalidValue2: string | null | undefined
) => {
  return `This taxon has several entries for ${invalidField}: ${invalidValue1}, ${invalidValue2}.
Please contact the NOW administration to fix this taxonomy.`
}

const isDuplicateTaxon = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  if (
    // the check for undefined species_id is here to make sure you cannot add two new,
    // identical species at the same time (e.g. in Locality -> Occurrence -> Create new occurrence)
    ((newSpecies.species_id === undefined && existingSpecies.species_id === undefined) ||
      newSpecies.species_id !== existingSpecies.species_id) &&
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.species_name === existingSpecies.species_name &&
    newSpecies.unique_identifier === existingSpecies.unique_identifier
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

const speciesEqualsUniqueIdentifier = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.genus_name === existingSpecies.genus_name &&
    newSpecies.species_name === existingSpecies.unique_identifier
  )
}

const hasTaxonValue = (value: string | null | undefined) => Boolean(value?.trim())

const checkOrderFamily = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    existingSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    hasTaxonValue(newSpecies.family_name) &&
    hasTaxonValue(existingSpecies.family_name) &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    newSpecies.family_name !== 'fam.' &&
    newSpecies.family_name === existingSpecies.family_name
  )
}

const checkFamilyGenus = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    existingSpecies.family_name !== 'incertae sedis' &&
    newSpecies.subfamily_name !== 'indet.' &&
    hasTaxonValue(newSpecies.genus_name) &&
    hasTaxonValue(existingSpecies.genus_name) &&
    newSpecies.genus_name !== 'indet.' &&
    newSpecies.genus_name !== 'gen.' &&
    newSpecies.genus_name === existingSpecies.genus_name
  )
}

const checkSubClassOrder = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name &&
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    hasTaxonValue(newSpecies.order_name) &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    existingSpecies.subclass_or_superorder_name &&
    newSpecies.order_name === existingSpecies.order_name
  )
}
const checkOrderSubOrder = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    hasTaxonValue(newSpecies.suborder_or_superfamily_name) &&
    newSpecies.suborder_or_superfamily_name &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.suborder_or_superfamily_name === existingSpecies.suborder_or_superfamily_name
  )
}

const checkSubOrderFamily = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    hasTaxonValue(newSpecies.family_name) &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    existingSpecies.suborder_or_superfamily_name &&
    hasTaxonValue(existingSpecies.family_name) &&
    newSpecies.family_name === existingSpecies.family_name
  )
}

const checkFamilySubFamily = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    hasTaxonValue(newSpecies.subfamily_name) &&
    newSpecies.subfamily_name &&
    newSpecies.subfamily_name !== 'indet.' &&
    newSpecies.subfamily_name === existingSpecies.subfamily_name
  )
}

const checkSubFamilyGenus = (newSpecies: EditDataType<Species>, existingSpecies: TaxonomySpecies) => {
  return (
    newSpecies.subclass_or_superorder_name !== 'indet.' &&
    newSpecies.order_name !== 'indet.' &&
    newSpecies.order_name !== 'incertae sedis' &&
    newSpecies.suborder_or_superfamily_name !== 'indet.' &&
    newSpecies.family_name !== 'indet.' &&
    newSpecies.family_name !== 'incertae sedis' &&
    hasTaxonValue(newSpecies.genus_name) &&
    hasTaxonValue(existingSpecies.genus_name) &&
    newSpecies.subfamily_name &&
    newSpecies.subfamily_name !== 'indet.' &&
    newSpecies.genus_name !== 'indet.' &&
    newSpecies.genus_name !== 'gen.' &&
    existingSpecies.subfamily_name &&
    newSpecies.genus_name === existingSpecies.genus_name
  )
}

export const checkSpeciesTaxonomy = (
  newSpecies: EditDataType<Species>,
  existingSpeciesArray: TaxonomySpecies[],
  synonyms: SpeciesSynonym[],
  options: {
    allowTaxonomyHierarchyMismatch?: boolean
    onTaxonomyHierarchyMismatch?: (errors: string[]) => void
  } = {}
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
  const hierarchyErrors = new Set<string>()
  const addHierarchyError = (error: string) => {
    hierarchyErrors.add(error)
    errors.add(error)
  }
  const getErrors = () => {
    if (hierarchyErrors.size > 0) options.onTaxonomyHierarchyMismatch?.([...hierarchyErrors])
    return errors
  }
  let speciesWithSameOrder = undefined
  let speciesWithSameFamily = undefined
  let speciesWithSameGenus = undefined
  let speciesWithSameSuborder = undefined
  let speciesWithSameSubfamily = undefined

  for (const existingSpecies of existingSpeciesArray) {
    if (isDuplicateTaxon(newSpecies, existingSpecies)) {
      errors.add('The taxon already exists in the database.')
      return getErrors()
    }

    const relatedSynonyms =
      existingSpecies.species_id === undefined
        ? []
        : synonyms.filter(syn => syn.species_id === existingSpecies.species_id)
    if (isDuplicateSynonym(newSpecies, relatedSynonyms)) {
      errors.add(
        `${existingSpecies.genus_name} ${existingSpecies.species_name} already has ${genus} ${speciesName} as a synonym.`
      )
      return getErrors()
    }

    if (speciesEqualsUniqueIdentifier(newSpecies, existingSpecies)) {
      errors.add(`The taxon already exists in the database.`)
      errors.add(
        `(${existingSpecies.genus_name} ${existingSpecies.species_name} already has ${newSpecies.species_name} as a unique identifier.)`
      )
      return getErrors()
    }

    if (options.allowTaxonomyHierarchyMismatch) continue

    if (checkOrderFamily(newSpecies, existingSpecies)) {
      if (!speciesWithSameFamily) speciesWithSameFamily = existingSpecies
      if (existingSpecies.order_name !== speciesWithSameFamily.order_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError('order', existingSpecies.order_name, speciesWithSameFamily.order_name)
        )
        return getErrors()
      } else {
        if (newSpecies.order_name !== existingSpecies.order_name) {
          addHierarchyError(`Family ${family} belongs to order ${existingSpecies.order_name}, not ${order}.`)
        }
      }
    }

    if (checkFamilyGenus(newSpecies, existingSpecies)) {
      if (!speciesWithSameGenus) speciesWithSameGenus = existingSpecies
      if (existingSpecies.family_name !== speciesWithSameGenus.family_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError('family', existingSpecies.family_name, speciesWithSameGenus.family_name)
        )
        return getErrors()
      } else {
        if (newSpecies.family_name !== existingSpecies.family_name) {
          addHierarchyError(`Genus ${genus} belongs to family ${existingSpecies.family_name}, not ${family}.`)
        }
      }
    }

    if (checkSubClassOrder(newSpecies, existingSpecies)) {
      if (!speciesWithSameOrder) speciesWithSameOrder = existingSpecies
      if (existingSpecies.subclass_or_superorder_name !== speciesWithSameOrder.subclass_or_superorder_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError(
            'subclass',
            existingSpecies.subclass_or_superorder_name,
            speciesWithSameOrder.subclass_or_superorder_name
          )
        )
        return getErrors()
      } else {
        if (newSpecies.subclass_or_superorder_name !== existingSpecies.subclass_or_superorder_name) {
          addHierarchyError(
            `Order ${order} belongs to subclass ${existingSpecies.subclass_or_superorder_name}, not ${subClass}.`
          )
        }
      }
    }

    if (checkOrderSubOrder(newSpecies, existingSpecies)) {
      if (!speciesWithSameSuborder) speciesWithSameSuborder = existingSpecies
      if (existingSpecies.order_name !== speciesWithSameSuborder.order_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError('order', existingSpecies.order_name, speciesWithSameSuborder.order_name)
        )
        return getErrors()
      } else {
        if (newSpecies.order_name !== existingSpecies.order_name) {
          addHierarchyError(`Suborder ${subOrder} belongs to order ${existingSpecies.order_name}, not ${order}.`)
        }
      }
    }

    if (checkSubOrderFamily(newSpecies, existingSpecies)) {
      if (!speciesWithSameFamily) speciesWithSameFamily = existingSpecies
      if (existingSpecies.suborder_or_superfamily_name !== speciesWithSameFamily.suborder_or_superfamily_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError(
            'suborder',
            existingSpecies.suborder_or_superfamily_name,
            speciesWithSameFamily.suborder_or_superfamily_name
          )
        )
        return getErrors()
      } else {
        if (newSpecies.suborder_or_superfamily_name !== existingSpecies.suborder_or_superfamily_name) {
          addHierarchyError(
            `Family ${family} belongs to suborder ${existingSpecies.suborder_or_superfamily_name}, not ${subOrder}.`
          )
        }
      }
    }

    if (checkFamilySubFamily(newSpecies, existingSpecies)) {
      if (!speciesWithSameSubfamily) speciesWithSameSubfamily = existingSpecies
      if (existingSpecies.family_name !== speciesWithSameSubfamily.family_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError('family', existingSpecies.family_name, speciesWithSameSubfamily.family_name)
        )
        return getErrors()
      } else {
        if (newSpecies.family_name !== existingSpecies.family_name) {
          addHierarchyError(`Subfamily ${subfamily} belongs to family ${existingSpecies.family_name}, not ${family}.`)
        }
      }
    }

    if (checkSubFamilyGenus(newSpecies, existingSpecies)) {
      if (!speciesWithSameGenus) speciesWithSameGenus = existingSpecies
      if (existingSpecies.subfamily_name !== speciesWithSameGenus.subfamily_name) {
        errors.clear()
        addHierarchyError(
          generateMultipleParentsError('subfamily', existingSpecies.subfamily_name, speciesWithSameGenus.subfamily_name)
        )
        return getErrors()
      } else {
        if (newSpecies.subfamily_name !== existingSpecies.subfamily_name) {
          addHierarchyError(`Genus ${genus} belongs to subfamily ${existingSpecies.subfamily_name}, not ${subfamily}.`)
        }
      }
    }
  }
  return getErrors()
}

const convertTaxonomyField = (value: string | null | undefined) => {
  let convertedValue = ''
  if (value) {
    if (!['incertae sedis', 'indet.', 'fam.', 'gen.', 'sp.'].includes(value)) {
      if (value.indexOf('/') !== -1) {
        const words = value.split('/')
        const convertedWord1 = words[0][0].toUpperCase() + words[0].slice(1).toLowerCase()
        const convertedWord2 = words[1][0].toUpperCase() + words[1].slice(1).toLowerCase()
        convertedValue = `${convertedWord1}/${convertedWord2}`
      } else {
        convertedValue = value[0].toUpperCase() + value.slice(1).toLowerCase()
      }
    } else {
      convertedValue = value
    }
  }
  return convertedValue
}

export const convertSpeciesTaxonomyFields = (species: EditDataType<Species>) => {
  const speciesName = species.species_name
  let lowercasedSpeciesName = ''
  if (speciesName) {
    if (speciesName !== 'indet.') {
      lowercasedSpeciesName = speciesName.toLowerCase()
    } else {
      lowercasedSpeciesName = speciesName
    }
  }
  const convertedSpecies = {
    ...species,
    subclass_or_superorder_name: convertTaxonomyField(species.subclass_or_superorder_name),
    order_name: convertTaxonomyField(species.order_name),
    suborder_or_superfamily_name: convertTaxonomyField(species.suborder_or_superfamily_name),
    family_name: convertTaxonomyField(species.family_name),
    subfamily_name: convertTaxonomyField(species.subfamily_name),
    genus_name: convertTaxonomyField(species.genus_name),
    species_name: lowercasedSpeciesName,
  }
  return convertedSpecies as EditDataType<Species>
}

const TAXONOMY_FIELDS: Array<keyof Species> = [
  'subclass_or_superorder_name',
  'order_name',
  'suborder_or_superfamily_name',
  'family_name',
  'subfamily_name',
  'genus_name',
  'species_name',
  'unique_identifier',
  'taxonomic_status',
]

export const hasTaxonomyChanges = (editedSpecies: EditDataType<Species>, originalSpecies: EditDataType<Species>) => {
  return TAXONOMY_FIELDS.some(field => (editedSpecies[field] ?? '') !== (originalSpecies[field] ?? ''))
}

type TaxonomyNullFixable = {
  subclass_or_superorder_name?: string | null | undefined
  suborder_or_superfamily_name?: string | null | undefined
  subfamily_name?: string | null | undefined
  taxonomic_status?: string | null | undefined
}

export const fixNullValuesInTaxonomyFields = <T extends TaxonomyNullFixable>(species: T) => {
  return {
    ...species,
    subclass_or_superorder_name: species.subclass_or_superorder_name ?? '',
    suborder_or_superfamily_name: species.suborder_or_superfamily_name ?? '',
    subfamily_name: species.subfamily_name ?? '',
    taxonomic_status: species.taxonomic_status ?? '',
  }
}

export const convertSynonymTaxonomyFields = (synonym: EditDataType<SpeciesSynonym>) => {
  const synSpeciesName = synonym.syn_species_name
  let lowercasedSynSpeciesName = ''
  if (synSpeciesName) {
    if (synSpeciesName !== 'indet.') {
      lowercasedSynSpeciesName = synSpeciesName.toLowerCase()
    } else {
      lowercasedSynSpeciesName = synSpeciesName
    }
  }
  const convertedSynonym = {
    ...synonym,
    syn_genus_name: convertTaxonomyField(synonym.syn_genus_name),
    syn_species_name: lowercasedSynSpeciesName,
  }
  return convertedSynonym as EditDataType<SpeciesSynonym>
}
