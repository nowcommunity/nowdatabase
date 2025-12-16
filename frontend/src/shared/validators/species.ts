import { taxonStatusOptions } from '../taxonStatusOptions'
import { EditDataType, SpeciesDetailsType } from '../types'
import { Validators, validator } from './validator'

const isEmptyUniqIdentifier = (unique_identifier: string) => {
  if (unique_identifier === '' || unique_identifier === '-') return true
  return false
}

export const validateSpecies = (
  editData: EditDataType<SpeciesDetailsType>,
  fieldName: keyof EditDataType<SpeciesDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<SpeciesDetailsType>>> = {
    subclass_or_superorder_name: {
      name: 'Subclass or Superorder',
      asString: (subClassName: string) => {
        if (subClassName.indexOf(' ') !== -1) return 'Subclass must not contain any spaces.'
        if (subClassName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Subclass must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    order_name: {
      name: 'Order',
      required: true,
      asString: (orderName: string) => {
        if (orderName !== 'incertae sedis' && orderName.indexOf(' ') !== -1)
          return 'Order must not contain any spaces, unless the value is "incertae sedis".'
        if (orderName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Order must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    suborder_or_superfamily_name: {
      name: 'Suborder or Superfamily',
      asString: (subOrderName: string) => {
        if (subOrderName.indexOf(' ') !== -1) return 'Suborder must not contain any spaces.'
        if (subOrderName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Suborder must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    family_name: {
      name: 'Family',
      required: true,
      asString: (familyName: string) => {
        if (familyName !== 'incertae sedis' && familyName.indexOf(' ') !== -1)
          return 'Family must not contain any spaces, unless the value is "incertae sedis".'
        if (familyName !== 'indet.' && editData.order_name === 'indet.')
          return 'when the Family is indet., Genus must also be indet.'
        if (familyName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Family must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    subfamily_name: {
      name: 'Subfamily or Tribe',
      asString: (subFamilyName: string) => {
        if (subFamilyName.indexOf(' ') !== -1) return 'Subfamily must not contain any spaces.'
        if (subFamilyName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Subfamily must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    genus_name: {
      name: 'Genus',
      required: true,
      asString: (genusName: string) => {
        if (genusName.indexOf(' ') !== -1) return 'Genus must not contain any spaces.'
        if (genusName !== 'indet.' && editData.family_name === 'indet.')
          return 'when the Family is indet., Genus must also be indet.'
        if (genusName !== 'gen.' && editData.family_name === 'fam.')
          return 'when the Family is fam., Genus must be gen.'
        if (genusName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Genus must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    species_name: {
      name: 'Species',
      required: true,
      asString: (speciesName: string) => {
        if (speciesName.indexOf(' ') !== -1) return 'Species name must not contain any spaces.'
        if (speciesName !== 'indet.' && editData.genus_name === 'indet.')
          return 'when the Genus is indet., Species must also be indet.'
        if (speciesName !== 'sp.' && editData.genus_name === 'gen.')
          return 'when the Genus is gen., Species must be sp.'
        if (speciesName.indexOf('/') !== -1 && editData.taxonomic_status !== 'informal species')
          return 'Species must not contain a forward slash (/), unless Taxonomic Status is set to "informal species".'
        return
      },
    },
    taxonomic_status: {
      name: 'Taxonomic Status',
      asString: (taxonomicStatus: string) => {
        const allowedTaxonStatuses = taxonStatusOptions
          .slice(1)
          .filter((option): option is string => typeof option === 'string')

        if (!allowedTaxonStatuses.includes(taxonomicStatus) && taxonomicStatus !== '')
          return `Taxonomic Status must be one of the following (or left empty): ${allowedTaxonStatuses.join(', ')}.`
        return
      },
    },
    unique_identifier: {
      name: 'Unique Identifier',
      required: true,
      asString: (uniqueIdentifier: string) => {
        if (editData.species_name === 'sp.' && isEmptyUniqIdentifier(uniqueIdentifier ?? ''))
          return 'when the species is sp., Unique Identifier must have a value.'
        return
      },
    },
  }

  return validator<EditDataType<SpeciesDetailsType>>(validators, editData, fieldName)
}
