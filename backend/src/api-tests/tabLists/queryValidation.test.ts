import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { pool } from '../../utils/db'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'

describe('Tab list query validation and pagination', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('rejects invalid sorting for reference species endpoint', async () => {
    const { body, status } = await send<{ message: string; errors: string[] }>(
      'reference/species/10029?sorting=%5B%7B%22id%22%3A%22invalid%22%2C%22desc%22%3Afalse%7D%5D',
      'GET'
    )

    expect(status).toBe(400)
    expect(body.message).toBe('Invalid query parameters')
    expect(body.errors[0]).toContain('sorting.id must be one of')
  })

  it('rejects non-empty server-side column filters for tab list endpoints', async () => {
    const { body, status } = await send<{ message: string; errors: string[] }>(
      'time-unit/localities/agenian?columnfilters=%5B%7B%22id%22%3A%22loc_name%22%2C%22value%22%3A%22x%22%7D%5D',
      'GET'
    )

    expect(status).toBe(400)
    expect(body.message).toBe('Invalid query parameters')
    expect(body.errors).toContain(
      'Server-side columnfilters are not supported for this endpoint. Use client-side filtering.'
    )
  })

  it('applies pagination and sorting to reference species endpoint', async () => {
    const { body, status } = await send<Record<string, unknown>[]>(
      'reference/species/10029?sorting=%5B%7B%22id%22%3A%22species_name%22%2C%22desc%22%3Atrue%7D%5D&pagination=%7B%22pageIndex%22%3A0%2C%22pageSize%22%3A1%7D',
      'GET'
    )

    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeLessThanOrEqual(1)
  })

  it('applies pagination to museum localities without changing authorization behavior', async () => {
    const { body, status } = await send<{ localities: Record<string, unknown>[] }>(
      'museum/APM?limit=1&offset=0&sorting=%5B%7B%22id%22%3A%22loc_name%22%2C%22desc%22%3Afalse%7D%5D',
      'GET'
    )

    expect(status).toBe(200)
    expect(Array.isArray(body.localities)).toBe(true)
    expect(body.localities.length).toBeLessThanOrEqual(1)
  })
})
