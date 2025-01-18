import { EditDataType, RegionDetails } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'
import { nowDb } from '../../utils/db'

export const writeRegion = async (region: EditDataType<RegionDetails>) => {
  let regionId: number

  if (!region.reg_coord_id) {
    const newRegion = await nowDb.now_reg_coord.create({
      data: region as Prisma.now_reg_coord,
    })
    regionId = newRegion.reg_coord_id
  } else {
    await nowDb.now_reg_coord.update({
      where: { reg_coord_id: region.reg_coord_id },
      data: region as Prisma.now_reg_coord,
    })
    regionId = region.reg_coord_id
  }

  return regionId
}
