import { logDb, nowDb } from '../utils/db'
import { EditDataType, LocalityDetailsType, User } from '../../../frontend/src/backendTypes'
import Prisma from '../../prisma/generated/now_test_client'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import { fixBigInt } from '../utils/common'
import { Role } from '../../../frontend/src/types'
import { AccessError } from '../middlewares/authorizer'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

export const getAllLocalities = async (showAll: boolean, user?: User) => {
  const removeProjects: (item: { now_plr: unknown }) => unknown = item => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { now_plr, ...rest } = item
    return rest
  }

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
      now_plr: {
        select: { pid: true },
      },
    },
  })

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
      if (!result.now_plr.find(proj => usersProjects.has(proj.pid)))
        throw new AccessError(
          'The requested locality is in draft status and the user has no required rights or project association to it.'
        )
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
