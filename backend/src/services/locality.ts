import { EditDataType, EditMetaData, LocalityDetailsType, User, Role } from '../../../frontend/src/shared/types'
import { validateLocality } from '../../../frontend/src/shared/validators/locality'
import { ValidationObject, referenceValidator } from '../../../frontend/src/shared/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'
import { AccessError } from '../middlewares/authorizer'
import { fixBigInt } from '../utils/common'
import { logDb, nowDb } from '../utils/db'
import { logger } from '../utils/logger'
import { getReferenceDetails } from './reference'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

type LocalityPreFilter = {
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
  age_comm: string | null
  basin: string | null
  subbasin: string | null
  dms_lat: string | null
  dms_long: string | null
  dec_lat: number
  dec_long: number
  altitude: string | null
  country: string
  state: string | null
  county: string | null
  site_area: string | null
  gen_loc: string | null
  plate: string | null
  formation: string | null
  member: string | null
  bed: string | null
  loc_status: boolean | null
  now_plr: {
    pid: number
  }[]
}

export const getAllLocalities = async (user?: User) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  const removeProjects: (loc: LocalityPreFilter) => Omit<LocalityPreFilter, 'now_plr'> = loc => {
    const { now_plr, ...rest } = loc
    return rest
  }

  const localityResult = (await nowDb.now_loc.findMany({
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
      age_comm: true,
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
      appr_num_spm: true,
      site_area: true,
      gen_loc: true,
      plate: true,
      formation: true,
      member: true,
      bed: true,
      loc_status: true,
      estimate_precip: true,
      estimate_temp: true,
      estimate_npp: true,
      pers_woody_cover: true,
      pers_pollen_ap: true,
      pers_pollen_nap: true,
      pers_pollen_other: true,
      hominin_skeletal_remains: true,
      bipedal_footprints: true,
      stone_tool_cut_marks_on_bones: true,
      stone_tool_technology: true,
      technological_mode_1: true,
      technological_mode_2: true,
      technological_mode_3: true,
      cultural_stage_1: true,
      cultural_stage_2: true,
      cultural_stage_3: true,
      regional_culture_1: true,
      regional_culture_2: true,
      regional_culture_3: true,
      now_plr: {
        select: { pid: true },
      },
    },
  })) as LocalityPreFilter[]

  const synonyms: { lid: number }[] = await nowDb.now_syn_loc.findMany({
    select: { lid: true },
    distinct: ['lid'],
  })

  const synonymIdSet = new Set(synonyms.map(s => s.lid))
  const result = localityResult.map(loc => ({
    ...loc,
    has_synonym: synonymIdSet.has(loc.lid),
  }))

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

export const validateEntireLocality = async (editedFields: EditDataType<Prisma.now_loc> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateLocality(editedFields as EditDataType<LocalityDetailsType>, key as keyof LocalityDetailsType)
    if (error.error) errors.push(error)
  }
  let error = null
  if ('references' in editedFields && editedFields.references) {
    error = referenceValidator(editedFields.references)
    const invalidReferences: number[] = []
    for (const reference of editedFields.references) {
      const result = await getReferenceDetails(reference.rid)
      if (!result) {
        invalidReferences.push(reference.rid)
      }
    }
    if (invalidReferences.length > 0) {
      error = `References with ID(s) ${invalidReferences.join(', ')} do not exist`
    }
  } else {
    error = 'references-key is undefined in the data'
  }

  if (error) errors.push({ name: 'references', error: error })
  return errors
}

export const filterDuplicateLocalitySpecies = async (
  locality: EditDataType<LocalityDetailsType>,
  user: User | undefined
) => {
  if (!locality.lid) return

  // Get existing data of locality
  const localityDetails = await getLocalityDetails(locality.lid, user)
  if (!localityDetails) return

  // Get all pre-existing species_ids from current locality
  const localityDetailsSpeciesIds: number[] = []
  for (const localitySpecies of localityDetails.now_ls) {
    localityDetailsSpeciesIds.push(localitySpecies.species_id)
  }

  // Compare if the species already exists and that we are trying to add it again
  // and filter those cases out
  const updatedLocalityNow_ls = locality.now_ls.filter(localitySpecies => {
    if (localitySpecies.species_id) {
      // Logic is flipped for filter as we want to skip the ones the check matches
      return !(localityDetailsSpeciesIds.includes(localitySpecies.species_id) && localitySpecies.rowState === 'new')
    }

    // code shouldn't get here ever
    logger.info(
      `Filter already existing species: localitySpecies didn't have species_id. Skipping. ${JSON.stringify(localitySpecies)}`
    )
    return false
  })

  return updatedLocalityNow_ls
}
