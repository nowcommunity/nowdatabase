import { beforeAll, beforeEach, afterAll, describe, it, expect } from '@jest/globals'
import { login, logout, send, resetDatabase, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Deleting a time bound', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it.todo('with permissions succeeds')

  it('without permissions fails', async () => {
    logout()
    const deleteResultNoPerm = await send<{ id: number }>('time-bound/11', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)

    await login('testEr')
    const deleteResultEr = await send<{ id: number }>('time-bound/11', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
  })
})
