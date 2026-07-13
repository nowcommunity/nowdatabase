import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { cloneSpeciesData } from './data'
import { OCCURRENCE_MERGE_FIELDS } from '../../services/speciesMerge'
import { SpeciesDetailsType } from '../../../../frontend/src/shared/types'

type MergeResponse = {
  message: string
  suid: number
  coordinator: string
  editor: string
  date: string
  comment: string
}

const buildSpeciesPayload = (overrides: Partial<ReturnType<typeof cloneSpeciesData>> = {}) => {
  return {
    ...cloneSpeciesData(),
    now_ls: [],
    ...overrides,
  }
}

const buildOccurrenceChoices = (
  lid: number,
  overrides?: Partial<Record<(typeof OCCURRENCE_MERGE_FIELDS)[number], 'accepted' | 'obsolete'>>
) => {
  const fieldChoice = OCCURRENCE_MERGE_FIELDS.reduce(
    (acc, field) => {
      acc[field] = 'accepted'
      return acc
    },
    {} as Record<(typeof OCCURRENCE_MERGE_FIELDS)[number], 'accepted' | 'obsolete'>
  )

  if (overrides) {
    for (const [field, value] of Object.entries(overrides)) {
      fieldChoice[field as (typeof OCCURRENCE_MERGE_FIELDS)[number]] = value
    }
  }

  return { lid, fieldChoice }
}

