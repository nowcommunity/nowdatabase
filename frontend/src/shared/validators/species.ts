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
        return
      },
    },
    order_name: {
      name: 'Order',
      required: true,
      asString: (orderName: string) => {
        if (orderName !== 'incertae sedis' && orderName.indexOf(' ') !== -1)
          return 'Order must not contain any spaces, unless the value is "incertae sedis".'
        return
      },
    },
    suborder_or_superfamily_name: {
      name: 'Suborder or Superfamily',
      asString: (subOrderName: string) => {
        if (subOrderName.indexOf(' ') !== -1) return 'Suborder must not contain any spaces.'
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
        return
      },
    },
    subfamily_name: {
      name: 'Subfamily or Tribe',
      asString: (subFamilyName: string) => {
        if (subFamilyName.indexOf(' ') !== -1) return 'Subfamily must not contain any spaces.'
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
        return
      },
    },
    species_name: {
      name: 'Species',
      required: true,
      asString: (speciesName: string) => {
        if (speciesName !== 'indet.' && editData.genus_name === 'indet.')
          return 'when the Genus is indet., Species must also be indet.'
        if (speciesName !== 'sp.' && editData.genus_name === 'gen.')
          return 'when the Genus is gen., Species must be sp.'
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
