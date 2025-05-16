import { EditDataType, SpeciesDetailsType } from '../types'
import { Validators, validator } from './validator'

export const validateSpecies = (
  editData: EditDataType<SpeciesDetailsType>,
  fieldName: keyof EditDataType<SpeciesDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<SpeciesDetailsType>>> = {
    // const isNew = editData.lid === undefined
    order_name: {
      name: 'Order',
      required: true,
      asString: (orderName: string) => {
        if (orderName !== 'incertae sedis' && orderName.indexOf(' ') !== -1) return 'Order must not contain any spaces.'
      },
    },
    family_name: {
      name: 'Family',
      required: true,
      asString: (familyName: string) => {
        if (familyName !== 'incertae sedis' && familyName.indexOf(' ') !== -1)
          return 'Family must not contain any spaces.'
      },
    },
    genus_name: {
      name: 'Genus',
      required: true,
      asString: (genusName: string) => {
        if (genusName.indexOf(' ') !== -1) return 'Genus must not contain any spaces.'
        if (genusName === 'indet.' && editData.species_name !== 'indet.')
          return 'when the Genus is indet., Species must also be indet.'
        if (genusName === 'gen.' && editData.species_name !== 'sp.')
          return 'when the Genus is gen., Species must be sp.'
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
      },
    },
    unique_identifier: {
      name: 'Unique Identifier',
      required: true,
    },
  }

  return validator<EditDataType<SpeciesDetailsType>>(validators, editData, fieldName)
}