describe('Species merge endpoint', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('merges species, migrates synonyms, and deletes obsolete species', async () => {
    const references = cloneSpeciesData().references

    const acceptedPayload = buildSpeciesPayload({
      genus_name: 'MergeAcceptedGenus',
      species_name: 'mergeAccepted',
      diet1: 'a',
      now_ls: [
        {
          rowState: 'new',
          lid: 24750,
          mni: 1,
          source_name: 'Accepted Source',
          mesowear: 'bil',
        },
      ],
      com_taxa_synonym: [],
    })

    const obsoletePayload = buildSpeciesPayload({
      genus_name: 'MergeObsoleteGenus',
      species_name: 'mergeObsolete',
      diet1: 'b',
      now_ls: [
        {
          rowState: 'new',
          lid: 24750,
          mni: 2,
          source_name: 'Obsolete Source',
          mesowear: 'mix',
        },
      ],
      com_taxa_synonym: [
        {
          rowState: 'new',
          syn_genus_name: 'LegacyGenus',
          syn_species_name: 'legatus',
          syn_comment: 'legacy synonym',
        },
      ],
    })

    const acceptedCreate = await send<{ species_id: number }>('species', 'PUT', { species: acceptedPayload })
    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', { species: obsoletePayload })

    if (acceptedCreate.status !== 200) {
      throw new Error(`Accepted species create failed: ${JSON.stringify(acceptedCreate.body)}`)
    }
    if (obsoleteCreate.status !== 200) {
      throw new Error(`Obsolete species create failed: ${JSON.stringify(obsoleteCreate.body)}`)
    }

    const acceptedId = acceptedCreate.body.species_id
    const obsoleteId = obsoleteCreate.body.species_id

    const mergeResult = await send<MergeResponse>('admin/species-merge', 'POST', {
      obsoleteSpeciesId: obsoleteId,
      acceptedSpeciesId: acceptedId,
      selectedSpeciesFieldValues: {
        diet1: 'b',
      },
      occurrenceFieldChoices: [
        buildOccurrenceChoices(24750, {
          mni: 'obsolete',
          source_name: 'obsolete',
          mesowear: 'obsolete',
        }),
      ],
      addObsoleteAsSynonym: true,
      synonymComment: 'merged synonym',
      addSourceNameToOccurrences: false,
      comment: 'merge species',
      references,
    })

    if (mergeResult.status !== 200) {
      throw new Error(`Merge failed: ${JSON.stringify(mergeResult.body)}`)
    }
    expect(mergeResult.body.message).toEqual('SPECIES MERGED SUCCESSFULLY')
    expect(typeof mergeResult.body.suid).toEqual('number')

    const { body: mergedSpecies, status: mergedStatus } = await send<SpeciesDetailsType>(`species/${acceptedId}`, 'GET')
    expect(mergedStatus).toEqual(200)
    expect(mergedSpecies.diet1).toEqual('b')

    const mergedOccurrence = mergedSpecies.now_ls.find(ls => ls.lid === 24750)
    expect(mergedOccurrence).toBeDefined()
    expect(mergedOccurrence?.mni).toEqual(2)
    expect(mergedOccurrence?.source_name).toEqual('Obsolete Source')
    expect(mergedOccurrence?.mesowear).toEqual('mix')

    const synonymNames = mergedSpecies.com_taxa_synonym.map(syn => `${syn.syn_genus_name} ${syn.syn_species_name}`)
    expect(synonymNames).toContain('LegacyGenus legatus')
    expect(synonymNames).toContain('MergeObsoleteGenus mergeObsolete')

    const obsoleteFetch = await send(`species/${obsoleteId}`, 'GET')
    expect(obsoleteFetch.status).toEqual(404)
  })

  it('requires references', async () => {
    const acceptedCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: buildSpeciesPayload({ genus_name: 'RefAcceptGenus' }),
    })

    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: buildSpeciesPayload({ genus_name: 'RefObsoleteGenus' }),
    })

    const mergeResult = await send('admin/species-merge', 'POST', {
      obsoleteSpeciesId: obsoleteCreate.body.species_id,
      acceptedSpeciesId: acceptedCreate.body.species_id,
      selectedSpeciesFieldValues: {},
      occurrenceFieldChoices: [],
      addObsoleteAsSynonym: false,
      addSourceNameToOccurrences: false,
      comment: 'merge species',
      references: [],
    })

    if (mergeResult.status !== 400) {
      throw new Error(
        `Expected 400 for missing references, got ${mergeResult.status}: ${JSON.stringify(mergeResult.body)}`
      )
    }
  })

  it('summary includes non-taxonomic fields and omits taxonomic fields', async () => {
    const acceptedCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: buildSpeciesPayload({ genus_name: 'SummaryAcceptGenus' }),
    })

    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: buildSpeciesPayload({ genus_name: 'SummaryObsoleteGenus' }),
    })

    const summaryResult = await send<{
      speciesFieldChoices: Array<{ field: string }>
    }>(
      `admin/species-merge/summary?obsoleteId=${obsoleteCreate.body.species_id}&acceptedId=${acceptedCreate.body.species_id}`,
      'GET'
    )

    if (summaryResult.status !== 200) {
      throw new Error(`Summary failed: ${JSON.stringify(summaryResult.body)}`)
    }

    const fields = summaryResult.body.speciesFieldChoices.map(choice => choice.field)
    expect(fields).toContain('diet_description')
    expect(fields).not.toContain('order_name')
  })

  it('merges numeric fields according to selection', async () => {
    const references = cloneSpeciesData().references

    const acceptedCreate = await send<{ species_id: number }>('species', 'PUT', {
      //@ts-expect-error body_mass is expected to be a BigInt
      species: buildSpeciesPayload({ genus_name: 'BoolAcceptGenus', body_mass: 10 }),
    })

    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', {
      //@ts-expect-error body_mass is expected to be a BigInt
      species: buildSpeciesPayload({ genus_name: 'BoolObsoleteGenus', body_mass: 99 }),
    })

    const acceptedId = acceptedCreate.body.species_id
    const obsoleteId = obsoleteCreate.body.species_id

    const mergeResult = await send<MergeResponse>('admin/species-merge', 'POST', {
      obsoleteSpeciesId: obsoleteId,
      acceptedSpeciesId: acceptedId,
      selectedSpeciesFieldValues: {
        body_mass: 99,
      },
      occurrenceFieldChoices: [],
      addObsoleteAsSynonym: false,
      addSourceNameToOccurrences: false,
      comment: 'merge boolean/numeric',
      references,
    })

    if (mergeResult.status !== 200) {
      throw new Error(`Merge failed: ${JSON.stringify(mergeResult.body)}`)
    }

    const { body: mergedSpecies, status: mergedStatus } = await send<SpeciesDetailsType>(`species/${acceptedId}`, 'GET')
    expect(mergedStatus).toEqual(200)
    expect(mergedSpecies.body_mass).toEqual(99)
  })

  it('rejects non-admin users', async () => {
    const acceptedCreateResult = await send<{ species_id: number }>('species', 'PUT', {
      species: buildSpeciesPayload({ genus_name: 'UserRightTestAcceptedGenus' }),
    })
    expect(acceptedCreateResult.status).toEqual(200)

    const obsoleteCreateResult = await send<{ species_id: number }>('species', 'PUT', {
      species: buildSpeciesPayload({ genus_name: 'UserRightTestObsoleteGenus' }),
    })
    expect(obsoleteCreateResult.status).toEqual(200)

    const acceptedId = acceptedCreateResult.body.species_id
    const obsoleteId = obsoleteCreateResult.body.species_id
    const references = cloneSpeciesData().references

    logout()
    const anonymousUserResult = await send('admin/species-merge', 'POST', {
      obsoleteSpeciesId: obsoleteId,
      acceptedSpeciesId: acceptedId,
      selectedSpeciesFieldValues: {},
      occurrenceFieldChoices: [],
      addObsoleteAsSynonym: false,
      addSourceNameToOccurrences: false,
      comment: 'merge species',
      references,
    })
    expect(anonymousUserResult.body).toEqual(noPermError)
    expect(anonymousUserResult.status).toEqual(403)

    await login('testEr')
    const erResult = await send('admin/species-merge', 'POST', {
      obsoleteSpeciesId: obsoleteId,
      acceptedSpeciesId: acceptedId,
      selectedSpeciesFieldValues: {},
      occurrenceFieldChoices: [],
      addObsoleteAsSynonym: false,
      addSourceNameToOccurrences: false,
      comment: 'merge species',
      references,
    })
    expect(erResult.status).toEqual(403)
    expect(erResult.body).toEqual(noPermError)

    await login('testEu')
    const euResult = await send('admin/species-merge', 'POST', {
      obsoleteSpeciesId: obsoleteId,
      acceptedSpeciesId: acceptedId,
      selectedSpeciesFieldValues: {},
      occurrenceFieldChoices: [],
      addObsoleteAsSynonym: false,
      addSourceNameToOccurrences: false,
      comment: 'merge species',
      references,
    })
    expect(euResult.status).toEqual(403)
    expect(euResult.body).toEqual(noPermError)
  })
})
