import { Reference, User } from '../../../frontend/src/shared/types'
import { referenceValidator } from '../../../frontend/src/shared/validators/validator'
import { getReferenceDetails } from './reference'
import { deleteSpecies } from './write/species'
import { fixBigInt } from '../utils/common'
import { getFieldsOfTables, nowDb } from '../utils/db'
import { NOW_DB_NAME } from '../utils/config'
import { WriteHandler } from './write/writeOperations/writeHandler'

type SpeciesSummary = {
  species_id: number
  order_name: string | null
  family_name: string | null
  genus_name: string | null
  species_name: string | null
  subclass_or_superorder_name: string | null
  suborder_or_superfamily_name: string | null
  subfamily_name: string | null
  unique_identifier: string | null
  localities: number
  sv_length: string | null
  body_mass: number | null
  sd_size: string | null
  sd_display: string | null
  tshm: string | null
  tht: string | null
  crowntype: string | null
  diet1: string | null
  diet2: string | null
  diet3: string | null
  locomo1: string | null
  locomo2: string | null
  locomo3: string | null
  sp_author?: string | null
}

type SpeciesFieldChoice = {
  field: string
  obsoleteValue: string | number | boolean | null
  acceptedValue: string | number | boolean | null
  defaultChoice: 'accepted' | 'obsolete'
}

export const OCCURRENCE_MERGE_FIELDS = [
  'nis',
  'pct',
  'quad',
  'mni',
  'qua',
  'id_status',
  'orig_entry',
  'source_name',
  'body_mass',
  'mesowear',
  'mw_or_high',
  'mw_or_low',
  'mw_cs_sharp',
  'mw_cs_round',
  'mw_cs_blunt',
  'mw_scale_min',
  'mw_scale_max',
  'mw_value',
  'microwear',
  'dc13_mean',
  'dc13_n',
  'dc13_max',
  'dc13_min',
  'dc13_stdev',
  'do18_mean',
  'do18_n',
  'do18_max',
  'do18_min',
  'do18_stdev',
] as const

export type OccurrenceMergeField = (typeof OCCURRENCE_MERGE_FIELDS)[number]

type OccurrenceConflict = {
  lid: number
  localityName: string | null
  country: string | null
  obsolete: Record<OccurrenceMergeField, string | number | null>
  accepted: Record<OccurrenceMergeField, string | number | null>
  defaultChoice: Record<OccurrenceMergeField, 'accepted' | 'obsolete'>
}

type SpeciesMergeSummaryResponse = {
  obsolete: SpeciesSummary
  accepted: SpeciesSummary
  speciesFieldChoices: SpeciesFieldChoice[]
  occurrenceConflicts: OccurrenceConflict[]
}

export type SpeciesMergeRequest = {
  obsoleteSpeciesId: number
  acceptedSpeciesId: number
  selectedSpeciesFieldValues: Record<string, string | number | null>
  occurrenceFieldChoices: Array<{
    lid: number
    fieldChoice: Record<OccurrenceMergeField, 'accepted' | 'obsolete'>
  }>
  addObsoleteAsSynonym: boolean
  synonymComment?: string
  addSourceNameToOccurrences: boolean
  comment: string
  references: Reference[]
}

export type SpeciesMergeResponse = {
  message: 'SPECIES MERGED SUCCESSFULLY'
  suid: number
  coordinator: string
  editor: string
  date: string
  comment: string
}

const SPECIES_SUMMARY_FIELDS = {
  species_id: true,
  order_name: true,
  family_name: true,
  genus_name: true,
  species_name: true,
  subclass_or_superorder_name: true,
  suborder_or_superfamily_name: true,
  subfamily_name: true,
  unique_identifier: true,
  sv_length: true,
  body_mass: true,
  sd_size: true,
  sd_display: true,
  tshm: true,
  tht: true,
  crowntype: true,
  diet1: true,
  diet2: true,
  diet3: true,
  locomo1: true,
  locomo2: true,
  locomo3: true,
  sp_author: true,
} as const

