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

  const result = await prisma.now_loc.findUnique({
    where: { lid: id },
    include: {
      now_mus: {
        include: {
          com_mlist: true,
        },
      },
      now_ls: {
        include: {
          com_species: true,
        },
      },
      now_syn_loc: {},
      now_ss: {},
      now_coll_meth: {},
      now_plr: {
        include: {
          now_proj: true,
        },
      },
      now_lau: {
        include: {
          now_lr: true,
        },
      },
    },
  })

  if (!result) return null
  const { now_mus, ...locality } = result
  return { ...locality, museums: now_mus.map(museum => museum.com_mlist) }
}
