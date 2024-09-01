/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/writeOperations/types'
import { login, send, testLogRows } from '../utils'
import { newTimeUnitBasis } from './data'

let createdTimeUnit: TimeUnitDetailsType | null = null

describe('Creating new species works', () => {
  before(async () => {
    await login()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: string }>('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis },
    })

    const { id: createdId } = resultBody

    assert(typeof createdId === 'string', `Invalid result returned on write: ${createdId}`)

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${createdId}`, 'GET')
    createdTimeUnit = body
  })

  it('Contains correct data', () => {
    const { tu_name, tu_display_name, tu_comment } = createdTimeUnit!
    assert(
      tu_name === newTimeUnitBasis.tu_display_name?.toLowerCase().replace(' ', ''),
      'Name is different than expected'
    )
    assert(tu_display_name === newTimeUnitBasis.tu_display_name, 'Display name differs')
    assert(tu_comment === newTimeUnitBasis.tu_comment, 'Comment differs')
  })

  it('Update logs are correct', () => {
    const lastUpdate = createdTimeUnit!.now_tau[createdTimeUnit!.now_tau.length - 1]
    assert(lastUpdate.tau_comment === newTimeUnitBasis.comment, 'Comment is correct')
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
