import { logger } from '../utils/logger'
import { prisma } from '../utils/db'

export const testDb = async () => {
  const result = await prisma.now_loc.findMany({ select: { loc_name: true }, where: { loc_name: 'Amba East' } })
  if (result[0].loc_name === 'Amba East') {
    logger.info('Database connection tested, data can be fetched')
  } else {
    logger.error('Database connection does not work')
  }
}

export const getAllLocalities = async (onlyPublic: boolean) => {
  const where = onlyPublic ? { loc_status: false } : {}

  const result = await prisma.now_loc.findMany({
    select: { lid: true, loc_name: true, max_age: true, min_age: true, country: true, loc_status: true },
    where,
  })
  return result
}

export const getLocalityDetails = async (id: number) => {
  // TODO: Check if user has access
  const result = await prisma.now_loc.findUnique({ where: { lid: id }, include: { now_mus: true } })
  return result
}
