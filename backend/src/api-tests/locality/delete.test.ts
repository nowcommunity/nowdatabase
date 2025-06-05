import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { login, logout, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Deleting a locality', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('with permissions succeeds', async () => {
    const deleteResult = await send<{ id: number }>('locality/49999', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('locality/49999', 'GET')
    expect(getResult.status).toEqual(404) // Locality response status was not 404 after deletion
  })

  it('without permissions fails', async () => {
    logout()
    const deleteResultNoPerm = await send<{ id: number }>('locality/20920', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)
    const getResultNoPerm = await send('locality/20920', 'GET')
    expect(getResultNoPerm.status).toEqual(200)

    await login('testEr')
    const deleteResultEr = await send<{ id: number }>('locality/20920', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
    const getResultEr = await send('locality/20920', 'GET')
    expect(getResultEr.status).toEqual(200)
  })
})
