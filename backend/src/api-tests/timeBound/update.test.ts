import { describe, it, beforeAll, afterAll, beforeEach, expect } from '@jest/globals'
import { editedTimeBound, newTimeBoundBasis } from './data'
import { send, resetDatabase, login, resetDatabaseTimeout, testLogRows } from '../utils'
import { TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { pool } from '../../utils/db'

const existingTimeBound = { ...newTimeBoundBasis, bid: 11 }

describe('Time bound updating', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Update request with valid timebound succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: editedTimeBound,
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound.bid)
    expect(body.b_name).toEqual(editedTimeBound.b_name)
    expect(body.age).toEqual(editedTimeBound.age)
  })
  it('Update request that does not change anything works', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: existingTimeBound,
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound.bid)
    expect(body.b_name).toEqual(existingTimeBound.b_name)
    expect(body.age).toEqual(existingTimeBound.age)
  })
  it('Update request with invalid timebound age fails', async () => {
    const invalidAgeTimeBound = { ...existingTimeBound, age: null }
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: { ...invalidAgeTimeBound },
    })
    const { bid: existingId } = resultBody
    expect(typeof existingId).toEqual('undefined')

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingTimeBound.bid}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound.bid)
    expect(body.b_name).toEqual(existingTimeBound.b_name)
    expect(body.age).toEqual(existingTimeBound.age)
  })
  it('Update logs are correct', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: editedTimeBound,
    })
    const { bid: createdId } = resultBody
    const { body: updatedTimeBound } = await send<TimeBoundDetailsType>(`time-bound/${createdId}`, 'GET')
    const lastUpdate = updatedTimeBound.now_bau[updatedTimeBound.now_bau.length - 1]
    expect(lastUpdate.bau_comment).toEqual(editedTimeBound.comment) // 'Comment is correct'
    const logRows = lastUpdate.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        table: 'now_tu_bound',
        column: 'b_name',
        oldValue: newTimeBoundBasis.b_name,
        value: editedTimeBound.b_name,
        type: 'update',
      },
    ]
    testLogRows(logRows, expectedLogRows, 2)
  })
})
