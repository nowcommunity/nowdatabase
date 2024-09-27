import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, resetDatabase, send, testLogRows } from '../utils'
import { newTimeUnitBasis } from './data'
import { pool } from '../../utils/db'

let createdTimeUnit: TimeUnitDetailsType | null = null

describe('Creating new time unit works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, 10 * 1000)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: string }>('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis },
    })

    const { id: createdId } = resultBody

    expect(typeof createdId).toEqual('string') // `Invalid result returned on write: ${createdId}`)

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${createdId}`, 'GET')
    createdTimeUnit = body
  })

  it('Contains correct data', () => {
    const { tu_name, tu_display_name, tu_comment } = createdTimeUnit!
    expect(tu_name).toEqual(newTimeUnitBasis.tu_display_name?.toLowerCase().replace(' ', '')) //'Name is different than expected'
    expect(tu_display_name).toEqual(newTimeUnitBasis.tu_display_name) // 'Display name differs')
    expect(tu_comment).toEqual(newTimeUnitBasis.tu_comment) // 'Comment differs'
  })

  it('Update logs are correct', () => {
    const lastUpdate = createdTimeUnit!.now_tau[createdTimeUnit!.now_tau.length - 1]
    expect(lastUpdate.tau_comment).toEqual(newTimeUnitBasis.comment) // 'Comment is correct'
    const logRows = lastUpdate.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        table: 'now_time_unit',
        column: 'tu_display_name',
        oldValue: null,
        value: newTimeUnitBasis.tu_display_name!,
        type: 'add',
      },
    ]
    testLogRows(logRows, expectedLogRows, 7)
  })
})
