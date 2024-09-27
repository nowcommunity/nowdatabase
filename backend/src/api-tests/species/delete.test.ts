import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { login, resetDatabase, send } from '../utils'
import { pool } from '../../utils/db'

describe('Deleting a species works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, 10 * 1000)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Deleting returns correct status and after that is not found on request', async () => {
    const deleteResult = await send<{ id: number }>('species/84357', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('species/84357', 'GET')
    expect(getResult.status).toEqual(404) // 'Species response status was not 404 after deletion'
  })
})
