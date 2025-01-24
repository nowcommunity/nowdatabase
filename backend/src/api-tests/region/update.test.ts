import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { RegionDetails } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { existingCoordinator } from './data'

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
      region: {
        reg_coord_id: 1,
        region: 'Updated Region',
        now_reg_coord_country: [{ country: 'Finland' }],
        now_reg_coord_people: [{ initials: existingCoordinator.initials }],
      },
    })
    const { reg_coord_id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { body, status: getReqStat } = await send<RegionDetails>(`region/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)
    updatedRegion = body
  })

  it('Contains correct data', () => {
    const { reg_coord_id, region, now_reg_coord_country, now_reg_coord_people } = updatedRegion!
    expect(region).toEqual('Updated Region') // 'Name is different'
    expect(reg_coord_id).toEqual(1)

    expect(now_reg_coord_country).toHaveLength(1)
    expect(now_reg_coord_country[0].country).toEqual('Finland')

    expect(now_reg_coord_people).toHaveLength(1)
    // this is ugly because the password_set is now a string instead of a Date object, so we need to modify the check
    expect(now_reg_coord_people[0]).toEqual({
      ...existingCoordinator,
      com_people: {
        ...existingCoordinator.com_people,
        password_set: existingCoordinator.com_people.password_set!.toISOString(),
      },
    })
  })

  it('Updating succeeds with empty country or coordinator list', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ reg_coord_id: number }>('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 2', now_reg_coord_country: [], now_reg_coord_people: [] },
    })
    const { reg_coord_id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { body: getReqBody, status: getReqStat } = await send<RegionDetails>(`region/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)

    const { reg_coord_id, region, now_reg_coord_country, now_reg_coord_people } = getReqBody
    expect(region).toEqual('Updated Region 2') // 'Name is different'
    expect(reg_coord_id).toEqual(1)
    expect(now_reg_coord_country).toHaveLength(0)
    expect(now_reg_coord_people).toHaveLength(0)
  })

  it('Updating fails with empty region', async () => {
    const { body: resultBody, status: getReqStatus } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: null },
    })
    expect(getReqStatus).toEqual(403)
    expect(resultBody.length).toEqual(1) //There should be 1 validation error
  })

  it('Updating fails with invalid country or coordinator list', async () => {
    const { body: invalidCountryResultBody, status: invalidCountryGetReqStatus } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 3', now_reg_coord_country: [{ country: 2000 }] },
    })
    expect(invalidCountryGetReqStatus).toEqual(403)
    expect(invalidCountryResultBody.length).toEqual(1) //There should be 1 validation error

    const { body: invalidCoordinatorResultBody, status: invalidCoordinatorGetReqStatus } = await send(
      'region/',
      'PUT',
      {
        region: {
          reg_coord_id: 1,
          region: 'Updated Region 3',
          now_reg_coord_people: [{ wrong_field: 'missing initials field' }],
        },
      }
    )
    expect(invalidCoordinatorGetReqStatus).toEqual(403)
    expect(invalidCoordinatorResultBody.length).toEqual(1) //There should be 1 validation error
  })

  it('Updating fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 4' },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 4' },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)

    await login('testEu')
    const { body: resultBodyEu, status: resultStatusEu } = await send('region/', 'PUT', {
      region: { reg_coord_id: 1, region: 'Updated Region 4' },
    })
    expect(resultBodyEu).toEqual(noPermError)
    expect(resultStatusEu).toEqual(403)
  })
})
