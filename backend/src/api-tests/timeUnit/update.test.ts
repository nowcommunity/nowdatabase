import { describe, it, beforeEach, beforeAll, afterAll, expect } from '@jest/globals'
import { TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { login, resetDatabase, send } from '../utils'
import { editedTimeUnit, newTimeUnitBasis } from './data'
import { pool } from '../../utils/db'

const existingTimeUnit = { ...newTimeUnitBasis, tu_name: 'baheantest' }

describe('Time unit updating works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, 10 * 1000)
  beforeEach(async () => {
    await login()
    // create the existing time unit that is edited
    await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis },
    })
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Update request with valid time unit succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: editedTimeUnit,
    })
    const { tu_name: existingId } = resultBody

    expect(typeof existingId).toEqual('string')
    expect(existingId).toEqual('baheantest')

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingId}`, 'GET')
    expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
    expect(body.sequence).toEqual(editedTimeUnit.sequence)
    expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
    expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
  })
  it('Update request that does not change anything works', async () => {
    const { body: resultBody } = await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: existingTimeUnit,
    })

    const { tu_name: existingId } = resultBody
    expect(typeof existingId).toEqual('string')
    expect(existingId).toEqual('baheantest')

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingId}`, 'GET')
    expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
    expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
    expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
  })
  it('Update request with invalid timeunit sequence fails', async () => {
    const invalidSequenceTimeUnit = { ...existingTimeUnit, sequence: null }
    const { body: resultBody } = await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: invalidSequenceTimeUnit,
    })
    const { tu_name: existingId } = resultBody
    expect(typeof existingId).toEqual('undefined')

    const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
    expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
    expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
    expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
  })
})
