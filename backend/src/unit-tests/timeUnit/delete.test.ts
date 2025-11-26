import { beforeEach, describe, expect, it, jest } from '@jest/globals'
jest.mock('../../utils/config', () => ({ NOW_DB_NAME: 'test_now_db' }))
jest.mock('../../utils/db', () => ({
  nowDb: { now_loc: { count: jest.fn() } },
  getFieldsOfTables: jest.fn(() => []),
  logDb: { log: { fields: {} } },
  pool: {},
}))

import { deleteTimeUnit, ConflictError, TIME_UNIT_IN_USE_MESSAGE } from '../../services/write/timeUnit'
import { getTimeUnitDetails } from '../../services/timeUnit'
import { nowDb } from '../../utils/db'
import { User } from '../../../../frontend/src/shared/types'

jest.mock('../../services/timeUnit', () => ({
  getTimeUnitDetails: jest.fn(),
}))

describe('deleteTimeUnit', () => {
  const mockUser = { initials: 'TU' } as unknown as User
  const mockedGetTimeUnitDetails = getTimeUnitDetails as jest.MockedFunction<typeof getTimeUnitDetails>
  type TimeUnitDetailsResult = NonNullable<Awaited<ReturnType<typeof getTimeUnitDetails>>>

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(nowDb.now_loc, 'count').mockResolvedValue(0)
    mockedGetTimeUnitDetails.mockResolvedValue({ tu_name: 'test' } as unknown as TimeUnitDetailsResult)
  })

  it('throws a ConflictError when localities reference the time unit', async () => {
    jest.spyOn(nowDb.now_loc, 'count').mockResolvedValueOnce(1)

    const error = await deleteTimeUnit('bahean', mockUser).catch((thrownError: unknown) => thrownError)

    expect(error).toBeInstanceOf(ConflictError)
    expect((error as Error).message).toBe(TIME_UNIT_IN_USE_MESSAGE)
  })
})
