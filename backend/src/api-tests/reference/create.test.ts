import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { ReferenceDetailsType } from '../../../../frontend/src/backendTypes'
//import { LogRow } from '../../services/write/writeOperations/types'
import { newReferenceBasis } from './data'
import { login, logout, resetDatabase, send, /*testLogRows,*/ resetDatabaseTimeout, noPermError } from '../utils'
import { pool } from '../../utils/db'

//let createdRef: ReferenceDetailsType | null = null

describe('Creating new reference works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ id: number }>('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    const { id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { status: getReqStat } = await send<ReferenceDetailsType>(`reference/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)
  })

  it('Creation fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)
  })
  /*
  it('Contains correct data', () => {
    const { title_primary } = createdRef!
    expect(title_primary).toEqual(newReferenceBasis.title_primary) // 'Name is different'
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

  it('Species without required fields fails', async () => {
    const res = await send('species', 'PUT', {
      species: { ...newSpeciesWithoutRequiredFields, comment: 'species test' },
    })
    expect(res.status).toEqual(403)
  })*/
})
