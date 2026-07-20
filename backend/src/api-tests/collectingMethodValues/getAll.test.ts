import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

type CollectingMethodValue = { coll_meth_value: string }

describe('GET /collecting-method-values/all', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('returns collecting method values sorted ascending', async () => {
    await login('testSu', 'test')

    const { body, status } = await send<CollectingMethodValue[]>('collecting-method-values/all', 'GET')

    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)

    const values = body.map(value => value.coll_meth_value)
    const sorted = [...values].sort((a, b) => a.localeCompare(b))
    expect(values).toEqual(sorted)
  })

  it('rejects anonymous users', async () => {
    logout()
    const { body: noUserBody, status: noUserStatus } = await send('collecting-method-values/all', 'GET')
    expect(noUserStatus).toBe(403)
    expect(noUserBody).toEqual(noPermError)
  })

  it('accepts users with locality edit access', async () => {
    await login('testEr', 'test')
    const { status: erStatus } = await send('collecting-method-values/all', 'GET')
    expect(erStatus).toBe(200)

    await login('testEu', 'test')
    const { status: euStatus } = await send('collecting-method-values/all', 'GET')
    expect(euStatus).toBe(200)
  })
})
