import { beforeAll, beforeEach, afterAll, describe, it, expect } from '@jest/globals'
import { login, logout, send, resetDatabase, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'
import { newTimeBoundBasis } from './data'

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

  it('that is not used anywhere succeeds', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: newTimeBoundBasis,
    })
    const { bid: createdId } = resultBody
    expect(typeof createdId).toEqual('number')

    const deleteResult = await send<{ id: number }>(`time-bound/${createdId}`, 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send(`time-bound/${createdId}`, 'GET')
    expect(getResult.status).toEqual(404) // Time Bound response status was not 404 after deletion
  })

  it('that is being used by another entity fails', async () => {
    const deleteResult = await send<{ id: number }>('time-bound/11', 'DELETE') // used by Olduvai time unit
    expect(deleteResult.status).toEqual(500)
    const getResult = await send('time-bound/11', 'GET')
    expect(getResult.status).toEqual(200) // Time Bound response status was not 200 after failed deletion
  })

  it('without permissions fails', async () => {
    logout()
    const deleteResultNoPerm = await send<{ id: number }>('time-bound/11', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)

    await login('testEr')
    const deleteResultEr = await send<{ id: number }>('time-bound/11', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
  })
})
