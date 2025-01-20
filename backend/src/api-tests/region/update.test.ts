import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { RegionDetails } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'

let updatedRegion: RegionDetails | null = null

describe('Updating region works', () => {
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
    const { body: resultBody, status: getReqStatus } = await send<{ reg_coord_id: number }>('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region' },
    })
    const { reg_coord_id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { body, status: getReqStat } = await send<RegionDetails>(`region/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)
    updatedRegion = body
  })

  it('Contains correct data', () => {
    const { reg_coord_id, region } = updatedRegion!
    expect(region).toEqual('Updated Region') // 'Name is different'
    expect(reg_coord_id).toEqual(1)
  })

  it('Updating fails with empty region', async () => {
    const { body: resultBody, status: getReqStatus } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: null },
    })
    expect(getReqStatus).toEqual(403)
    expect(resultBody.length).toEqual(1) //There should be 1 validation error
  })

  it('Updating fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 2' },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 2' },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)
  })
})