const SPECIES_COPY_FIELDS = [
  'taxonomic_status',
  'common_name',
  'sp_author',
  'strain',
  'gene',
  'taxon_status',
  'diet1',
  'diet2',
  'diet3',
  'diet_description',
  'rel_fib',
  'selectivity',
  'digestion',
  'feedinghab1',
  'feedinghab2',
  'shelterhab1',
  'shelterhab2',
  'locomo1',
  'locomo2',
  'locomo3',
  'hunt_forage',
  'body_mass',
  'brain_mass',
  'sv_length',
  'activity',
  'sd_size',
  'sd_display',
  'tshm',
  'symph_mob',
  'relative_blade_length',
  'tht',
  'crowntype',
  'microwear',
  'horizodonty',
  'cusp_shape',
  'cusp_count_buccal',
  'cusp_count_lingual',
  'loph_count_lon',
  'loph_count_trs',
  'fct_al',
  'fct_ol',
  'fct_sf',
  'fct_ot',
  'fct_cm',
  'mesowear',
  'mw_or_high',
  'mw_or_low',
  'mw_cs_sharp',
  'mw_cs_round',
  'mw_cs_blunt',
  'mw_scale_min',
  'mw_scale_max',
  'mw_value',
  'pop_struc',
  'sp_comment',
]

type SpeciesCopyField = (typeof SPECIES_COPY_FIELDS)[number]

const isEmptyValue = (value: unknown) => value === null || value === undefined || value === ''

const normalizeStringValue = (value: unknown) => (value === '' ? null : (value as string | number | null))

const normalizeBodyMass = (value: unknown) => {
  if (typeof value === 'number') return Math.trunc(value)
  if (value === null || value === undefined) return null
  return value as number | null
}

const buildSpeciesDisplayName = (species: {
  genus_name: string | null
  species_name: string | null
  unique_identifier: string | null
  species_id: number
}) => {
  const name = `${species.genus_name ?? ''} ${species.species_name ?? ''}`.trim()
  if (name) return name
  if (species.unique_identifier) return species.unique_identifier
  return `${species.species_id}`
}

const appendSourceName = (sourceName: string | null, obsoleteName: string) => {
  const trimmed = obsoleteName.trim()
  if (!trimmed) return sourceName
  if (!sourceName || sourceName.trim() === '') return trimmed

  const normalizedSource = sourceName.toLowerCase()
  if (normalizedSource.includes(trimmed.toLowerCase())) return sourceName

  return `${sourceName}; ${trimmed}`
}

const getMergeWriteHandler = () => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'com_species',
    idColumn: 'species_id',
    allowedColumns: getFieldsOfTables(['com_species', 'now_ls', 'now_sau', 'now_sr', 'now_lau', 'com_taxa_synonym']),
    type: 'update',
  })
}

const buildOccurrenceSelect = () => {
  const fields = OCCURRENCE_MERGE_FIELDS.reduce<Record<string, boolean>>((acc, field) => {
    acc[field] = true
    return acc
  }, {})

  return {
    lid: true,
    ...fields,
    now_loc: {
      select: {
        loc_name: true,
        country: true,
      },
    },
  }
}

const buildSpeciesSummary = async (speciesId: number): Promise<SpeciesSummary | null> => {
  const species = await nowDb.com_species.findUnique({
    where: { species_id: speciesId },
    select: SPECIES_SUMMARY_FIELDS,
  })

  if (!species) return null

  const localities = await nowDb.now_ls.count({ where: { species_id: speciesId } })

  return {
    ...(species as SpeciesSummary),
    localities,
  }
}

const buildSpeciesCopyValues = async (
  speciesId: number
): Promise<Record<SpeciesCopyField, string | number | boolean | null> | null> => {
  const selectFields = SPECIES_COPY_FIELDS.reduce<Record<SpeciesCopyField, boolean>>((acc, field) => {
    acc[field] = true
    return acc
  }, {})

  const species = await nowDb.com_species.findUnique({
    where: { species_id: speciesId },
    select: selectFields,
  })

  return (species ?? null) as Record<SpeciesCopyField, string | number | boolean | null> | null
}

