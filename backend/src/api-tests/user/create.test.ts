import { beforeAll, afterAll, describe, it } from '@jest/globals'
import { resetDatabase, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Creating a user', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  afterAll(async () => {
    await pool.end()
  })

  it.todo('is successful with correct data')
  it.todo('is not successful with missing data')
  it.todo('is not successful with incorrect password')
})
