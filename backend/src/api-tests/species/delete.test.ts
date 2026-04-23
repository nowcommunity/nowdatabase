import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { login, logout, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'
import { cloneSpeciesData } from './data'

describe('Deleting a species works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Deleting returns correct status and after that is not found on request', async () => {
    const deleteResult = await send<{ id: number }>('species/84357', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('species/84357', 'GET')
    expect(getResult.status).toEqual(404) // 'Species response status was not 404 after deletion'
  })

  it('Deleting returns correct status and after that is not found on request with species that has no updates', async () => {
    const deleteResult = await send<{ id: number }>('species/23065', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('species/23065', 'GET')
    expect(getResult.status).toEqual(404) // 'Species response status was not 404 after deletion'
  })

  it('Deleting succeeds for a species that has synonyms', async () => {
    const speciesPayload = cloneSpeciesData()
    speciesPayload.species_name = 'delete-with-synonyms-test'
    speciesPayload.com_taxa_synonym = [
      {
        rowState: 'new',
        syn_genus_name: 'Pseudodryomys',
        syn_species_name: 'simplicidens',
        syn_comment: 'test synonym',
      },
    ]

    const { body: createBody, status: createStatus } = await send<{ species_id: number }>('species', 'PUT', {
      species: { ...speciesPayload, comment: 'create species for delete synonym test' },
    })
    expect(createStatus).toEqual(200)
    expect(typeof createBody.species_id).toEqual('number')

    const deleteResult = await send<{ id: number }>(`species/${createBody.species_id}`, 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send(`species/${createBody.species_id}`, 'GET')
    expect(getResult.status).toEqual(404)
  })

  it('Deleting fails without permissions', async () => {
    logout()
    const deleteResultNoPerm = await send<{ id: number }>('species/21052', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)
    const getResultNoPerm = await send('species/21052', 'GET')
    expect(getResultNoPerm.status).toEqual(200)

    await login('testEr')
    const deleteResultEr = await send<{ id: number }>('species/21052', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
    const getResultEr = await send('species/21052', 'GET')
    expect(getResultEr.status).toEqual(200)
  })
})
