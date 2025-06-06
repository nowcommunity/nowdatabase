import { nowDb } from '../utils/db'
import { EditDataType, EditMetaData, RegionDetails } from '../../../frontend/src/shared/types'
import { validateRegion } from '../../../frontend/src/shared/validators/region'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'

export const getAllRegions = async () => {
  const result = await nowDb.now_reg_coord.findMany({})
  return result
}

export const getRegionDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await nowDb.now_reg_coord.findUnique({
    where: { reg_coord_id: id },
    include: {
      now_reg_coord_country: {},
      now_reg_coord_people: {
        include: {
          com_people: true,
        },
      },
    },
  })
  return result
}

export const validateEntireRegion = (editedFields: EditDataType<Prisma.now_reg_coord> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateRegion(editedFields as EditDataType<RegionDetails>, key as keyof RegionDetails)
    if (error.error) errors.push(error)
  }
  return errors
}
