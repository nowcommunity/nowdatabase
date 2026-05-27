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

  it('returns legacy time update summary rows with linked bound updates', async () => {
    const { body, status } = await send<{
      now_time_update: Array<{
        time_update_id: number
        tuid: number | null
        lower_buid: number | null
        lower_bound_update: {
          buid: number
          updates: Array<{
            buid: number | null
            table_name: string | null
            column_name: string | null
            old_data: string | null
            new_data: string | null
          }>
        } | null
      }>
    }>('time-unit/langhian', 'GET')

    expect(status).toBe(200)

    const lowerBoundSummary = body.now_time_update.find(update => update.time_update_id === 460)

    expect(lowerBoundSummary).toMatchObject({
      tuid: null,
      lower_buid: 403,
      lower_bound_update: { buid: 403 },
    })
    expect(lowerBoundSummary?.lower_bound_update?.updates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          buid: 403,
          table_name: 'now_tu_bound',
          column_name: 'b_name',
          old_data: 'Lan/Srv',
          new_data: 'Langhian/Serravallian',
        }),
        expect.objectContaining({
          buid: 403,
          table_name: 'now_tu_bound',
          column_name: 'age',
          old_data: '14.8',
          new_data: '13.82',
        }),
      ])
    )
  })

  it('handles unexpected failures gracefully', async () => {
    const spy = jest.spyOn(timeUnitService, 'getAllTimeUnits').mockRejectedValueOnce(new Error('db unavailable'))

    const response = await request(app).get('/time-unit/all')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ message: 'Failed to fetch time units' })

    spy.mockRestore()
  })
})