const buildSpeciesFieldChoices = (
  obsolete: Record<SpeciesCopyField, string | number | boolean | null>,
  accepted: Record<SpeciesCopyField, string | number | boolean | null>
): SpeciesFieldChoice[] => {
  return SPECIES_COPY_FIELDS.map(field => {
    const obsoleteValue = obsolete[field]
    const acceptedValue = accepted[field]

    const defaultChoice = isEmptyValue(acceptedValue) && !isEmptyValue(obsoleteValue) ? 'obsolete' : 'accepted'

    return {
      field,
      obsoleteValue,
      acceptedValue,
      defaultChoice,
    }
  })
}

type OccurrenceRow = Partial<Record<OccurrenceMergeField, string | number | null>> & {
  now_loc?: { loc_name: string | null; country: string | null }
}

const buildOccurrenceConflict = (
  lid: number,
  obsoleteRow: OccurrenceRow,
  acceptedRow: OccurrenceRow
): OccurrenceConflict => {
  const obsoleteValues = {} as Record<OccurrenceMergeField, string | number | null>
  const acceptedValues = {} as Record<OccurrenceMergeField, string | number | null>
  const defaultChoice = {} as Record<OccurrenceMergeField, 'accepted' | 'obsolete'>

  for (const field of OCCURRENCE_MERGE_FIELDS) {
    const obsoleteValue = obsoleteRow[field]
    const acceptedValue = acceptedRow[field]

    obsoleteValues[field] = obsoleteValue ?? null
    acceptedValues[field] = acceptedValue ?? null
    defaultChoice[field] = isEmptyValue(acceptedValue) && !isEmptyValue(obsoleteValue) ? 'obsolete' : 'accepted'
  }

  return {
    lid,
    localityName: acceptedRow.now_loc?.loc_name ?? obsoleteRow.now_loc?.loc_name ?? null,
    country: acceptedRow.now_loc?.country ?? obsoleteRow.now_loc?.country ?? null,
    obsolete: obsoleteValues,
    accepted: acceptedValues,
    defaultChoice,
  }
}

export const getSpeciesMergeSummary = async (
  obsoleteSpeciesId: number,
  acceptedSpeciesId: number
): Promise<SpeciesMergeSummaryResponse | null> => {
  const [obsoleteSummary, acceptedSummary] = await Promise.all([
    buildSpeciesSummary(obsoleteSpeciesId),
    buildSpeciesSummary(acceptedSpeciesId),
  ])

  if (!obsoleteSummary || !acceptedSummary) return null

  const [obsoleteCopyValues, acceptedCopyValues] = await Promise.all([
    buildSpeciesCopyValues(obsoleteSpeciesId),
    buildSpeciesCopyValues(acceptedSpeciesId),
  ])

  if (!obsoleteCopyValues || !acceptedCopyValues) return null

  const [obsoleteRows, acceptedRows] = await Promise.all([
    nowDb.now_ls.findMany({
      where: { species_id: obsoleteSpeciesId },
      select: buildOccurrenceSelect(),
    }),
    nowDb.now_ls.findMany({
      where: { species_id: acceptedSpeciesId },
      select: buildOccurrenceSelect(),
    }),
  ])

  const obsoleteByLid = new Map<number, (typeof obsoleteRows)[number]>()
  for (const row of obsoleteRows) obsoleteByLid.set(row.lid, row)

  const acceptedByLid = new Map<number, (typeof acceptedRows)[number]>()
  for (const row of acceptedRows) acceptedByLid.set(row.lid, row)

  const occurrenceConflicts: OccurrenceConflict[] = []
  for (const [lid, obsoleteRow] of obsoleteByLid.entries()) {
    const acceptedRow = acceptedByLid.get(lid)
    if (!acceptedRow) continue

    occurrenceConflicts.push(buildOccurrenceConflict(lid, obsoleteRow, acceptedRow))
  }

  const speciesFieldChoices = buildSpeciesFieldChoices(obsoleteCopyValues, acceptedCopyValues)

  const result: SpeciesMergeSummaryResponse = {
    obsolete: obsoleteSummary,
    accepted: acceptedSummary,
    speciesFieldChoices,
    occurrenceConflicts,
  }

  return JSON.parse(fixBigInt(result) ?? 'null') as SpeciesMergeSummaryResponse
}

