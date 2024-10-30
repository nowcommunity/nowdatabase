import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'
import { testSu } from './data'

describe('Logging in', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  afterAll(async () => {
    await pool.end()
  })

  it('is successful with test admin user', async () => {
    const result = await send('user/login', 'POST', testSu)

    expect(result.status).toEqual(200)
    expect(result.body.username).toEqual('testSu')
    expect(result.body.role).toEqual(1) // frontend/src/types: Role enum
    expect(result.body.isFirstLogin).toEqual(undefined)
  })

  it('is not successful with missing data', async () => {
    const resultNoUsername = await send('user/login', 'POST', { password: 'test' })
    const resultNoPassword = await send('user/login', 'POST', { username: 'testSu' })
    expect(resultNoUsername.status).toEqual(403)
    expect(resultNoPassword.status).toEqual(403)

    const resultEmptyUsername = await send('user/login', 'POST', { username: '', password: 'test' })
    const resultEmptyPassword = await send('user/login', 'POST', { username: 'testSu', password: '' })
    expect(resultEmptyUsername.status).toEqual(403)
    expect(resultEmptyPassword.status).toEqual(403)
  })

  it('is not successful with incorrect password', async () => {
    const result = await send('user/login', 'POST', { username: 'testSu', password: 'Test' })
    expect(result.status).toEqual(403)
  })
})
