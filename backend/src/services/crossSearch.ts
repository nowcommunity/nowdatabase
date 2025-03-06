import { User, CrossSearch, Role, CrossSearchRouteParameters } from '../../../frontend/src/shared/types'
import { getCrossSearchFields, getFieldsOfTables, nowDb } from '../utils/db'
import {
  ColumnFilter,
  generateFilteredCrossSearchSql,
  generateFilteredCrossSearchSqlWithAdmin,
  generateFilteredCrossSearchSqlWithNoUser,
  SortingState,
} from '../utils/sql'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import { validateCrossSearchRouteParams } from '../../../frontend/src/shared/validators/crossSearch'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

export const convertFilterIdToFieldName = (id: string) => {
  const aliasToFieldName: { [key: string]: string } = {
    species_id_com_species: 'com_species.species_id',
    body_mass_com_species: 'com_species.body_mass',
    microwear_com_species: 'com_species.microwear',
    mesowear_com_species: 'com_species.mesowear',
    mw_or_high_com_species: 'com_species.mw_or_high',
    mw_or_low_com_species: 'com_species.mw_or_low',
    mw_cs_sharp_com_species: 'com_species.mw_cs_sharp',
    mw_cs_round_com_species: 'com_species.mw_cs_round',
    mw_cs_blunt_com_species: 'com_species.mw_cs_blunt',
    mw_scale_min_com_species: 'com_species.mw_scale_min',
    mw_scale_max_com_species: 'com_species.mw_scale_max',
    mw_value_com_species: 'com_species.mw_value',

    lid_now_loc: 'now_loc.lid',
    species_id_now_ls: 'now_ls.species_id',
    microwear_now_ls: 'now_ls.microwear',
    body_mass_now_ls: 'now_ls.body_mass',
    mesowear_now_ls: 'now_ls.mesowear',
    mw_or_high_now_ls: 'now_ls.mw_or_high',
    mw_or_low_now_ls: 'now_ls.mw_or_low',
    mw_cs_sharp_now_ls: 'now_ls.mw_cs_sharp',
    mw_cs_round_now_ls: 'now_ls.mw_cs_round',
    mw_cs_blunt_now_ls: 'now_ls.mw_cs_blunt',
    mw_scale_min_now_ls: 'now_ls.mw_scale_min',
    mw_scale_max_now_ls: 'now_ls.mw_scale_max',
    mw_value_now_ls: 'now_ls.mw_value',
  }

  if (Object.keys(aliasToFieldName).includes(id)) {
    return aliasToFieldName[id]
  }

  if (getFieldsOfTables(['com_species']).includes(id)) {
    return `com_species.${id}`
  }
  if (getFieldsOfTables(['now_ls']).includes(id)) {
    return `now_ls.${id}`
  }
  if (getFieldsOfTables(['now_loc']).includes(id)) {
    return `now_loc.${id}`
  }
  return id
}

export const validateCrossSearchRouteParameters = (parameters: CrossSearchRouteParameters) => {
  const keys = Object.keys(parameters)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateCrossSearchRouteParams(parameters, key as keyof CrossSearchRouteParameters)
    if (error.error) errors.push(error)
  }
  return errors
}

export const getCrossSearchRawSql = async (
  user: User | undefined,
  limit?: number,
  offset?: number,
  columnFilters?: ColumnFilter[],
  sorting?: SortingState[]
) => {
  let orderBy: string | undefined
  let descendingOrder: boolean = false
  if (!sorting || sorting.length === 0) {
    orderBy = undefined
  } else {
    orderBy = sorting[0].id
    descendingOrder = sorting[0].desc === 'true' ? true : false
  }
  if (orderBy) {
    orderBy = convertFilterIdToFieldName(orderBy)
    if (!getCrossSearchFields().includes(orderBy)) throw new Error('ORDER BY NOT A VALID FIELD!')
  }

  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  if (!user) {
    const sql = generateFilteredCrossSearchSqlWithNoUser(limit, offset, columnFilters, orderBy, descendingOrder)
    //console.log(sql.text)
    //console.log(sql.values)
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  if (showAll) {
    const sql = generateFilteredCrossSearchSqlWithAdmin()
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  const usersProjects = await getIdsOfUsersProjects(user)

  if (!usersProjects.size) {
    const sql = generateFilteredCrossSearchSqlWithNoUser(limit, offset)
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  const sql = generateFilteredCrossSearchSql(usersProjects)
  const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
  return result
}