const validateReferences = async (references: Reference[]) => {
  const validationError = referenceValidator(references)
  if (validationError) {
    throw new Error(validationError)
  }

  const invalidReferences: number[] = []
  for (const reference of references) {
    if (typeof reference.rid !== 'number') {
      invalidReferences.push(reference.rid as number)
      continue
    }
    const result = await getReferenceDetails(reference.rid)
    if (!result) invalidReferences.push(reference.rid)
  }

  if (invalidReferences.length > 0) {
    throw new Error(`References with ID(s) ${invalidReferences.join(', ')} do not exist`)
  }
}

const buildSynonymKey = (genus: string | null, species: string | null) =>
  `${(genus ?? '').trim().toLowerCase()}|${(species ?? '').trim().toLowerCase()}`

const buildOccurrenceFieldChoiceMap = (occurrenceFieldChoices: SpeciesMergeRequest['occurrenceFieldChoices']) => {
  const choiceMap = new Map<number, Record<OccurrenceMergeField, 'accepted' | 'obsolete'>>()
  for (const choice of occurrenceFieldChoices) {
    choiceMap.set(choice.lid, choice.fieldChoice)
  }
  return choiceMap
}

export const mergeSpecies = async (payload: SpeciesMergeRequest, user: User): Promise<SpeciesMergeResponse> => {
  const {
    obsoleteSpeciesId,
    acceptedSpeciesId,
    selectedSpeciesFieldValues,
    occurrenceFieldChoices,
    addObsoleteAsSynonym,
    synonymComment,
    addSourceNameToOccurrences,
    comment,
    references,
  } = payload

  if (!references || references.length === 0) {
    throw new Error('References are required')
  }

  await validateReferences(references)

  const [obsoleteSpecies, acceptedSpecies] = await Promise.all([
    nowDb.com_species.findUnique({ where: { species_id: obsoleteSpeciesId } }),
    nowDb.com_species.findUnique({ where: { species_id: acceptedSpeciesId } }),
  ])

  if (!obsoleteSpecies || !acceptedSpecies) {
    throw new Error('Species not found')
  }

  const obsoleteName = buildSpeciesDisplayName(obsoleteSpecies)

  const [obsoleteOccurrences, acceptedOccurrences] = await Promise.all([
    nowDb.now_ls.findMany({ where: { species_id: obsoleteSpeciesId } }),
    nowDb.now_ls.findMany({ where: { species_id: acceptedSpeciesId } }),
  ])

  const acceptedByLid = new Map<number, (typeof acceptedOccurrences)[number]>()
  for (const row of acceptedOccurrences) acceptedByLid.set(row.lid, row)

  const occurrenceChoiceMap = buildOccurrenceFieldChoiceMap(occurrenceFieldChoices)

  const writeHandler = getMergeWriteHandler()

  try {
    await writeHandler.start()
    writeHandler.idValue = acceptedSpeciesId

    const allowedSpeciesFieldSet = new Set(SPECIES_COPY_FIELDS)
    const speciesUpdates: Record<string, string | number | null> = {}
    for (const [field, value] of Object.entries(selectedSpeciesFieldValues ?? {})) {
      if (!allowedSpeciesFieldSet.has(field)) {
        throw new Error(`Invalid species field: ${field}`)
      }
      if (value === undefined) continue
      speciesUpdates[field] = normalizeStringValue(value)
    }

    if (Object.keys(speciesUpdates).length > 0) {
      await writeHandler.updateObject('com_species', { species_id: acceptedSpeciesId, ...speciesUpdates }, [
        'species_id',
      ])
    }

    for (const obsoleteRow of obsoleteOccurrences) {
      const acceptedRow = acceptedByLid.get(obsoleteRow.lid)
      if (acceptedRow) {
        const choice = occurrenceChoiceMap.get(obsoleteRow.lid)
        if (!choice) {
          throw new Error(`Missing occurrence field choices for lid ${obsoleteRow.lid}`)
        }

        const mergedRow = { ...acceptedRow } as Record<string, unknown>
        for (const field of OCCURRENCE_MERGE_FIELDS) {
          const fieldChoice = choice[field]
          if (!fieldChoice) {
            throw new Error(`Missing occurrence field choice for lid ${obsoleteRow.lid}, field ${field}`)
          }
          const selectedValue = fieldChoice === 'obsolete' ? obsoleteRow[field] : acceptedRow[field]
          mergedRow[field] = normalizeStringValue(selectedValue)
        }

        mergedRow.source_name = addSourceNameToOccurrences
          ? appendSourceName(mergedRow.source_name as string | null, obsoleteName)
          : mergedRow.source_name
        mergedRow.body_mass = normalizeBodyMass(mergedRow.body_mass)

        await writeHandler.updateObject('now_ls', mergedRow, ['lid', 'species_id'])
        await writeHandler.deleteObject('now_ls', { lid: obsoleteRow.lid, species_id: obsoleteSpeciesId }, [
          'lid',
          'species_id',
        ])
      } else {
        const newRow = {
          ...obsoleteRow,
          species_id: acceptedSpeciesId,
        } as Record<string, unknown>

        newRow.source_name = addSourceNameToOccurrences
          ? appendSourceName(newRow.source_name as string | null, obsoleteName)
          : newRow.source_name
        newRow.body_mass = normalizeBodyMass(newRow.body_mass)

        await writeHandler.createObject('now_ls', newRow, ['lid', 'species_id'])
        await writeHandler.deleteObject('now_ls', { lid: obsoleteRow.lid, species_id: obsoleteSpeciesId }, [
          'lid',
          'species_id',
        ])
      }
    }

    const [obsoleteSynonyms, acceptedSynonyms] = await Promise.all([
      nowDb.com_taxa_synonym.findMany({ where: { species_id: obsoleteSpeciesId } }),
      nowDb.com_taxa_synonym.findMany({ where: { species_id: acceptedSpeciesId } }),
    ])

    const acceptedSynonymKeys = new Set(
      acceptedSynonyms.map(syn => buildSynonymKey(syn.syn_genus_name, syn.syn_species_name))
    )

    const synonymsToAdd = obsoleteSynonyms
      .filter(syn => !acceptedSynonymKeys.has(buildSynonymKey(syn.syn_genus_name, syn.syn_species_name)))
      .map(syn => ({
        species_id: acceptedSpeciesId,
        syn_genus_name: syn.syn_genus_name,
        syn_species_name: syn.syn_species_name,
        syn_comment: syn.syn_comment,
        rowState: 'new' as const,
      }))

    if (addObsoleteAsSynonym) {
      const key = buildSynonymKey(obsoleteSpecies.genus_name, obsoleteSpecies.species_name)
      if (!acceptedSynonymKeys.has(key)) {
        synonymsToAdd.push({
          species_id: acceptedSpeciesId,
          syn_genus_name: obsoleteSpecies.genus_name,
          syn_species_name: obsoleteSpecies.species_name,
          syn_comment: synonymComment ?? null,
          rowState: 'new' as const,
        })
      }
    }

    if (synonymsToAdd.length > 0) {
      await writeHandler.applyListChanges('com_taxa_synonym', synonymsToAdd, ['synonym_id', 'species_id'])
    }

    await writeHandler.logUpdatesAndComplete(user.initials, comment, references)
  } catch (error) {
    await writeHandler.rollback()
    await writeHandler.end()
    throw error
  }

  await deleteSpecies(obsoleteSpeciesId, user)

  const latestUpdate = await nowDb.now_sau.findFirst({
    where: { species_id: acceptedSpeciesId },
    orderBy: { suid: 'desc' },
  })

  if (!latestUpdate) {
    throw new Error('Merge succeeded but update log entry was not found')
  }

  const date = latestUpdate.sau_date
    ? latestUpdate.sau_date.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)

  return {
    message: 'SPECIES MERGED SUCCESSFULLY',
    suid: latestUpdate.suid,
    coordinator: latestUpdate.sau_coordinator,
    editor: latestUpdate.sau_authorizer,
    date,
    comment,
  }
}
