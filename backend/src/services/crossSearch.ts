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
  now_ls: {
    com_species: {
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
  }[]
}

type CrossSearchListTypeCleaned = {
  lid: number
  bfa_max: string | null
  bfa_min: string | null
  loc_name: string
  max_age: number
  min_age: number
  country: string | null
  loc_status: boolean | null
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
    // console.log(loc)
    return rest
  }

  const result = (await nowDb.now_loc.findMany({
    take: 5,
    select: {
      lid: true,
      //columns from now_loc
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
      now_ls: {
        select: {
          com_species: {
            select: {
              //columns from com_species
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
      },
    },
  })) as CrossSearchListType[]

  const cleanResults = (result: Omit<CrossSearchListType, 'now_plr'>[]) => {
    const cleanedResult: CrossSearchListTypeCleaned[] = []
    result.forEach(loc => {
      loc.now_ls.forEach(species => {
        cleanedResult.push({
          lid: loc.lid,
          loc_name: loc.loc_name,
          bfa_max: loc.bfa_max,
          bfa_min: loc.bfa_min,
          max_age: loc.max_age,
          min_age: loc.min_age,
          country: loc.country,
          loc_status: loc.loc_status,
          species_id: species.com_species.species_id,
          subclass_or_superorder_name: species.com_species.subclass_or_superorder_name,
          order_name: species.com_species.order_name,
          suborder_or_superfamily_name: species.com_species.suborder_or_superfamily_name,
          family_name: species.com_species.family_name,
          subfamily_name: species.com_species.subfamily_name,
          genus_name: species.com_species.genus_name,
          species_name: species.com_species.species_name,
          unique_identifier: species.com_species.unique_identifier,
          taxonomic_status: species.com_species.taxonomic_status,
          sp_status: species.com_species.sp_status,
        })
      })
    })

    return cleanedResult
  }

  if (showAll) {
    const cleanedResult = cleanResults(result.map(removeProjects))
    return cleanedResult
  }
  if (!user) {
    const cleanedResult = cleanResults(result.filter(loc => loc.loc_status === false).map(removeProjects))
    return cleanedResult
  }

  const usersProjects = await getIdsOfUsersProjects(user)

  const cleanedResult = cleanResults(
    result
      .filter(loc => !loc.loc_status || loc.now_plr.find(now_plr => usersProjects.has(now_plr.pid)))
      .map(removeProjects)
  )
  return cleanedResult
}
