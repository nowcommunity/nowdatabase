import { EditDataType, RegionDetails } from '../types'
import { Validators, validator } from './validator'

export const validateRegion = (editData: EditDataType<RegionDetails>, fieldName: keyof RegionDetails) => {
  const validators: Validators<EditDataType<Partial<RegionDetails>>> = {
    region: {
      name: 'Region',
      required: true,
    },
  }

  return validator<EditDataType<RegionDetails>>(validators, editData, fieldName)
}
