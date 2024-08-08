import { logDb, nowDb, pool } from '../utils/db'
import { EditDataType, LocalityDetailsType, User } from '../../../frontend/src/backendTypes'
import Prisma from '../../prisma/generated/now_test_client'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import { fixBigInt } from '../utils/common'
import { Role } from '../../../frontend/src/types'
import { AccessError } from '../middlewares/authorizer'
import { NOW_DB_NAME } from '../utils/config'
import { localityColumns, now_lsColumns, speciesColumns } from './combinedExportColumns'

export const getLocalitySpeciesList = async (lids: number[], user: User | undefined) => {
  // Get localities separately with getAllLocalities to know which localities user has access to.
  // Unoptimal, if it's slow try a different way.
  const localityList = await getAllLocalities(user)

  const lidsSet = new Set(lids)
  const permittedLids = localityList.filter(loc => lidsSet.has(loc.lid)).map(loc => loc.lid)

  const conn = await pool.getConnection()
  const columns = [
    ...localityColumns.map(col => `${NOW_DB_NAME}.now_loc.${col} as ${col}`),
    ...now_lsColumns.map(col => `${NOW_DB_NAME}.now_ls.${col} as ${col}`),
    ...speciesColumns.map(col => `${NOW_DB_NAME}.com_species.${col} as ${col}`),
  ].join(', ')

  const localitySpecies: { [index: string]: string | number | null | bigint | boolean }[] = await conn.query(
    `
    SELECT ${columns} FROM ${NOW_DB_NAME}.now_loc JOIN ${NOW_DB_NAME}.now_ls ON ${NOW_DB_NAME}.now_loc.lid = ${NOW_DB_NAME}.now_ls.lid JOIN ${NOW_DB_NAME}.com_species ON ${NOW_DB_NAME}.now_ls.species_id = ${NOW_DB_NAME}.com_species.species_id WHERE ${NOW_DB_NAME}.now_loc.lid IN (?)
    `,
    [permittedLids]
  )

  await conn.end()

  const localityTitles = [...localityColumns, ...now_lsColumns, ...speciesColumns]

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
  const dataRows = localitySpecies.map(obj => Object.values(obj).map(value => formatValue(value as string))) as unknown

  const titleRow = [...localityTitles, ...speciesTitles, ...lsTitles]
  return [titleRow, ...(dataRows as string[])]
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
