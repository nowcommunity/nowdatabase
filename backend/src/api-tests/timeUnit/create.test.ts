import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { TimeUnitDetailsType } from '../../../../frontend/src/shared/types'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, logout, resetDatabase, send, testLogRows, resetDatabaseTimeout, noPermError } from '../utils'
import { newTimeUnitBasis } from './data'
import { pool } from '../../utils/db'

let createdTimeUnit: TimeUnitDetailsType | null = null
const successTimeUnitBasis = { ...newTimeUnitBasis, tu_display_name: 'Bahean Test Success' }
const duplicateTimeUnitBasis = { ...newTimeUnitBasis, tu_display_name: 'Bahean Test Duplicate' }

const hasStructuredErrorPayload = (resultBody: unknown) => {
  if (Array.isArray(resultBody)) {
    return resultBody.some(item => {
      if (typeof item !== 'object' || item === null) {
        return false
      }
      const objectItem = item as Record<string, unknown>

      return typeof objectItem.name === 'string' && (typeof objectItem.error === 'string' || objectItem.error === null)
    })
  }

  if (typeof resultBody === 'object' && resultBody !== null) {
    const objectBody = resultBody as Record<string, unknown>
    return typeof objectBody.message === 'string' || Array.isArray(objectBody.cascadeErrors)
  }

  return false
}

describe('Creating new time unit', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await resetDatabase()
    await login()
    createdTimeUnit = null
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('Creating is successful with a correct time unit', () => {
    beforeEach(async () => {
      const okTimeUnit = { ...successTimeUnitBasis, up_bnd: 20214, low_bnd: 20213 }
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: okTimeUnit,
      })

      expect(getReqStatus).toEqual(200)
      const { tu_name: createdId } = resultBody

      expect(typeof createdId).toEqual('string') // `Invalid result returned on write: ${createdId}`)

      const { body } = await send<TimeUnitDetailsType>(`time-unit/${createdId}`, 'GET')
      createdTimeUnit = body
    })

    it('Request succeeds and returns valid number id', () => {
      expect(typeof createdTimeUnit?.tu_name).toEqual('string')
    })

    it('Contains correct data', () => {
      const { tu_name, tu_display_name, tu_comment } = createdTimeUnit!
      expect(tu_name).toEqual(successTimeUnitBasis.tu_display_name.toLowerCase().replace(/[\s_-]+/g, '')) //'Name is different than expected'
      expect(tu_display_name).toEqual(successTimeUnitBasis.tu_display_name) // 'Display name differs'
      expect(tu_comment).toEqual(successTimeUnitBasis.tu_comment) // 'Comment differs'
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
          value: successTimeUnitBasis.tu_display_name,
          type: 'add',
        },
      ]
      testLogRows(logRows, expectedLogRows, 7)
    })
  })

  it('Creation fails with duplicate display name and returns structured error', async () => {
    const setupResult = await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: { ...duplicateTimeUnitBasis },
    })
    expect(setupResult.status).toEqual(200)

    const duplicateResult = await send('time-unit', 'PUT', {
      timeUnit: { ...duplicateTimeUnitBasis },
    })

    expect(duplicateResult.status).toEqual(409)
    expect(duplicateResult.body).toEqual({
      message: 'Time unit with the provided name already exists',
      code: 'duplicate_name',
    })
  })

  it('Creation fails when normalized name collides despite punctuation changes', async () => {
    const setupResult = await send<{ tu_name: string }>('time-unit', 'PUT', {
      timeUnit: { ...duplicateTimeUnitBasis },
    })
    expect(setupResult.status).toEqual(200)

    const duplicateResult = await send('time-unit', 'PUT', {
      timeUnit: { ...duplicateTimeUnitBasis, tu_display_name: 'Bahean-Test-Duplicate' },
    })

    expect(duplicateResult.status).toEqual(409)
    expect(duplicateResult.body).toEqual({
      message: 'Time unit with the provided name already exists',
      code: 'duplicate_name',
    })
  })

  it('Creation fails without permissions', async () => {
    logout()
    const resultNoPerm = await send('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis },
    })
    expect(resultNoPerm.body).toEqual(noPermError)
    expect(resultNoPerm.status).toEqual(403)

    logout()
    await login('testEr', 'test')
    const resultEr = await send('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis },
    })
    expect(resultEr.body).toEqual(noPermError)
    expect(resultEr.status).toEqual(403)
  })

  it('Creation fails without reference', async () => {
    const resultNoRef = await send('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis, tu_display_name: 'Bahean Test 2', references: [] },
    })
    expect(resultNoRef.status).toEqual(403) // can't create one without a reference

    const resultWithRef = await send('time-unit', 'PUT', {
      timeUnit: { ...newTimeUnitBasis, tu_display_name: 'Bahean Test 2' },
    })
    expect(resultWithRef.status).toEqual(200)
  })

  describe('Creating is NOT successful with invalid bounds', () => {
    it("With null bounds doesn't create a new time unit", async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'null bounds', low_bnd: null, up_bnd: null },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined') // `would be 'string' if it was an id
    })

    it('Null lower bound id causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'null lower', low_bnd: null },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Null upper bound id causes error 403', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'null upper', up_bnd: null },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Conflicting bounds causes 403 error - test 1', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'conflicting bounds', up_bnd: 20213, low_bnd: 20214 },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Conflicting bounds causes 403 server error - test 2', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'conflicting bounds 2', up_bnd: 64 },
      })

      expect(getReqStatus).toEqual(403)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Invalid bound id causes 403 server error', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: { ...newTimeUnitBasis, tu_display_name: 'invalid bound id', low_bnd: 30000 },
      })

      expect(getReqStatus).toEqual(403)
      expect(getReqStatus).not.toEqual(500)
      expect(hasStructuredErrorPayload(resultBody)).toBe(true)
      const { tu_name: createdId } = resultBody
      expect(typeof createdId).toEqual('undefined')
    })

    it('Invalid upper and lower bound ids return structured non-500 error payload', async () => {
      const { body: resultBody, status: getReqStatus } = await send<{ tu_name: string }>('time-unit', 'PUT', {
        timeUnit: {
          ...newTimeUnitBasis,
          tu_display_name: 'invalid both bounds',
          up_bnd: 40000,
          low_bnd: 30000,
        },
      })

      expect(getReqStatus).toEqual(403)
      expect(getReqStatus).not.toEqual(500)
      expect(hasStructuredErrorPayload(resultBody)).toBe(true)
    })
  })
})
