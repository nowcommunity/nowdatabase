import { User, ColumnFilterUrl, SortingUrl, PageUrl } from '../../../frontend/src/backendTypes'
import { Role } from '../../../frontend/src/types'
import { nowDb } from '../utils/db'
import { generateFilteredCrossSearchSql, generateFilteredCrossSearchSqlWithAdmin, generateFilteredCrossSearchSqlWithNoUser } from '../utils/sql'

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

  console.time('cross search query')
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
  console.timeEnd('cross search query')

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

export const getFilteredCrossSearch = async (
  _columnfilter: ColumnFilter[] | [],
  _sorting: Sorting[] | [],
  page: Page,
  user?: User
) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: CrossSearchPreFilter) => Omit<CrossSearchPreFilter, 'now_plr'> = loc => {
    const { now_plr, ...rest } = loc
    return rest
  }

  // const parsedColumnFilter = parseCrossSearchFilter(columnfilter)

  // const rowCount = await nowDb.now_ls.count()

  const queryResult = await nowDb.now_ls.findMany({
    take: page.pageSize,
    skip: page.pageIndex * page.pageSize,
    relationLoadStrategy: 'query',
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

  return { data: result }
}

/*
const parseCrossSearchFilter = (columnFilter: ColumnFilter[] | []) => {
  const parsedColumnFilter: Record<string, string>  = {}
  columnFilter.map(filter => parsedColumnFilter[filter.id] = filter.value)
  return parsedColumnFilter
}
*/

export const getFilteredCrossSearchLength = async (_columnfilter: ColumnFilter[] | [], user?: User) => {
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

export const getFilteredCrossSearchRawSql = async (
  filters: ColumnFilterUrl[],
  sorting: SortingUrl[],
  page: PageUrl,
  user: User | undefined
) => {
  console.log('Filters:', filters)
  console.log('Sorting:', sorting)
  console.log('Page:', page)
  console.log('User:', user)

  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const limit: number = page.pageSize
  console.log('limit:', limit)
  if (!user) {
    const sql = generateFilteredCrossSearchSqlWithNoUser(limit, page.pageIndex * limit)
    console.log('sql', sql)

    const result = await nowDb.$queryRaw(sql)
    console.log('result', result)
    
    return result
  }

  if (showAll) {
    const sql = generateFilteredCrossSearchSqlWithAdmin(limit, page.pageIndex * limit)
    console.log('sql', sql)

    const result = await nowDb.$queryRaw(sql)

    return result
  }
  const sql = generateFilteredCrossSearchSql(limit)
  console.log('sql', sql)

  const result = await nowDb.$queryRaw(sql)

  return result
}

export const getTestQuery = async () => {
  console.log('route working')
  // left side of the union
  const result = (await nowDb.$queryRaw`
  SELECT 
    now_plr.pid,
    now_loc.lid,
    -- loc_name, 
    -- bfa_max,
    -- bfa_min,
    -- max_age,
    -- min_age,
    -- bfa_max_abs,
    -- bfa_min_abs,
    -- frac_max,
    -- frac_min,
    -- chron,
    -- basin,
    -- subbasin,
    -- dms_lat,
    -- dms_long,
    -- dec_lat,
    -- dec_long,
    -- altitude,
    country,
    -- state,
    -- county,
    -- site_area,
    -- gen_loc,
    -- plate,
    -- formation,
    -- member,
    -- bed,
    -- loc_status,
    -- now_plr,
    com_species.species_id
    -- subclass_or_superorder_name,
    -- order_name,
    -- suborder_or_superfamily_name,
    -- family_name,
    -- subfamily_name,
    -- genus_name,
    -- species_name,
    -- unique_identifier,
    -- taxonomic_status,
    -- common_name,
    -- sp_author,
    -- strain,
    -- gene,
    -- com_species.body_mass,
    -- brain_mass,
    -- sp_status
  FROM 
   now_ls 
  LEFT JOIN
   now_loc
  ON
   now_ls.lid = now_loc.lid 
  LEFT JOIN
   com_species
  ON
   now_ls.species_id = com_species.species_id
  LEFT JOIN
    now_plr
  ON
    now_loc.lid = now_plr.lid  
  WHERE
    country LIKE 'M%'
  ORDER BY
    now_loc.lid
  -- UNION

  -- SELECT (
  --   now_loc.lid,
    -- loc_name, 
    -- bfa_max,
    -- bfa_min,
    -- max_age,
    -- min_age,
    -- bfa_max_abs,
    -- bfa_min_abs,
    -- frac_max,
    -- frac_min,
    -- chron,
    -- basin,
    -- subbasin,
    -- dms_lat,
    -- dms_long,
    -- dec_lat,
    -- dec_long,
    -- altitude,
    -- country,
    -- state,
    -- county,
    -- site_area,
    -- gen_loc,
    -- plate,
    -- formation,
    -- member,
    -- bed,
    -- loc_status,
    -- now_plr,
    -- com_species.species_id,
    -- subclass_or_superorder_name,
    -- order_name,
    -- suborder_or_superfamily_name,
    -- family_name,
    -- subfamily_name,
    -- genus_name,
    -- species_name,
    -- unique_identifier,
    -- taxonomic_status,
    -- common_name,
    -- sp_author,
    -- strain,
    -- gene,
    -- com_species.body_mass,
    -- brain_mass,
    -- sp_status
  -- FROM 
  --  now_ls 
  -- LEFT JOIN
  --  now_loc
  -- ON
  --  now_ls.lid = now_loc.lid 
  -- LEFT JOIN
  --  com_species
  -- ON
  --  now_ls.species_id = com_species.species_id
  -- RIGHT JOIN
  --   now_plr
  -- ON
  --   now_loc.lid = now_plr.lid) as B

  -- ORDER BY
  --  com_species.species_id
  LIMIT
   5
  `) as CrossSearchPreFilter[]

  console.log('result', result)

  const result2 = await nowDb.$queryRaw`
  SELECT
  now_plr.pid,
    now_loc.lid,
    loc_name, 
    -- bfa_max,
    -- bfa_min,
    -- max_age,
    -- min_age,
    -- bfa_max_abs,
    -- bfa_min_abs,
    -- frac_max,
    -- frac_min,
    -- chron,
    -- basin,
    -- subbasin,
    -- dms_lat,
    -- dms_long,
    -- dec_lat,
    -- dec_long,
    -- altitude,
    -- country,
    -- state,
    -- county,
    -- site_area,
    -- gen_loc,
    -- plate,
    -- formation,
    -- member,
    -- bed,
    -- loc_status,
    -- now_plr,
    com_species.species_id
    -- subclass_or_superorder_name,
    -- order_name,
    -- suborder_or_superfamily_name,
    -- family_name,
    -- subfamily_name,
    -- genus_name,
    -- species_name,
    -- unique_identifier,
    -- taxonomic_status,
    -- common_name,
    -- sp_author,
    -- strain,
    -- gene,
    -- com_species.body_mass,
    -- brain_mass,
    -- sp_status
  FROM
    now_plr
  LEFT JOIN
    now_loc
  ON
    now_plr.lid = now_loc.lid
  LEFT JOIN
    now_ls
  ON
    now_loc.lid = now_ls.lid
  LEFT JOIN
    com_species
  ON
    now_ls.species_id = com_species.species_id
  ORDER BY
    now_loc.lid
  LIMIT
  5
  `
  console.log('result2', result2)

  return null
}
