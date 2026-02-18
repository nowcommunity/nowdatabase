import { Locality, Museum, EditDataType, EditMetaData } from '../../../frontend/src/shared/types'
import { nowDb } from '../utils/db'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import type Prisma from '../../prisma/generated/now_test_client'
import { validateMuseum } from '../../../frontend/src/shared/validators/museum'
import { TabListQueryOptions } from './tabularQuery'

export const getAllMuseums = async () => {
  const result = await nowDb.com_mlist.findMany({})
  return result
}

export const getMuseumDetails = async (id: string, options?: TabListQueryOptions) => {
  const museum = await nowDb.com_mlist.findUnique({
    where: { museum: id },
  })

  if (!museum) return null

  const localityLinks = await nowDb.now_mus.findMany({
    where: { museum: id },
    select: { lid: true },
  })

  const localityIds = localityLinks.map(link => link.lid)

  const orderBy = options?.sorting.map(sort => ({
    [sort.id]: sort.desc ? 'desc' : 'asc',
  }))

  const localitiesResult = await nowDb.now_loc.findMany({
    where: { lid: { in: localityIds } },
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
      now_syn_loc: {
        select: { synonym: true },
      },
    },
    orderBy,
    skip: options?.skip,
    take: options?.take,
  })

  const localities: Locality[] = localitiesResult.map(locality => {
    const synonyms = locality.now_syn_loc
      .map(({ synonym }) => synonym)
      .filter((syn): syn is string => typeof syn === 'string' && syn.trim().length > 0)

    const { now_syn_loc, altitude, appr_num_spm, country, ...rest } = locality

    return {
      ...rest,
      country: country ?? '',
      altitude: altitude ?? 0,
      appr_num_spm: appr_num_spm ?? 0,
      synonyms,
      has_synonym: synonyms.length > 0,
    }
  })

  const combined = {
    ...museum,
    localities,
  }

  return combined
}

export const validateEntireMuseum = (editedFields: EditDataType<Prisma.com_mlist> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateMuseum(editedFields as EditDataType<Museum>, key as keyof Museum)
    if (error.error) errors.push(error)
  }
  return errors
}
