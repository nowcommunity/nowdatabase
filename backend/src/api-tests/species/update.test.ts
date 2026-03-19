import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { EditMetaData, SpeciesDetailsType } from '../../../../frontend/src/shared/types'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, resetDatabase, send, testLogRows, resetDatabaseTimeout } from '../utils'
import { cloneSpeciesData, editedSpecies } from './data'
import { pool } from '../../utils/db'

let editedSpeciesResult: (SpeciesDetailsType & EditMetaData) | null = null

describe('Updating species works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await resetDatabase()
    await login()
    editedSpeciesResult = null
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('after updating species successfully', () => {
    beforeEach(async () => {
      const writeResult = await send<{ species_id: number }>('species', 'PUT', { species: editedSpecies })
      expect(writeResult.status).toEqual(200)
      expect(writeResult.body.species_id).toEqual(editedSpecies.species_id)

      const { body, status } = await send<SpeciesDetailsType>(`species/${writeResult.body.species_id}`, 'GET')
      expect(status).toEqual(200)
      editedSpeciesResult = body
    })

    it('Edits name, comment and locality-species correctly', () => {
      expect(editedSpeciesResult?.species_id).toEqual(editedSpecies.species_id)
    })

    it('Name changed correctly', () => {
      expect(editedSpeciesResult!.species_name).toEqual(editedSpecies.species_name)
    })

    it('Added locality species is found', () => {
      editedSpeciesResult!.now_ls.find(ls => ls.species_id === editedSpecies.species_id && ls.lid === 20920)
      expect(!!editedSpeciesResult).toEqual(true)
    })

    it('Locality species include correct amount of entries', () => {
      expect(editedSpeciesResult!.now_ls.length).toEqual(5)
    })

    it('Changes were logged correctly', () => {
      const update = editedSpeciesResult!.now_sau
      const lastUpdate = update[update.length - 1]

      expect(lastUpdate.sau_comment).toEqual(editedSpecies.comment)
      expect(lastUpdate.now_sr[lastUpdate.now_sr.length - 1].rid).toEqual(editedSpecies.references![0].rid)

      const logRows = lastUpdate.updates

      const expectedLogRows: Partial<LogRow>[] = [
        {
          table: 'com_species',
          column: 'sp_comment',
          value: editedSpecies.sp_comment,
          oldValue: null,
          type: 'update',
        },
        {
          table: 'now_ls',
          column: 'species_id',
          value: editedSpecies.species_id!.toString(),
          oldValue: null,
          type: 'add',
        },
      ]
      testLogRows(logRows, expectedLogRows, 4)
    })
  })

  it('Updates only comment without triggering duplicate taxon error', async () => {
    const creationPayload = cloneSpeciesData()
    const createResult = await send<{ species_id: number }>('species', 'PUT', {
      species: { ...creationPayload, comment: 'initial species' },
    })

    const updateResult = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        species_id: createResult.body.species_id,
        sp_comment: 'Updated comment only',
        now_ls: [],
        com_taxa_synonym: [],
        now_sau: [],
        references: cloneSpeciesData().references,
        comment: 'updating comment',
      },
    })

    expect(updateResult.status).toEqual(200)
  })

  it('Returns duplicate error when taxonomy is changed to existing taxon', async () => {
    const duplicateTarget = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'DuplicateTestGenus',
        species_name: 'duplicatetarget',
        unique_identifier: 'dup-id',
        now_ls: [],
        comment: 'target',
      },
    })
    expect(duplicateTarget.status).toEqual(200)

    const sourceSpecies = await send<{ species_id: number }>('species', 'PUT', {
      species: {
        ...cloneSpeciesData(),
        genus_name: 'DuplicateTestGenus',
        species_name: 'sourcespecies',
        unique_identifier: 'source-id',
        now_ls: [],
        comment: 'source',
      },
    })
    expect(sourceSpecies.status).toEqual(200)

    const duplicateUpdate = await send<{ name: string; error: string }[]>('species', 'PUT', {
      species: {
        species_id: sourceSpecies.body.species_id,
        order_name: 'Eulipotyphla',
        family_name: 'Soricidae',
        genus_name: 'DuplicateTestGenus',
        species_name: 'duplicatetarget',
        unique_identifier: 'dup-id',
        taxonomic_status: '',
        now_ls: [],
        com_taxa_synonym: [],
        now_sau: [],
        references: cloneSpeciesData().references,
        comment: 'attempt duplicate',
      },
    })

    expect(duplicateUpdate.status).toEqual(403)
    expect(duplicateUpdate.body.some(error => error.error === 'The taxon already exists in the database.')).toBe(true)
  })
})
