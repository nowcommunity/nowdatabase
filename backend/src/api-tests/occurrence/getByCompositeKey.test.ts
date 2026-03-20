import { beforeAll, afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('Occurrence detail endpoint', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('returns one occurrence by lid and species_id', async () => {
    const response = await send<Record<string, unknown>>('occurrence/21050/85729', 'GET')
    expect(response.status).toBe(200)
    expect(response.body.lid).toBe(21050)
    expect(response.body.species_id).toBe(85729)
  })

  it('returns 404 when pair does not exist', async () => {
    const response = await send<Record<string, unknown>>('occurrence/999999/999999', 'GET')
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'Occurrence not found' })
  })

  it('returns 400 when params are invalid', async () => {
    const response = await send<Record<string, unknown>>('occurrence/not-a-number/85729', 'GET')
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'lid and species_id must be valid integers' })
  })
})
