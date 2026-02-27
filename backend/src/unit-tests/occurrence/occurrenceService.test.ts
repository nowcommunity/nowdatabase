import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { parseOccurrenceRouteParams, getOccurrenceByCompositeKey } from '../../services/occurrenceService'
import { nowDb } from '../../utils/db'
import { Role } from '../../../../frontend/src/shared/types'
import { AccessError } from '../../middlewares/authorizer'

jest.mock('../../utils/db', () => ({
  nowDb: {
    $queryRaw: jest.fn(),
    now_proj_people: { findMany: jest.fn() },
    now_plr: { findMany: jest.fn() },
  },
}))

const mockedNowDb = jest.mocked(nowDb)

describe('parseOccurrenceRouteParams', () => {
  it('parses integer route params', () => {
    expect(parseOccurrenceRouteParams('10', '20')).toEqual({ lid: 10, speciesId: 20 })
  })

  it('throws 400 error for invalid params', () => {
    expect(() => parseOccurrenceRouteParams('10', 'x')).toThrow('lid and species_id must be valid integers')
    try {
      parseOccurrenceRouteParams('10', 'x')
    } catch (error) {
      expect((error as Error & { status?: number }).status).toBe(400)
    }
  })
})

describe('getOccurrenceByCompositeKey', () => {
  beforeEach(() => {
    mockedNowDb.$queryRaw.mockReset()
    mockedNowDb.now_proj_people.findMany.mockReset()
    mockedNowDb.now_plr.findMany.mockReset()
  })

  it('returns null when occurrence does not exist', async () => {
    mockedNowDb.$queryRaw.mockResolvedValue([])

    await expect(getOccurrenceByCompositeKey(1, 2)).resolves.toBeNull()
  })

  it('throws AccessError for private occurrence when user cannot access locality', async () => {
    mockedNowDb.$queryRaw.mockResolvedValue([
      { lid: 1, species_id: 2, loc_status: true, loc_name: 'loc', country: 'x', genus_name: 'g', species_name: 's' },
    ])
    mockedNowDb.now_proj_people.findMany.mockResolvedValue([{ pid: 1, initials: 'AA' }])
    mockedNowDb.now_plr.findMany.mockResolvedValue([{ lid: 999, pid: 1 }])

    await expect(
      getOccurrenceByCompositeKey(1, 2, { username: 'u', role: Role.EditRestricted, userId: 1, initials: 'AA' })
    ).rejects.toBeInstanceOf(AccessError)
  })
})
