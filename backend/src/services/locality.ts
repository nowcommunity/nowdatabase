import { EditDataType, LocalityDetailsType, User } from '../../../frontend/src/backendTypes'
import { Role } from '../../../frontend/src/types'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'
import { AccessError } from '../middlewares/authorizer'
import { fixBigInt } from '../utils/common'
import { logDb, nowDb } from '../utils/db'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

type LocalityPreFilter = {
  lid: number
  loc_name: string
  bfa_max: string | null
  bfa_min: string | null
  max_age: number
  min_age: number
  bfa_max_abs: string | null
  bfa_min_abs: string | null
  frac_max: string | null
  frac_min: string | null
  chron: string | null
  basin: string | null
  subbasin: string | null
  dms_lat: string | null
  dms_long: string | null
  dec_lat: number
  dec_long: number
  altitude: string | null
  country: string
  state: string | null
  county: string | null
  site_area: string | null
  gen_loc: string | null
  plate: string | null
  formation: string | null
  member: string | null
  bed: string | null
  loc_status: boolean | null
  now_plr: {
    pid: number
  }[]
}

export const getAllLocalities = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: LocalityPreFilter) => Omit<LocalityPreFilter, 'now_plr'> = loc => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { now_plr, ...rest } = loc
    return rest
  }

  const result = (await nowDb.now_loc.findMany({
    select: {
      lid: true,
      loc_name: true,
      bfa_max: true,
      bfa_min: true,
      max_age: true,
      min_age: true,
      bfa_max_abs: true,
      bfa_min_abs: true,
      frac_max: true,
      frac_min: true,
      chron: true,
      basin: true,
      subbasin: true,
      dms_lat: true,
      dms_long: true,
      dec_lat: true,
      dec_long: true,
      altitude: true,
      country: true,
      state: true,
      county: true,
      site_area: true,
      gen_loc: true,
      plate: true,
      formation: true,
      member: true,
      bed: true,
      loc_status: true,
      now_plr: {
        select: { pid: true },
      },
    },
  })) as LocalityPreFilter[]

  if (showAll) return result.map(removeProjects)

  if (!user) return result.filter(loc => loc.loc_status === false).map(removeProjects)

  const usersProjects = await getIdsOfUsersProjects(user)

  return result
    .filter(loc => !loc.loc_status || loc.now_plr.find(now_plr => usersProjects.has(now_plr.pid)))
    .map(removeProjects)
}

export const getLocalityDetails = async (id: number, user: User | undefined) => {
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
          now_lr: {
            include: {
              ref_ref: {
                include: {
                  ref_authors: true,
                  ref_journal: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!result) return null

  const luids = result.now_lau.map(lau => lau.luid)

  const logResult = await logDb.log.findMany({ where: { luid: { in: luids } } })

  result.now_lau = result.now_lau.map(lau => ({
    ...lau,
    updates: logResult.filter(logRow => logRow.luid === lau.luid),
  }))

  if (result.loc_status) {
    if (!user) throw new AccessError()
    if (![Role.Admin, Role.EditUnrestricted].includes(user.role)) {
      const usersProjects = await getIdsOfUsersProjects(user)
      if (!result.now_plr.find(proj => usersProjects.has(proj.pid))) throw new AccessError()
    }
  }

  return JSON.parse(fixBigInt(result)!) as LocalityDetailsType
}

export const validateEntireLocality = (editedFields: EditDataType<Prisma.now_loc>) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateLocality(editedFields as EditDataType<LocalityDetailsType>, key as keyof LocalityDetailsType)
    if (error.error) errors.push(error)
  }
  return errors
}
