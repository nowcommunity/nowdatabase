import { dbClient } from '../utils/db'

export const getAllRegions = async () => {
  const result = await dbClient.now_reg_coord.findMany({})
  return result
}

export const getRegionDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await dbClient.now_reg_coord.findUnique({
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
