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
  species_id: number
  now_plr: {
    pid: number
  now_ls:{
	species_id: number
	subclass_or_superorder_name: string
	order_name: string
	suborder_or_superfamily_name: string
	family_name: string
	subfamily_name: string
	genus_name: string
	species_name: string
	unique_identifier: string
	taxonomic_status: string
	sp_status: string
  }
  }[]
}

export const getAllCrossSearch = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: CrossSearchListType) => Omit<CrossSearchListType, 'now_plr'> = loc => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { now_plr, ...rest } = loc
    return rest
  }

  const result = await nowDb.now_loc.findMany({
    // take: 5,
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
			}
		  }
	    }
      },
    }
  })

  if (showAll) return result.map(removeProjects)

  if (!user) return result.filter(loc => loc.loc_status === false).map(removeProjects)

  const usersProjects = await getIdsOfUsersProjects(user)

  return result
   .filter(loc => !loc.loc_status || loc.now_plr.find(now_plr => usersProjects.has(now_plr.pid)))
   .map(removeProjects)
}
