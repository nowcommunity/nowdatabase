import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, logout, resetDatabase, send, testLogRows, resetDatabaseTimeout } from '../utils'
import { newTimeBoundBasis } from './data'
import { TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'
import { pool } from '../../utils/db'

let createdTimeBound: TimeBoundDetailsType | null = null

describe('Creating new time bound works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: { ...newTimeBoundBasis },
    })

    const { bid: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${createdId}`, 'GET')
    expect(body).not.toEqual({})
    createdTimeBound = body
  })

  it('Contains correct data', () => {
    const { b_name, b_comment, age } = createdTimeBound!
    expect(b_name).toEqual(newTimeBoundBasis.b_name) // 'Name is different than expected')
    expect(age).toEqual(newTimeBoundBasis.age) // 'Age differs'
    expect(b_comment).toEqual(newTimeBoundBasis.b_comment) // 'Comment differs'
  })

  it('Creation fails without permissions', async () => {
    logout()
    const resultNoPerm = await send('time-bound', 'PUT', {
      timeBound: { ...newTimeBoundBasis },
    })
    expect(resultNoPerm.body).toEqual({})
    expect(resultNoPerm.status).toEqual(403)

    logout()
    await login('testEr', 'test')
    const resultEr = await send('time-bound', 'PUT', {
      timeBound: { ...newTimeBoundBasis },
    })
    expect(resultEr.body).toEqual({})
    expect(resultEr.status).toEqual(403)
  })

  it('Update logs are correct', () => {
    const lastUpdate = createdTimeBound!.now_bau[createdTimeBound!.now_bau.length - 1]
    expect(lastUpdate.bau_comment).toEqual(newTimeBoundBasis.comment) // 'Comment is correct'
    const logRows = lastUpdate.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        table: 'now_tu_bound',
        column: 'b_name',
        oldValue: null,
        value: newTimeBoundBasis.b_name!,
        type: 'add',
      },
    ]
    testLogRows(logRows, expectedLogRows, 3)
  })
})
