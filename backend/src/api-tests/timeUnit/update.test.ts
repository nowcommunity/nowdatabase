import { describe, it, beforeEach, beforeAll, afterAll, expect } from '@jest/globals'
import { TimeUnitDetailsType, EditDataType, EditMetaData } from '../../../../frontend/src/shared/types'
import { login, resetDatabase, send, resetDatabaseTimeout, testLogRows } from '../utils'
import { editedTimeUnit, newTimeUnitBasis, conflictingTimeUnit } from './data'
import { pool } from '../../utils/db'
import { LogRow } from '../../services/write/writeOperations/types'

const existingTimeUnit: EditDataType<TimeUnitDetailsType & EditMetaData> = {
  ...newTimeUnitBasis,
  tu_name: 'baheantest',
}

describe('Time unit updating works', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
    await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis },
    })
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
    // create the existing time unit that is edited
    await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: { tu_name: 'baheantest', ...newTimeUnitBasis },
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
    it("Updating both to a same bound doesn't change time unit's bounds", async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...existingTimeUnit, up_bnd: 20213 },
      })

      expect(getReqStatus).toBe(403)
      const { tu_name: existingId } = resultBody
      expect(typeof existingId).toEqual('undefined')

      const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
      expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
      expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
      expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    })

    it("Updating to null bounds doesn't change time unit's bounds", async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...existingTimeUnit, low_bnd: null, up_bnd: null },
      })

      expect(getReqStatus).toBe(403)
      const { tu_name: existingId } = resultBody
      expect(typeof existingId).toEqual('undefined')

      const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
      expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
      expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
      expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    })

    it('Updating to null lower bound causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, low_bnd: null },
      })

      expect(getReqStatus).toBe(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Updating to null upper bound causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, up_bnd: null },
      })

      expect(getReqStatus).toBe(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Updating to conflicting bounds causes 403 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, low_bnd: 20214, up_bnd: 20213 },
      })

      expect(getReqStatus).toBe(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Updating to conflicting upper bound causes 403 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, up_bnd: 64 },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Updating to nonexisting lower bound causes 403 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, low_bnd: 30000 },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
      const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
      expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
      expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
      expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    })

    it('Update request with same upper and lower bound fails', async () => {
      const invalidBoundsTimeUnit = { ...existingTimeUnit, up_bnd: 20214, low_bnd: 20214 }
      const { body: resultBody } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: invalidBoundsTimeUnit,
      })
      const { tu_name: existingId } = resultBody
      expect(typeof existingId).toEqual('undefined')

      const { body } = await send<TimeUnitDetailsType>(`time-unit/${existingTimeUnit.tu_name}`, 'GET')
      expect(body.tu_display_name).toEqual(existingTimeUnit.tu_display_name)
      expect(body.up_bnd).toEqual(existingTimeUnit.up_bnd)
      expect(body.low_bnd).toEqual(existingTimeUnit.low_bnd)
    })

    it('Updating with duplicate data should succeed', async () => {
      const result = await send('time-unit', 'PUT', {
        timeUnit: { tu_name: 'baheantest', ...newTimeUnitBasis },
      })
      expect(result.status).toEqual(200)
    })

    it('Updating that would cause a conflicting locality should fail with correct error', async () => {
      const { body: resultBody, status: getReqStatus } = await send('time-unit', 'PUT', {
        timeUnit: { tu_name: 'baheantest', ...conflictingTimeUnit },
      })
      expect(getReqStatus).toEqual(403)
      expect(resultBody).toHaveProperty('cascadeErrors')
    })
  })
})
