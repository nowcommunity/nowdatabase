import { beforeAll, beforeEach, afterAll, describe, it, expect } from '@jest/globals'
import { login, logout, send, resetDatabase, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'
import { newTimeUnitBasis } from './data'

describe('Deleting a time unit', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('that is not used anywhere succeeds', async () => {
    const { body: resultBody } = await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: newTimeUnitBasis,
    })
    const { tu_name: createdId } = resultBody
    expect(typeof createdId).toEqual('string') // `Invalid result returned on write: ${createdId}`)

    const deleteResult = await send(`time-unit/${createdId}`, 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send(`time-unit/${createdId}`, 'GET')
    expect(getResult.status).toEqual(404) // Time Bound response status was not 404 after deletion
  })

  it('that is being used by another entity fails', async () => {
    const deleteResult = await send(`time-unit/bahean`, 'DELETE') // used by Lantian-Shuijiazui locality
    expect(deleteResult.status).toEqual(500)
    const getResult = await send(`time-unit/bahean`, 'GET')
    expect(getResult.status).toEqual(200) // Time Bound response status was not 200 after failed deletion
  })

  it('without permissions fails', async () => {
    logout()
    const deleteResultNoPerm = await send<{ id: number }>('time-unit/bahean', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)
    const getResultNoPerm = await send('time-unit/bahean', 'GET')
    expect(getResultNoPerm.status).toEqual(200)

    await login('testEr')
    const deleteResultEr = await send<{ id: number }>('time-unit/bahean', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
    const getResultEr = await send('time-unit/bahean', 'GET')
    expect(getResultEr.status).toEqual(200)
  })
})
