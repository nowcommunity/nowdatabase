import { describe, it, beforeEach, beforeAll, afterAll, expect } from '@jest/globals'
import { TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { login, resetDatabase, send, resetDatabaseTimeout, testLogRows } from '../utils'
import { editedTimeUnit, newTimeUnitBasis } from './data'
import { pool } from '../../utils/db'
import { LogRow } from '../../services/write/writeOperations/types'

const existingTimeUnit = { ...newTimeUnitBasis, tu_name: 'baheantest' }

describe('Time unit updating works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
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

  describe('Time unit updates with valid data', () => {
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
    it('Update logs are correct', async () => {
      // edit time unit to create a log update
      const { body: resultBody } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: editedTimeUnit,
      })
      const { tu_name: createdId } = resultBody
      const { body: createdTimeUnit } = await send<TimeUnitDetailsType>(`time-unit/${createdId}`, 'GET')
      const lastUpdate = createdTimeUnit.now_tau[createdTimeUnit.now_tau.length - 1]
      expect(lastUpdate.tau_comment).toEqual(editedTimeUnit.comment) // 'Comment is correct'
      const logRows = lastUpdate.updates
      const expectedLogRows: Partial<LogRow>[] = [
        {
          table: 'now_time_unit',
          column: 'sequence',
          oldValue: newTimeUnitBasis.sequence,
          value: editedTimeUnit.sequence,
          type: 'update',
        },
      ]
      testLogRows(logRows, expectedLogRows, 2)
    })
  })

  describe("Can't update existing Time Unit to have invalid bounds", () => {
    it("Updating null bounds doesn't change time unit's bounds", async () => {
      const nullBoundsTimeUnit = { ...existingTimeUnit, low_bnd: null, upper_bnd: null }
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: nullBoundsTimeUnit,
      })
      const { tu_name: existingId } = resultBody
      expect(typeof existingId).toEqual('undefined')
      expect(getReqStatus).toBe(403)

      const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
      expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
      expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
      expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    })

    it('Updating to null lower bound causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, low_bnd: null },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(403)
      expect(typeof createdId).toEqual('undefined')
    })

    it('Updating to null upper bound causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, up_bnd: null },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(403)
      expect(typeof createdId).toEqual('undefined')
    })
    it('Invalid upper bound causes 500 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, up_bnd: 0 },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(500)
      expect(typeof createdId).toEqual('undefined')
    })

    it('Invalid lower bound causes 500 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, low_bnd: 30000 },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(500)
      expect(typeof createdId).toEqual('undefined')
    })
  })
})