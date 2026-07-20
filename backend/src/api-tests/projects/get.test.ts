import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('GET /projects/', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('viewing project details fails for non-admin users', async () => {
    await login('testSu', 'test')
    const suResult = await send('project/3', 'GET')
    expect(suResult.status).toEqual(200)

    await login('testPl', 'test')
    const plResult = await send('project/3', 'GET')
    expect(plResult.status).toEqual(403)
    expect(plResult.body).toEqual(noPermError)

    await login('testEu', 'test')
    const euResult = await send('project/3', 'GET')
    expect(euResult.status).toEqual(403)
    expect(euResult.body).toEqual(noPermError)

    await login('testEr', 'test')
    const erResult = await send('project/3', 'GET')
    expect(erResult.status).toEqual(403)
    expect(erResult.body).toEqual(noPermError)

    logout()
    const anonResult = await send('project/3', 'GET')
    expect(anonResult.status).toEqual(403)
    expect(anonResult.body).toEqual(noPermError)
  })
})
