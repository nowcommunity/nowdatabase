import { logger } from '../utils/logger'
import { prisma } from '../utils/db'
import { EditDataType, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import Prisma from '@prisma/client'
import { validateLocality } from '../../../frontend/src/validators/locality'

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

export const fixEditedLocality = (editedLocality: EditDataType<LocalityDetailsType>) => {
  if (editedLocality.now_lau) {
    editedLocality.now_lau = editedLocality.now_lau.map(lau => ({
      ...lau,
      lau_date: new Date(lau.lau_date!),
    }))
  }
  if (editedLocality.now_ls) {
    editedLocality.now_ls = editedLocality.now_ls.map(now_ls => ({
      ...now_ls,
      com_species: {
        ...now_ls.com_species,
        body_mass: now_ls.com_species.body_mass, // TODO FIX ? null : BigInt(now_ls.com_species.body_mass!),
      },
    }))
  }
  return editedLocality
}

export const validateEntireLocality = (editedFields: Partial<Prisma.now_loc>) => {
  const keys = Object.keys(editedFields)
  const errors = []
  for (const key of keys) {
    const error = validateLocality(editedFields as EditDataType<LocalityDetailsType>, key as keyof LocalityDetailsType)
    if (error !== null) errors.push(error)
  }
  return errors
}

export const filterLocality = (editedFields: EditDataType<LocalityDetailsType>) => {
  const fields = Object.keys(prisma.now_loc.fields)
  const filteredLoc = Object.entries(editedFields)
    .filter(([field]) => fields.includes(field))
    .reduce<Record<string, unknown>>((obj, cur) => {
      obj[cur[0]] = cur[1]
      return obj
    }, {}) as Partial<Prisma.now_loc>
  return filteredLoc
}

export const editLocality = async (lid: number, filteredLoc: Partial<Prisma.now_loc>) => {
  const result = await prisma.now_loc.update({
    where: {
      lid,
    },
    data: {
      ...filteredLoc,
    },
  })
  return result
}
