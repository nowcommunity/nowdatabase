import { beforeAll, describe, expect, it } from '@jest/globals'
import { login, resetDatabase, resetDatabaseTimeout, send } from './utils'

type SequenceResponse = {
  rows: Array<{ sequence: string; seq_name: string; display_value: string }>
  full_count: number
  limit?: number
  offset?: number
}

describe('Sequence API', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
  }, resetDatabaseTimeout)

  it('returns sequences with display labels', async () => {
    const { body, status } = await send<SequenceResponse>('time-unit/sequences', 'GET')

    expect(status).toBe(200)
    expect(Array.isArray(body.rows)).toBe(true)
    expect(body.rows.length).toBeGreaterThan(0)
    expect(body.rows.every(sequence => sequence.display_value === sequence.seq_name)).toBe(true)
  })
})
