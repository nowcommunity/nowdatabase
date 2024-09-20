import { EditDataType, SpeciesDetailsType } from '../backendTypes'
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
  }

  return validator<EditDataType<SpeciesDetailsType>>(validators, editData, fieldName)
}
