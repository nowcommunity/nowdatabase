import { AnyReference, EditableOccurrenceData, Role, User } from '../../../frontend/src/shared/types'
import { validateOccurrence } from '../../../frontend/src/shared/validators/occurrence'
import { AccessError } from '../middlewares/authorizer'
import { logDb, nowDb } from '../utils/db'
import { buildPersonLookupByInitials, getPersonDisplayName, getPersonFromLookup } from './utils/person'
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

export const ensureOccurrenceEditAccess = async (lid: number, user: User) => {
  if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return

  if (user.role === Role.EditRestricted) {
    const allowedLocalities = await getAllowedLocalities(user)
    if (!allowedLocalities.includes(lid)) throw new AccessError()
    return
  }

  throw new AccessError()
}

export const validateOccurrencePayload = (payload: EditableOccurrenceData) => {
  const validationErrors = (Object.keys(payload) as Array<keyof EditableOccurrenceData>)
    .map(fieldName => validateOccurrence(payload, fieldName))
    .filter(validation => !!validation.error)

  if (validationErrors.length > 0) {
    const details = validationErrors.map(validation => `${validation.name}: ${validation.error}`).join('; ')
    const error = new Error(details) as Error & { status: number }
    error.status = 400
    throw error
  }
}

type OccurrenceLogRow = Record<string, unknown> & {
  pk_data: string
  table_name: string
  luid?: number
  suid?: number
}

const readNumericField = (row: unknown, fieldName: 'luid' | 'suid'): number | null => {
  if (typeof row !== 'object' || row === null) return null
  const value = (row as Record<string, unknown>)[fieldName]
  return typeof value === 'number' ? value : null
}

const collectUniqueIds = (rows: OccurrenceLogRow[], fieldName: 'luid' | 'suid') => {
  const ids = new Set<number>()

  for (const row of rows) {
    const value = readNumericField(row, fieldName)
    if (value !== null) ids.add(value)
  }

  return Array.from(ids)
}

const isOccurrenceLogRow = (value: unknown): value is OccurrenceLogRow => {
  if (typeof value !== 'object' || value === null) return false

  const row = value as Record<string, unknown>

  return (
    row.table_name === 'now_ls' &&
    typeof row.pk_data === 'string' &&
    (typeof row.luid === 'number' || row.luid === undefined) &&
    (typeof row.suid === 'number' || row.suid === undefined)
  )
}

type OccurrenceUpdate = {
  occ_date: Date | null
  occ_authorizer: string
  occ_coordinator: string
  occ_comment: string
  references: AnyReference[]
  updates: OccurrenceLogRow[]
}

const getOccurrenceUpdates = async (lid: number, speciesId: number) => {
  const lidPk = `${lid.toString().length}.${lid};`
  const speciesPk = `${speciesId.toString().length}.${speciesId};`

  const candidateLogsRaw = await logDb.log.findMany({
    where: {
      table_name: 'now_ls',
      pk_data: { contains: lidPk },
    },
  })

  const nowLsLogs: OccurrenceLogRow[] = candidateLogsRaw.filter(
    (logRow): logRow is OccurrenceLogRow => isOccurrenceLogRow(logRow) && logRow.pk_data.includes(speciesPk)
  )

  const luids = collectUniqueIds(nowLsLogs, 'luid')
  const suids = collectUniqueIds(nowLsLogs, 'suid')

  const [localityUpdates, speciesUpdates] = await Promise.all([
    luids.length
      ? nowDb.now_lau.findMany({
          where: { luid: { in: luids } },
          include: {
            now_lr: {
              include: {
                ref_ref: {
                  include: { ref_authors: true, ref_journal: true },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
    suids.length
      ? nowDb.now_sau.findMany({
          where: { suid: { in: suids } },
          include: {
            now_sr: {
              include: {
                ref_ref: {
                  include: { ref_authors: true, ref_journal: true },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
  ])

  const peopleLookup = await buildPersonLookupByInitials([
    ...localityUpdates.flatMap(update => [update.lau_authorizer, update.lau_coordinator]),
    ...speciesUpdates.flatMap(update => [update.sau_authorizer, update.sau_coordinator]),
  ])

  const occurrenceUpdates: OccurrenceUpdate[] = [
    ...localityUpdates.map(update => ({
      occ_date: update.lau_date,
      occ_authorizer: getPersonDisplayName(
        getPersonFromLookup(peopleLookup, update.lau_authorizer),
        update.lau_authorizer
      ),
      occ_coordinator: getPersonDisplayName(
        getPersonFromLookup(peopleLookup, update.lau_coordinator),
        update.lau_coordinator
      ),
      occ_comment: update.lau_comment ?? '',
      references: update.now_lr as unknown as AnyReference[],
      updates: nowLsLogs.filter(logRow => logRow.luid === update.luid),
    })),
    ...speciesUpdates.map(update => ({
      occ_date: update.sau_date,
      occ_authorizer: getPersonDisplayName(
        getPersonFromLookup(peopleLookup, update.sau_authorizer),
        update.sau_authorizer
      ),
      occ_coordinator: getPersonDisplayName(
        getPersonFromLookup(peopleLookup, update.sau_coordinator),
        update.sau_coordinator
      ),
      occ_comment: update.sau_comment ?? '',
      references: update.now_sr as unknown as AnyReference[],
      updates: nowLsLogs.filter(logRow => logRow.suid === update.suid),
    })),
  ]

  return occurrenceUpdates.sort((a, b) => {
    const timeA = a.occ_date ? new Date(a.occ_date).getTime() : 0
    const timeB = b.occ_date ? new Date(b.occ_date).getTime() : 0
    return timeB - timeA
  })
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
      unique_identifier: string | null
      dms_lat: string | null
      dms_long: string | null
      bfa_max: string | null
      bfa_min: string | null
      max_age: number | null
      min_age: number | null
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
      now_oau: OccurrenceUpdate[]
    }>
  >(generateOccurrenceDetailSql(lid, speciesId))

  const occurrence = result[0]

  if (!occurrence) return null

  if (occurrence.loc_status) {
    if (!user) throw new AccessError()
    await ensureOccurrenceEditAccess(lid, user)
  }

  const occurrenceUpdates = await getOccurrenceUpdates(lid, speciesId)

  return {
    ...occurrence,
    now_oau: occurrenceUpdates,
  }
}
