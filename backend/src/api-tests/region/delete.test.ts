import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { login, logout, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Deleting a region works', () => {
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
    const deleteResult = await send<{ id: number }>('region/1', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('region/1', 'GET')
    expect(getResult.status).toEqual(404) // 'Region response status was not 404 after deletion'
  })

  it('Deleting fails without permissions', async () => {
    logout()
    const deleteResultNoPerm = await send<{ id: number }>('region/2', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)

    await login('testEr')
    const deleteResultEr = await send<{ id: number }>('region/2', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)

    await login('testEu')
    const deleteResultEu = await send<{ id: number }>('region/2', 'DELETE')
    expect(deleteResultEu.status).toEqual(403)

    await login()
    const getResultSu = await send('region/2', 'GET')
    expect(getResultSu.status).toEqual(200)
  })
})
