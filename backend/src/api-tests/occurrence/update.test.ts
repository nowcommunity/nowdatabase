import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool } from '../../utils/db'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'

describe('Occurrence update endpoint', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('updates an occurrence by composite key', async () => {
    const response = await send<Record<string, unknown>>('occurrence/20920/21052', 'PUT', {
      occurrence: {
        qua: 'a',
        mesowear: 'bil',
        microwear: 'pit_dom',
        mw_scale_min: 0,
        mw_scale_max: 5,
        mw_value: 3,
      },
    })

    expect(response.status).toBe(200)
    expect(response.body.qua).toBe('a')
    expect(response.body.mesowear).toBe('bil')
  })

  it('returns 400 for invalid dropdown values', async () => {
    const response = await send<Record<string, unknown>>('occurrence/20920/21052', 'PUT', {
      occurrence: {
        qua: 'invalid',
        mesowear: 'invalid',
      },
    })

    expect(response.status).toBe(400)
    expect(String(response.body.message)).toContain('Quantity')
    expect(String(response.body.message)).toContain('Mesowear')
  })

  it('returns 400 for inconsistent mesowear scale values', async () => {
    const response = await send<Record<string, unknown>>('occurrence/20920/21052', 'PUT', {
      occurrence: {
        mw_scale_min: 10,
        mw_scale_max: 5,
        mw_value: 12,
      },
    })

    expect(response.status).toBe(400)
    expect(String(response.body.message)).toContain('Scale Minimum cannot be greater than Scale Maximum')
  })
})
