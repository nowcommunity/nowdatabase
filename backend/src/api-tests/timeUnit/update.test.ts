import { describe, it, beforeEach, beforeAll, afterAll, expect } from '@jest/globals'
import { TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { login, resetDatabase, send } from '../utils'
import { editedTimeUnit, newTimeUnitBasis } from './data'
import { pool } from '../../utils/db'

const existingTimeUnit = { ...newTimeUnitBasis, tu_name: 'Bahean Test' }

describe('Time unit updating works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, 10 * 1000)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Update request with valid time unit succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: string }>('time-unit', 'PUT', {
      timeUnit: editedTimeUnit,
    })
    const { id: existingId } = resultBody

    expect(typeof existingId).toEqual('string')
    expect(existingId).toEqual('bahean')

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingId}`, 'GET')
    expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
    expect(body.sequence).toEqual(editedTimeUnit.sequence)
    expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
    expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    expect(body.up_bound).toEqual(existingTimeUnit.up_bound)
    expect(body.low_bound).toEqual(existingTimeUnit.low_bound)
  })
  it('Update request that does not change anything works', async () => {
    const { body: resultBody } = await send<{ id: string }>('time-unit', 'PUT', {
      timeUnit: existingTimeUnit,
    })

    const { id: existingId } = resultBody
    expect(typeof existingId).toEqual('string')
    expect(existingId).toEqual('bahean')

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingId}`, 'GET')
    expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
    expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
    expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    expect(body.up_bound).toEqual(existingTimeUnit.up_bound)
    expect(body.low_bound).toEqual(existingTimeUnit.low_bound)
  })
  it('Update request with invalid timeunit sequence fails', async () => {
    const invalidSequenceTimeUnit = { ...existingTimeUnit, sequence: null }
    const { body: resultBody } = await send<{ id: string }>('time-unit', 'PUT', {
      timeUnit: invalidSequenceTimeUnit,
    })
    const { id: existingId } = resultBody
    expect(typeof existingId).toEqual('undefined')

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
    expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
    expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
    expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    expect(body.up_bound).toEqual(existingTimeUnit.up_bound)
    expect(body.low_bound).toEqual(existingTimeUnit.low_bound)
  })
})
