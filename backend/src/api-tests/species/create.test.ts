import { beforeEach, beforeAll, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { newSpeciesBasis } from './data'
import { login, resetDatabase, send, testLogRows } from '../utils'

let createdSpecies: SpeciesDetailsType | null = null

describe('Creating new species works', () => {
  beforeAll(async () => {
    await resetDatabase()
  })
  beforeEach(async () => {
    await login()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('species', 'PUT', {
      species: { ...newSpeciesBasis, comment: 'species test' },
    })
    const { id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`

    const { body } = await send<SpeciesDetailsType>(`species/${createdId}`, 'GET')
    createdSpecies = body
  })

  it('Contains correct data', () => {
    const { species_name, now_ls } = createdSpecies!
    expect(species_name).toEqual(newSpeciesBasis.species_name) // 'Name is different'
    const locality = now_ls.find(ls => ls.now_loc.lid === 24750)
    expect(!!locality).toEqual(true) // 'Locality in locality-species not found'
  })

  it('Locality-species change was updated also to locality', async () => {
    const localityFound = createdSpecies!.now_ls.find(ls => ls.now_loc.loc_name.startsWith('Romany'))
    if (!localityFound) throw new Error('Locality was not found in now_ls')
    const speciesResult = await send<LocalityDetailsType>(`locality/24750`, 'GET')
    const update = speciesResult.body.now_lau.find(lau => lau.lid === 24750 && lau.lau_comment === 'species test')
    if (!update) throw new Error('Update not found')
    const logRows = update.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        oldValue: null,
        value: '24750',
        type: 'add',
        column: 'lid',
        table: 'now_ls',
      },
    ]
    testLogRows(logRows, expectedLogRows, 2)
  })
})
