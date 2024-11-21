import { User, CrossSearch } from '../../../frontend/src/backendTypes'
import { Role } from '../../../frontend/src/types'
import { nowDb } from '../utils/db'
import {
  generateFilteredCrossSearchSql,
  generateFilteredCrossSearchSqlWithAdmin,
  generateFilteredCrossSearchSqlWithNoUser,
} from '../utils/sql'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}
type CrossSearchLocalities = {
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
  altitude: number
  country: string
  state: string | null
  county: string | null
  site_area: string | null
  gen_loc: string | null
  plate: string | null
  formation: string | null
  member: string | null
  bed: string | null
}
type CrossSearchSpecies = {
  species_id: number
  subclass_or_superorder_name: string | null
  order_name: string
  suborder_or_superfamily_name: string | null
  family_name: string
  subfamily_name: string | null
  genus_name: string
  species_name: string
  unique_identifier: string
  taxonomic_status: string
  common_name: string | null
  sp_author: string | null
  strain: string | null
  gene: string | null
  body_mass: number | null
  brain_mass: number | null
}
type CrossSearchPreFilter = CrossSearchLocalities &
  CrossSearchSpecies & { loc_status: boolean | null; now_plr: { pid: number }[]; sp_status: string | null }

export const getAllCrossSearch = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: CrossSearchPreFilter) => Omit<CrossSearchPreFilter, 'now_plr'> = loc => {
    const { now_plr, ...rest } = loc
    return rest
  }

  const queryResult = await nowDb.now_ls.findMany({
    select: {
      now_loc: {
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
      },
      com_species: {
        select: {
          species_id: true,
          subclass_or_superorder_name: true,
          order_name: true,
          suborder_or_superfamily_name: true,
          family_name: true,
          subfamily_name: true,
          genus_name: true,
          species_name: true,
          unique_identifier: true,
          taxonomic_status: true,
          common_name: true,
          sp_author: true,
          strain: true,
          gene: true,
          body_mass: true,
          brain_mass: true,
          sp_status: true,
        },
      },
    },
  })

  const flattenedResult = queryResult.map(item => ({
    lid: item.now_loc.lid,
    loc_name: item.now_loc.loc_name,
    bfa_max: item.now_loc.bfa_max,
    bfa_min: item.now_loc.bfa_min,
    max_age: item.now_loc.max_age,
    min_age: item.now_loc.min_age,
    bfa_max_abs: item.now_loc.bfa_max_abs,
    bfa_min_abs: item.now_loc.bfa_min_abs,
    frac_max: item.now_loc.frac_max,
    frac_min: item.now_loc.frac_min,
    chron: item.now_loc.chron,
    basin: item.now_loc.basin,
    subbasin: item.now_loc.subbasin,
    dms_lat: item.now_loc.dms_lat,
    dms_long: item.now_loc.dms_long,
    dec_lat: item.now_loc.dec_lat,
    dec_long: item.now_loc.dec_long,
    altitude: item.now_loc.altitude,
    country: item.now_loc.country,
    state: item.now_loc.state,
    county: item.now_loc.county,
    site_area: item.now_loc.site_area,
    gen_loc: item.now_loc.gen_loc,
    plate: item.now_loc.plate,
    formation: item.now_loc.formation,
    member: item.now_loc.member,
    bed: item.now_loc.bed,
    loc_status: item.now_loc.loc_status,
    now_plr: item.now_loc.now_plr,
    species_id: item.com_species.species_id,
    subclass_or_superorder_name: item.com_species.subclass_or_superorder_name,
    order_name: item.com_species.order_name,
    suborder_or_superfamily_name: item.com_species.suborder_or_superfamily_name,
    family_name: item.com_species.family_name,
    subfamily_name: item.com_species.subfamily_name,
    genus_name: item.com_species.genus_name,
    species_name: item.com_species.species_name,
    unique_identifier: item.com_species.unique_identifier,
    taxonomic_status: item.com_species.taxonomic_status,
    common_name: item.com_species.common_name,
    sp_author: item.com_species.sp_author,
    strain: item.com_species.strain,
    gene: item.com_species.gene,
    body_mass: item.com_species.body_mass,
    brain_mass: item.com_species.brain_mass,
    sp_status: item.com_species.sp_status,
  })) as CrossSearchPreFilter[]

  if (showAll) {
    const result = flattenedResult.map(removeProjects)
    return result
  }
  if (!user) {
    const result = flattenedResult.filter(loc => loc.loc_status === false).map(removeProjects)
    return result
  }

  const usersProjects = await getIdsOfUsersProjects(user)

  const result = flattenedResult
    .filter(loc => !loc.loc_status || loc.now_plr.find(now_plr => usersProjects.has(now_plr.pid)))
    .map(removeProjects)

  return result
}

export const getCrossSearchLength = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)

  const queryResult = await nowDb.now_ls.findMany({
    select: {
      now_loc: {
        select: {
          lid: true,
          loc_status: true,
          now_plr: {
            select: { pid: true },
          },
        },
      },
    },
  })

  const flattenedResult = queryResult.map(item => ({
    lid: item.now_loc.lid,
    loc_status: item.now_loc.loc_status,
    now_plr: item.now_loc.now_plr,
  })) as CrossSearchPreFilter[]

  if (showAll) {
    return flattenedResult.length
  }
  if (!user) {
    return flattenedResult.filter(loc => loc.loc_status === false).length
  }

  const usersProjects = await getIdsOfUsersProjects(user)

  return flattenedResult.filter(loc => !loc.loc_status || loc.now_plr.find(now_plr => usersProjects.has(now_plr.pid)))
    .length
}

export const getCrossSearchRawSql = async (user: User | undefined) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  if (!user) {
    const sql = generateFilteredCrossSearchSqlWithNoUser()
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
    const sql = generateFilteredCrossSearchSqlWithNoUser()
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  const sql = generateFilteredCrossSearchSql(usersProjects)
  const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
  return result
}
