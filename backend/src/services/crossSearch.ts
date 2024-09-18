import { User } from '../../../frontend/src/backendTypes'
import { Role } from '../../../frontend/src/types'
import { nowDb } from '../utils/db'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

type CrossSearchListType = {
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
  sp_status: boolean | null
}

export const getAllCrossSearch = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: CrossSearchListType) => Omit<CrossSearchListType, 'now_plr'> = loc => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          country: true,
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
    country: item.now_loc.country,
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
    sp_status: item.com_species.sp_status,
  })) as CrossSearchListType[]

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
