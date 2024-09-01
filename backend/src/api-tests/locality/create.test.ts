/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { LocalityDetailsType, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/writeOperations/types'
import { newLocalityBasis } from './data'
import { login, send, testLogRows } from '../utils'

let createdLocality: LocalityDetailsType | null = null

describe('Creating new locality works', () => {
  before(async () => {
    await login()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const { id: createdId } = resultBody

    assert(typeof createdId === 'number', `Invalid result returned on write: ${createdId}`)

    const { body } = await send<LocalityDetailsType>(`locality/${createdId}`, 'GET')
    createdLocality = body
  })

  it('Contains correct data', () => {
    const { loc_name, now_ls } = createdLocality!
    assert(loc_name === newLocalityBasis.loc_name, 'Name is different')
    const newSpecies = now_ls.find(ls => ls.com_species.species_name === 'Newspecies')
    assert(!!newSpecies, 'New species not found')
    const oldSpecies = now_ls.find(ls => ls.species_id === 21052 && ls.lid === createdLocality!.lid)
    assert(!!oldSpecies, 'Old species not found')
  })

  it('Species update also logged correctly', async () => {
    const speciesId = createdLocality!.now_ls.find(ls => ls.com_species.species_name === 'Newspecies')?.species_id
    const speciesResult = await send<SpeciesDetailsType>(`species/${speciesId}`, 'GET')
    const update = speciesResult.body.now_sau.find(update => update.sau_comment === 'new locality test update')
    assert(update, 'Species update not found')
    update.species_id === speciesId
    const logRows = update.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        oldValue: null,
        value: 'Newspecies',
        type: 'add',
        column: 'species_name',
        table: 'com_species',
      },
      {
        oldValue: null,
        value: '86515',
        type: 'add',
        column: 'species_id',
        table: 'com_species',
      },
      {
        oldValue: null,
        value: '86515',
        type: 'add',
        column: 'species_id',
        table: 'now_ls',
      },
    ]
    testLogRows(logRows, expectedLogRows, 4)
  })
})
