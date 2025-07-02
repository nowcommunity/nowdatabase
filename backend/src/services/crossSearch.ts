import {
  User,
  CrossSearch,
  Role,
  CrossSearchRouteParameters,
  ParsedCrossSearchRouteParameters,
  SortingState,
  ColumnFilter,
  SimplifiedLocality,
} from '../../../frontend/src/shared/types'
import { getCrossSearchFields, getFieldsOfTables, nowDb } from '../utils/db'
import { generateCrossSearchLocalitiesSql, generateCrossSearchSql } from './queries/crossSearchQuery'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import { validateCrossSearchRouteParams } from '../../../frontend/src/shared/validators/crossSearch'

const getAllowedLocalities = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  const projectsSet = new Set(usersProjects.map(({ pid }) => pid))
  const projectIDs = Array.from(projectsSet)

  const localities = await nowDb.now_plr.findMany({
    where: { pid: { in: projectIDs } },
    select: { lid: true },
  })

  const localitiesSet = new Set(localities.map(({ lid }) => lid))
  const localityIDs = Array.from(localitiesSet)
  return localityIDs
}

const convertFilterIdToFieldName = (id: string) => {
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
    descendingOrder = sorting[0].desc
  }

  let convertedOrderBy = undefined
  if (orderBy) {
    convertedOrderBy = convertFilterIdToFieldName(orderBy)
    if (!getCrossSearchFields().includes(convertedOrderBy)) throw new Error('orderBy was not a valid column id.')
  }

  const convertedColumnFilters = []
  if (columnFilters) {
    const allowedColumns = getCrossSearchFields()
    for (const filter of columnFilters) {
      const convertedId = convertFilterIdToFieldName(filter.id)
      if (!allowedColumns.includes(convertedId)) throw new Error('columnFilters has an invalid column id.')
      convertedColumnFilters.push({ id: convertedId, value: filter.value })
    }
  }

  const showAll = user ? [Role.Admin, Role.EditUnrestricted].includes(user.role) : false
  const allowedLocalities = user ? await getAllowedLocalities(user) : []

  if (!limit) {
    // ONLY for exporting
    limit = 10000
    offset = 0
    const results = []
    while (true) {
      const sql = generateCrossSearchSql(
        showAll,
        allowedLocalities,
        limit,
        offset,
        convertedColumnFilters,
        convertedOrderBy,
        descendingOrder
      )
      const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
      if (result.length === 0) break
      results.push(result)
      offset = offset + 10000
    }
    return results
  }

  const sql = generateCrossSearchSql(
    showAll,
    allowedLocalities,
    limit,
    offset,
    convertedColumnFilters,
    convertedOrderBy,
    descendingOrder
  )

  const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
  return result
}

export const getCrossSearchLocalitiesRawSql = async (
  user: User | undefined,
  columnFilters?: ColumnFilter[],
  sorting?: SortingState[]
) => {
  let orderBy: string | undefined
  let descendingOrder: boolean = false
  if (!sorting || sorting.length === 0) {
    orderBy = undefined
  } else {
    orderBy = sorting[0].id
    descendingOrder = sorting[0].desc
  }

  let convertedOrderBy = undefined
  if (orderBy) {
    convertedOrderBy = convertFilterIdToFieldName(orderBy)
    if (!getCrossSearchFields().includes(convertedOrderBy)) throw new Error('orderBy was not a valid column id.')
  }

  const convertedColumnFilters = []
  if (columnFilters) {
    const allowedColumns = getCrossSearchFields()
    for (const filter of columnFilters) {
      const convertedId = convertFilterIdToFieldName(filter.id)
      if (!allowedColumns.includes(convertedId)) throw new Error('columnFilters has an invalid column id.')
      convertedColumnFilters.push({ id: convertedId, value: filter.value })
    }
  }

  const showAll = user ? [Role.Admin, Role.EditUnrestricted].includes(user.role) : false
  const allowedLocalities = user ? await getAllowedLocalities(user) : []

  const sql = generateCrossSearchLocalitiesSql(
    showAll,
    allowedLocalities,
    convertedColumnFilters,
    convertedOrderBy,
    descendingOrder
  )

  const result: Partial<SimplifiedLocality>[] = await nowDb.$queryRaw(sql)
  return result
}

export const parseAndValidateCrossSearchRouteParameters = (parameters: CrossSearchRouteParameters) => {
  const { limit, offset, columnFilters, sorting } = parameters
  let parsedLimit
  let parsedOffset
  if (limit) {
    parsedLimit = parseInt(limit)
    if (isNaN(parsedLimit)) throw new Error('Limit is not a number.')
  }
  if (offset) {
    parsedOffset = parseInt(offset)
    if (isNaN(parsedOffset)) throw new Error('Offset is not a number.')
  }
  const parsedColumnFilters = JSON.parse(columnFilters) as unknown
  if (!Array.isArray(parsedColumnFilters)) throw new Error('ColumnFilters is not an array.')
  const parsedSorting = JSON.parse(sorting) as unknown
  if (!Array.isArray(parsedSorting)) throw new Error('Sorting is not an array.')

  const parsedParameters = {
    limit: parsedLimit,
    offset: parsedOffset,
    columnFilters: parsedColumnFilters,
    sorting: parsedSorting,
  }
  const keys = Object.keys(parsedParameters)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateCrossSearchRouteParams(parsedParameters, key as keyof ParsedCrossSearchRouteParameters)
    if (error.error) errors.push(error)
  }
  const validatedColumnFilters = parsedColumnFilters as ColumnFilter[]
  const validatedSorting = parsedSorting as SortingState[]

  return {
    validatedLimit: parsedLimit,
    validatedOffset: parsedOffset,
    validatedColumnFilters,
    validatedSorting,
    validationErrors: errors,
  }
}
