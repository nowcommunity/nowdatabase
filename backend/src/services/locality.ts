import { logger } from '../utils/logger'
import { nowDb, logDb } from '../utils/db'
import { EditDataType, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import Prisma from '../../prisma/generated/now_test_client'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { detailedDiff } from 'deep-object-diff'
import { filterFields } from './writeUtils'
import { ValidationObject } from '../../../frontend/src/validators/validator'

export const testDb = async () => {
  logger.info('Testing db...')
  await nowDb.now_loc.findFirst({})
  await logDb.log.findMany({})
  logger.info('Db seems to work.')
}

export const getAllLocalities = async (onlyPublic: boolean) => {
  const where = onlyPublic ? { loc_status: false } : {}

  const result = await nowDb.now_loc.findMany({
    select: {
      lid: true,
      loc_name: true,
      bfa_max: true,
      bfa_min: true,
      max_age: true,
      min_age: true,
      country: true,
      loc_status: true,
    },
    where,
  })
  return result
}

export const getLocalityDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await nowDb.now_loc.findUnique({
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
      lau_date: new Date(lau.lau_date),
    }))
  }
  // TODO: see if we have to turn these into bigint or if writing number to db is ok.
  // if (editedLocality.now_ls) {
  //   editedLocality.now_ls = editedLocality.now_ls.map(now_ls => ({
  //     ...now_ls,
  //     com_species: {
  //       ...now_ls.com_species,
  //       body_mass: now_ls.com_species.body_mass,
  //     },
  //   }))
  // }
  return editedLocality
}

export const validateEntireLocality = (editedFields: Partial<Prisma.now_loc>) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateLocality(editedFields as EditDataType<LocalityDetailsType>, key as keyof LocalityDetailsType)
    if (error.error) errors.push(error)
  }
  return errors
}

export const processLocalityForEdit = async (editedLocality: EditDataType<LocalityDetailsType>) => {
  const fixedEditedLocality = fixEditedLocality(editedLocality)
  const oldLocality = await getLocalityDetails(fixedEditedLocality.lid)
  const difference = detailedDiff(oldLocality, fixedEditedLocality)
  const filteredLoc = filterFields(difference.updated as EditDataType<LocalityDetailsType>, nowDb.now_loc.fields)
  const validationErrors = validateEntireLocality(filteredLoc)
  if (validationErrors.length > 0) return { validationErrors }
  const result = await editLocality(oldLocality!.lid, filteredLoc)
  return { result }
}

export const editLocality = async (lid: number, filteredLoc: Partial<Prisma.now_loc>) => {
  const result = await nowDb.now_loc.update({
    where: {
      lid,
    },
    data: {
      ...filteredLoc,
    },
  })
  return result
}
