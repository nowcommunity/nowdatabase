import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send, unauthenticatedError } from '../utils'

describe('Occurrence edit endpoint access and write flow', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login('testSu', 'test')
  })

  afterAll(async () => {
    await pool.end()
  })

  it('allows authorized users to update occurrence values', async () => {
    const response = await send<Record<string, unknown>>('occurrence/20920/21052', 'PUT', {
      occurrence: {
        source_name: 'E2E quality check source',
        id_status: 'family id uncertain',
      },
    })

    expect(response.status).toBe(200)
    expect(response.body.source_name).toBe('E2E quality check source')
    expect(response.body.id_status).toBe('family id uncertain')
  })

  it('returns 403 for users without occurrence edit permissions', async () => {
    await login('testEu', 'test')

    const response = await send<Record<string, unknown>>('occurrence/20920/21052', 'PUT', {
      occurrence: { source_name: 'should not persist' },
    })

    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual(noPermError)
  })

  it('returns 401 when user is not logged in', async () => {
    logout()

    const response = await send<Record<string, unknown>>('occurrence/20920/21052', 'PUT', {
      occurrence: { source_name: 'should not persist' },
    })

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(unauthenticatedError)
  })
})
