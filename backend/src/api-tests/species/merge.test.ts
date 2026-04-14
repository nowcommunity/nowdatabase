import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool } from '../../utils/db'
import { login, noPermError, resetDatabaseTimeout, send, setToken } from '../utils'
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
    const resetResult = await send('test/reset-test-database', 'GET')
    expect(resetResult.status).toEqual(200)
    const createUsersResult = await send('test/create-test-users', 'GET')
    expect(createUsersResult.status).toEqual(200)
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)
    setToken(loginResult.body.token)
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)
    setToken(loginResult.body.token)
  })

  afterAll(async () => {
    await pool.end()
  })

  it('merges species, migrates synonyms, and deletes obsolete species', async () => {
    const references = cloneSpeciesData().references

    const acceptedPayload = {
      ...cloneSpeciesData(),
      genus_name: 'MergeAcceptedGenus',
      species_name: 'mergeAccepted',
      unique_identifier: 'merge-accepted',
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
      comment: 'create accepted',
      references,
    }

    const obsoletePayload = {
      ...cloneSpeciesData(),
      genus_name: 'MergeObsoleteGenus',
      species_name: 'mergeObsolete',
      unique_identifier: 'merge-obsolete',
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
      comment: 'create obsolete',
      references,
    }

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
    const references = cloneSpeciesData().references
    const acceptedCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'RefAcceptGenus',
        species_name: 'refAccept',
        unique_identifier: 'ref-accept',
        now_ls: [],
        comment: 'create accepted',
        references,
      },
    })

    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'RefObsoleteGenus',
        species_name: 'refObsolete',
        unique_identifier: 'ref-obsolete',
        now_ls: [],
        comment: 'create obsolete',
        references,
      },
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
    const references = cloneSpeciesData().references

    const acceptedCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'SummaryAcceptGenus',
        species_name: 'summaryAccept',
        unique_identifier: 'summary-accept',
        diet_description: 'accept diet description',
        now_ls: [],
        comment: 'create accepted',
        references,
      },
    })

    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'SummaryObsoleteGenus',
        species_name: 'summaryObsolete',
        unique_identifier: 'summary-obsolete',
        diet_description: 'obsolete diet description',
        now_ls: [],
        comment: 'create obsolete',
        references,
      },
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
      species: {
        ...cloneSpeciesData(),
        genus_name: 'BoolAcceptGenus',
        species_name: 'boolAccept',
        unique_identifier: 'bool-accept',
        body_mass: 10,
        now_ls: [],
        comment: 'create accepted',
        references,
      },
    })

    const obsoleteCreate = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'BoolObsoleteGenus',
        species_name: 'boolObsolete',
        unique_identifier: 'bool-obsolete',
        body_mass: 99,
        now_ls: [],
        comment: 'create obsolete',
        references,
      },
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
    await login('testEr')
    const result = await send('admin/species-merge', 'POST', {
      obsoleteSpeciesId: 1,
      acceptedSpeciesId: 2,
      selectedSpeciesFieldValues: {},
      occurrenceFieldChoices: [],
      addObsoleteAsSynonym: false,
      addSourceNameToOccurrences: false,
      comment: 'merge species',
      references: [],
    })

    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })
})
