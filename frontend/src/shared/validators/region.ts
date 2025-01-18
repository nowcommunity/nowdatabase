import { EditDataType, RegionDetails } from '../types'
import { Validators, validator } from './validator'

export const validateRegion = (editData: EditDataType<RegionDetails>, fieldName: keyof RegionDetails) => {
  const validators: Validators<EditDataType<Partial<RegionDetails>>> = {
    reg_coord_id: {
      name: 'reg_coord_id',
      required: true,
    },
    region: {
      name: 'Region',
      required: true,
    },
  }

  return validator<EditDataType<RegionDetails>>(validators, editData, fieldName)
}
