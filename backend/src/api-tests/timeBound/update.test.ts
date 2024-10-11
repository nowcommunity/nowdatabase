import { describe, it, beforeAll, beforeEach, expect } from '@jest/globals'
import { editedTimeBound } from './data'
import { send, resetDatabase, login, resetDatabaseTimeout, testLogRows } from '../utils'
import { TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'

let existingTimeBound: TimeBoundDetailsType | null = null

describe('Time bound updating', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  it('Update request with valid timebound succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: editedTimeBound,
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(editedTimeBound.bid)
    expect(body.b_name).toEqual(editedTimeBound.b_name)
    expect(body.age).toEqual(editedTimeBound.age)
    existingTimeBound = body
  })
  it('Update request that does not change anything works', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: existingTimeBound,
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound!.bid)
    expect(body.b_name).toEqual(existingTimeBound!.b_name)
    expect(body.age).toEqual(existingTimeBound!.age)
    existingTimeBound = body
  })
  it('Update request with invalid timebound age fails', async () => {
    const invalidAgeTimeBound = { ...existingTimeBound, age: null }
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: { ...invalidAgeTimeBound },
    })
    const { bid: existingId } = resultBody
    expect(typeof existingId).toEqual('undefined')

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingTimeBound!.bid}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound!.bid)
    expect(body.b_name).toEqual(existingTimeBound!.b_name)
    expect(body.age).toEqual(existingTimeBound!.age)
    existingTimeBound = body
  })
  it('Updating age works', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: { ...editedTimeBound, age: 1.779 },
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(editedTimeBound.bid)
    expect(body.b_name).toEqual(editedTimeBound.b_name)
    expect(body.age).toEqual(1.779)
    existingTimeBound = body
  })
  it('Update logs are correct', () => {
    const lastUpdate = existingTimeBound!.now_bau[existingTimeBound!.now_bau.length - 1]
    expect(lastUpdate.bau_comment).toEqual(editedTimeBound.comment) // 'Comment is correct'
    const logRows = lastUpdate.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        table: 'now_tu_bound',
        column: 'age',
        oldValue: '1.778',
        value: '1.779',
        type: 'update',
      },
    ]
    testLogRows(logRows, expectedLogRows, 1)
  })
})
