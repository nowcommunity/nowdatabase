import { logDb, nowDb } from '../utils/db'
import { EditDataType, LocalityDetailsType, User } from '../../../frontend/src/backendTypes'
import Prisma from '../../prisma/generated/now_test_client'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import { fixBigInt } from '../utils/common'
import { Role, calculateMeanHypsodonty } from '../../../frontend/src/types'
import { AccessError } from '../middlewares/authorizer'

export const getLocalitySpeciesList = async (lids: number[], user: User | undefined) => {
  // Get localities separately with getAllLocalities to know which localities user has access to.
  // Unoptimal, if it's slow try a different way.
  const localityList = await getAllLocalities(user)

  const lidsSet = new Set(lids)
  const premittedLids = localityList.filter(loc => lidsSet.has(loc.lid)).map(loc => loc.lid)

  const localitySpecies = await nowDb.now_loc.findMany({
    select: {
      lid: true,
      loc_name: true,
      dms_lat: true,
      dms_long: true,
      dec_lat: true,
      dec_long: true,
      altitude: true,
      max_age: true,
      bfa_max: true,
      bfa_max_abs: true,
      frac_max: true,
      min_age: true,
      bfa_min: true,
      bfa_min_abs: true,
      frac_min: true,
      chron: true,
      age_comm: true,
      basin: true,
      subbasin: true,
      country: true,
      state: true,
      county: true,
      appr_num_spm: true,
      gen_loc: true,
      now_syn_loc: true,
      estimate_precip: true,
      estimate_npp: true,
      pers_woody_cover: true,
      pers_pollen_nap: true,
      pers_pollen_other: true,
      now_ls: {
        include: { com_species: true },
      },
    },
    where: {
      lid: {
        in: premittedLids,
      },
    },
  })

  // TODO calc mean hypsodonty & add title

  const localityTitles = [
    'lid',
    'loc_name',
    'dms_lat',
    'dms_long',
    'dec_lat',
    'dec_long',
    'altitude',
    'max_age',
    'bfa_max',
    'bfa_max_abs',
    'frac_max',
    'min_age',
    'bfa_min',
    'bfa_min_abs',
    'frac_min',
    'chron',
    'age_comm',
    'basin',
    'subbasin',
    'country',
    'state',
    'county',
    'appr_num_spm',
    'gen_loc',
    'now_syn_loc',
    'estimate_precip',
    'estimate_npp',
    'pers_woody_cover',
    'pers_pollen_nap',
    'pers_pollen_other',
    'mean hypsodonty',
  ]

  const formatValue = (value: string | number | boolean | null | object | bigint) => {
    if (Array.isArray(value)) return `"${value.map((value: { synonym: string }) => value.synonym).join(', ')}"`
    if (typeof value === 'object' && value !== null)
      throw new Error('Internal error: Unexpected non-array object in export data')
    if (typeof value === 'bigint') return Number(BigInt)
    if (value === null) return `""`
    return `"${value}"`
  }

  const speciesTitles = Object.keys(nowDb.com_species.fields)
  const lsTitles = Object.keys(nowDb.now_ls.fields)

  const titleRow = [...localityTitles, ...speciesTitles, ...lsTitles]

  const data = localitySpecies.flatMap(localityWithSpecies => {
    const { now_ls, ...locality } = localityWithSpecies
    const meanHypsodonty = calculateMeanHypsodonty(localityWithSpecies as unknown as LocalityDetailsType)
    const speciesList =
      now_ls.length > 0
        ? now_ls.map(ls => {
            const { com_species, ...nowLs } = ls
            return [
              ...Object.values(locality).map(value => formatValue(value)),
              meanHypsodonty,
              ...Object.values(com_species).map(value => formatValue(value)),
              ...Object.values(nowLs).map(value => formatValue(value)),
            ]
          })
        : [
            [
              ...Object.values(locality).map(value => formatValue(value)),
              meanHypsodonty,
              ...speciesTitles.map(() => ''),
              ...lsTitles.map(() => ''),
            ],
          ]
    return speciesList
  })

  return [titleRow, ...data]
}

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

type LocalityListType = {
  lid: number
  bfa_max: string | null
  bfa_min: string | null
  loc_name: string
  max_age: number
  min_age: number
  country: string | null
  loc_status: boolean | null
  now_plr: {
    pid: number
  }[]
}

export const getAllLocalities = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: LocalityListType) => Omit<LocalityListType, 'now_plr'> = loc => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { now_plr, ...rest } = loc
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
