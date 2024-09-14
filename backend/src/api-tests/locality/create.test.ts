import { beforeEach, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { newLocalityBasis } from './data'
import { login, send, testLogRows } from '../utils'

let createdLocality: LocalityDetailsType | null = null

describe('Creating new locality works', () => {
  beforeEach(async () => {
    await login()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const { id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`)

    const { body } = await send<LocalityDetailsType>(`locality/${createdId}`, 'GET')
    createdLocality = body
  })

  it('Contains correct data', () => {
    const { loc_name, now_ls } = createdLocality!
    expect(loc_name).toEqual(newLocalityBasis.loc_name) //'Name is different'
    const newSpecies = now_ls.find(ls => ls.com_species.species_name === 'Newspecies')
    expect(!!newSpecies).toEqual(true) // 'New species not found'
    const oldSpecies = now_ls.find(ls => ls.species_id === 21052 && ls.lid === createdLocality!.lid)
    expect(!!oldSpecies).toEqual(true) // 'Old species not found'
  })

  it('Species update also logged correctly', async () => {
    const speciesId = createdLocality!.now_ls.find(ls => ls.com_species.species_name === 'Newspecies')?.species_id
    const speciesResult = await send<SpeciesDetailsType>(`species/${speciesId}`, 'GET')
    const update = speciesResult.body.now_sau.find(update => update.sau_comment === 'new locality test update')
    if (!update) throw new Error('Species update not found')
    if (!speciesId) throw new Error('Species id not found')
    expect(update?.species_id).toEqual(speciesId) // 'Species update does not have correct id'
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
        value: speciesId.toString(),
        type: 'add',
        column: 'species_id',
        table: 'com_species',
      },
      {
        oldValue: null,
        value: speciesId.toString(),
        type: 'add',
        column: 'species_id',
        table: 'now_ls',
      },
      {
        oldValue: null,
        value: createdLocality!.lid.toString(),
        type: 'add',
        column: 'lid',
        table: 'now_ls',
      },
    ]
    testLogRows(logRows, expectedLogRows, 4)
  })
})
