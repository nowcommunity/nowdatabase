import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, resetDatabase, send, testLogRows, resetDatabaseTimeout } from '../utils'
import { newTimeUnitBasis } from './data'
import { pool } from '../../utils/db'

let createdTimeUnit: TimeUnitDetailsType | null = null

////NOTES:
// - server error 500 jos yritetään samalla nimellä luoda toinen xd

describe('Creating new time unit', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('Creating is successful with a correct time unit', () => {
    it('Request succeeds and returns valid number id', async () => {
      const okTimeUnit = { ...newTimeUnitBasis, up_bnd: 20214, low_bnd: 20213 }
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: okTimeUnit,
      })

      expect(getReqStatus).toEqual(200)
      const { tu_name: createdId } = resultBody

      expect(typeof createdId).toEqual('string') // `Invalid result returned on write: ${createdId}`)

      const { body } = await send<TimeUnitDetailsType>(`time-unit/${createdId}`, 'GET')
      createdTimeUnit = body
    })

    it('Contains correct data', () => {
      const { tu_name, tu_display_name, tu_comment } = createdTimeUnit!
      expect(tu_name).toEqual(newTimeUnitBasis.tu_display_name?.toLowerCase().replace(' ', '')) //'Name is different than expected'
      expect(tu_display_name).toEqual(newTimeUnitBasis.tu_display_name) // 'Display name differs'
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

  describe('Creating is NOT successful with invalid bounds', () => {
    it("With null bounds doesn't create a new time unit", async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'null bounds', low_bnd: null, up_bnd: null },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(403)
      expect(typeof createdId).toEqual('undefined') // `would be 'string' if it was an id
    })

    it('Null lower bound id causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'null lower', low_bnd: null },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(403)
      expect(typeof createdId).toEqual('undefined')
    })

    it('Null upper bound id causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'null upper', up_bnd: null },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(403)
      expect(typeof createdId).toEqual('undefined')
    })

    // These probably shouldnt really cause 500 server error, but right now they just go 200 ???
    // This is just switched up from the example ????? and still just goes 200??
    it('Conflicting bounds causes 500 server error - test 1', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'conflicting bounds', up_bnd: 20213, low_bnd: 20214 },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(500)
      expect(typeof createdId).toEqual('undefined')
    })

    it('Conflicting bounds causes 500 server error - test 2', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'conflicting bounds 2', up_bnd: 64 },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(500)
      expect(typeof createdId).toEqual('undefined')
    })

    // ???????????
    it('Conflicting bounds causes 500 server error - test 3', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'conflicting bounds 3', low_bnd: 64 },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(500)
      expect(typeof createdId).toEqual('undefined')
    })

    it('Invalid bound id causes 500 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'invalid bound id', low_bnd: 30000 },
      })

      const { tu_name: createdId } = resultBody

      expect(getReqStatus).toEqual(500)
      expect(typeof createdId).toEqual('undefined')
    })
  })
})
