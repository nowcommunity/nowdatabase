import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('Museum and project read access for anonymous users', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it.each(['museum/all', 'museum/1', 'project/all', 'project/3'])(
    'GET %s is forbidden when not logged in',
    async url => {
      logout()
      const result = await send(url, 'GET')
      expect(result.status).toEqual(403)
      expect(result.body).toEqual(noPermError)
    }
  )
})
