import { EditDataType, SpeciesDetailsType } from '../types'
import { Validators, validator } from './validator'

export const validateSpecies = (
  editData: EditDataType<SpeciesDetailsType>,
  fieldName?: keyof EditDataType<SpeciesDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<SpeciesDetailsType>>> = {
    // const isNew = editData.lid === undefined
    order_name: {
      name: 'Order',
      required: true,
    },
    family_name: {
      name: 'Family',
      required: true,
    },
    genus_name: {
      name: 'Genus',
      required: true,
    },
    species_name: {
      name: 'Species',
      required: true,
    },
    unique_identifier: {
      name: 'Unique Identifier',
      required: true,
    },
  }

  return validator<EditDataType<SpeciesDetailsType>>(validators, editData, fieldName)
}
