import { beforeAll, afterAll, describe, it, expect, beforeEach } from '@jest/globals'
import { login, logout, resetDatabase, send, resetDatabaseTimeout, noPermError } from '../utils'
import { pool } from '../../utils/db'

describe('Getting region data works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Getting region data succeeds with admin privileges', async () => {
    const getResultSu = await send('region/2', 'GET')
    expect(getResultSu.status).toEqual(200)
  })

  it('Getting a list of all regions fails without permissions', async () => {
    logout()
    const getResultNoPerm = await send('region/all', 'GET')
    expect(getResultNoPerm.body).toEqual(noPermError)
    expect(getResultNoPerm.status).toEqual(403)

    await login('testEr')
    const getResultEr = await send('region/all', 'GET')
    expect(getResultEr.body).toEqual(noPermError)
    expect(getResultEr.status).toEqual(403)

    await login('testEu')
    const getResultEu = await send('region/all', 'GET')
    expect(getResultEu.body).toEqual(noPermError)
    expect(getResultEu.status).toEqual(403)
  })

  it('Getting region data fails without permissions', async () => {
    logout()
    const getResultNoPerm = await send('region/2', 'GET')
    expect(getResultNoPerm.body).toEqual(noPermError)
    expect(getResultNoPerm.status).toEqual(403)

    await login('testEr')
    const getResultEr = await send('region/2', 'GET')
    expect(getResultEr.body).toEqual(noPermError)
    expect(getResultEr.status).toEqual(403)

    await login('testEu')
    const getResultEu = await send('region/2', 'GET')
    expect(getResultEu.body).toEqual(noPermError)
    expect(getResultEu.status).toEqual(403)
  })
})
