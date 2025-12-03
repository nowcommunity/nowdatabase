import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { SpeciesDetailsType } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { cloneSpeciesData } from './data'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'

let speciesId: number
let latestSpecies: SpeciesDetailsType | null = null

const baseReferences = cloneSpeciesData().references

type SynonymBase = SpeciesDetailsType['com_taxa_synonym'][number]
type SynonymEdit = Partial<Pick<SynonymBase, 'synonym_id' | 'species_id'>> &
  Pick<SynonymBase, 'syn_genus_name' | 'syn_species_name' | 'syn_comment'> & { rowState?: 'new' | 'removed' }

const submitSynonymsUpdate = async (synonyms: SynonymEdit[], comment: string) => {
  return await send<{ species_id: number }>('species', 'PUT', {
    species: {
      species_id: speciesId,
      com_taxa_synonym: synonyms,
      now_ls: [],
      now_sau: [],
      references: baseReferences,
      comment,
    },
  })
}

describe('Species synonym creation', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
    const creationPayload = cloneSpeciesData()
    const createResult = await send<{ species_id: number }>('species', 'PUT', {
      species: { ...creationPayload, comment: 'synonym base species' },
    })
    speciesId = createResult.body.species_id
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('adds a new synonym when none exists', async () => {
    const addResult = await submitSynonymsUpdate(
      [
        {
          rowState: 'new',
          syn_genus_name: 'SynGenus',
          syn_species_name: 'synonymus',
          syn_comment: 'first synonym',
        },
      ],
      'add synonym'
    )

    expect(addResult.status).toEqual(200)
    expect(addResult.body.species_id).toEqual(speciesId)

    const { body: species } = await send<SpeciesDetailsType>(`species/${speciesId}`, 'GET')
    latestSpecies = species

    const createdSynonym = species.com_taxa_synonym.find(
      synonym =>
        synonym.syn_genus_name === 'SynGenus' &&
        synonym.syn_species_name === 'synonymus' &&
        synonym.syn_comment === 'first synonym'
    )

    expect(createdSynonym).toBeDefined()
    expect(species.com_taxa_synonym.length).toBe(1)
  })

  it('does not duplicate synonyms when submitting existing data', async () => {
    if (!latestSpecies) throw new Error('Previous test did not load species data')

    const synonymsPayload = latestSpecies.com_taxa_synonym.map(
      ({ synonym_id, species_id: existingSpeciesId, syn_genus_name, syn_species_name, syn_comment }) => ({
        synonym_id,
        species_id: existingSpeciesId,
        syn_genus_name,
        syn_species_name,
        syn_comment,
      })
    )

    const repeatResult = await submitSynonymsUpdate(synonymsPayload, 'repeat synonym payload')
    expect(repeatResult.status).toEqual(200)

    const { body: repeatedSpecies } = await send<SpeciesDetailsType>(`species/${speciesId}`, 'GET')
    expect(repeatedSpecies.com_taxa_synonym.length).toBe(1)
    expect(repeatedSpecies.com_taxa_synonym[0].syn_species_name).toBe('synonymus')
  })

  it('rejects synonym creation without authorization', async () => {
    logout()
    const unauthorizedResult = await submitSynonymsUpdate(
      [
        {
          rowState: 'new',
          syn_genus_name: 'NoAuth',
          syn_species_name: 'blocked',
          syn_comment: 'should fail',
        },
      ],
      'unauthorized attempt'
    )

    expect(unauthorizedResult.status).toEqual(403)
    expect(unauthorizedResult.body).toEqual(noPermError)
  })
})
