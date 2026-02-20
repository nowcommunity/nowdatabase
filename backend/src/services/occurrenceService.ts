import { Role, User } from '../../../frontend/src/shared/types'
import { AccessError } from '../middlewares/authorizer'
import { nowDb } from '../utils/db'
import { generateOccurrenceDetailSql } from './queries/crossSearchQuery'

const getAllowedLocalities = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  const projectIDs = Array.from(new Set(usersProjects.map(({ pid }) => pid)))

  const localities = await nowDb.now_plr.findMany({
    where: { pid: { in: projectIDs } },
    select: { lid: true },
  })

  return Array.from(new Set(localities.map(({ lid }) => lid)))
}

export const parseOccurrenceRouteParams = (lid: string, speciesId: string) => {
  const parsedLid = parseInt(lid, 10)
  const parsedSpeciesId = parseInt(speciesId, 10)

  if (Number.isNaN(parsedLid) || Number.isNaN(parsedSpeciesId)) {
    const error = new Error('lid and species_id must be valid integers')
    ;(error as Error & { status: number }).status = 400
    throw error
  }

  return { lid: parsedLid, speciesId: parsedSpeciesId }
}

export const getOccurrenceByCompositeKey = async (lid: number, speciesId: number, user?: User) => {
  const result = await nowDb.$queryRaw<
    Array<{
      lid: number
      species_id: number
      loc_status: boolean | null
      loc_name: string
      country: string
      genus_name: string
      species_name: string
      nis: number | null
      pct: number | null
      quad: number | null
      mni: number | null
      qua: string | null
      id_status: string | null
      orig_entry: string | null
      source_name: string | null
      body_mass: bigint | null
      mesowear: string | null
      mw_or_high: number | null
      mw_or_low: number | null
      mw_cs_sharp: number | null
      mw_cs_round: number | null
      mw_cs_blunt: number | null
      mw_scale_min: number | null
      mw_scale_max: number | null
      mw_value: number | null
      microwear: string | null
      dc13_mean: number | null
      dc13_n: number | null
      dc13_max: number | null
      dc13_min: number | null
      dc13_stdev: number | null
      do18_mean: number | null
      do18_n: number | null
      do18_max: number | null
      do18_min: number | null
      do18_stdev: number | null
    }>
  >(generateOccurrenceDetailSql(lid, speciesId))

  const occurrence = result[0]

  if (!occurrence) return null

  if (occurrence.loc_status) {
    if (!user) throw new AccessError()
    if (![Role.Admin, Role.EditUnrestricted].includes(user.role)) {
      const allowedLocalities = await getAllowedLocalities(user)
      if (!allowedLocalities.includes(lid)) throw new AccessError()
    }
  }

  return occurrence
}
