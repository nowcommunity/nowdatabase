import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { login, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Deleting a locality works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Deleting works', async () => {
    const deleteResult = await send<{ id: number }>('locality/49999', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('locality/49999', 'GET')
    expect(getResult.status).toEqual(404) // Locality response status was not 404 after deletion
  })
})
