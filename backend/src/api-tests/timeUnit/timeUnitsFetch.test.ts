import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import request from 'supertest'

import app from '../../app'
import * as timeUnitService from '../../services/timeUnit'
import { pool } from '../../utils/db'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'

describe('GET /time-unit endpoints', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('returns all time units with expected shape', async () => {
    const { body, status } = await send<Record<string, unknown>[]>('time-unit/all', 'GET')

    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)

    const [first] = body
    expect(first).toHaveProperty('tu_name')
    expect(first).toHaveProperty('tu_display_name')
    expect(first).toHaveProperty('rank')
    expect(first).toHaveProperty('seq_name')
    expect(first).toHaveProperty('low_bound')
    expect(first).toHaveProperty('up_bound')
  })

  it('returns structured 404 response for missing time unit', async () => {
    const { body, status } = await send<{ message: string }>('time-unit/non-existent-id', 'GET')

    expect(status).toBe(404)
    expect(body).toEqual({ message: 'Time unit not found' })
  })

  it('handles unexpected failures gracefully', async () => {
    const spy = jest.spyOn(timeUnitService, 'getAllTimeUnits').mockRejectedValueOnce(new Error('db unavailable'))

    const response = await request(app).get('/time-unit/all')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ message: 'Failed to fetch time units' })

    spy.mockRestore()
  })
})
