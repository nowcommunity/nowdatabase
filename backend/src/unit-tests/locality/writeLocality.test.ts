import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { EditDataType, LocalityDetailsType, Role, User } from '../../../../frontend/src/shared/types'
import { writeLocality } from '../../services/write/locality'
import { WriteHandler } from '../../services/write/writeOperations/writeHandler'

jest.mock('../../utils/config', () => ({ NOW_DB_NAME: 'test_now_db' }))
jest.mock('../../utils/db', () => ({ getFieldsOfTables: jest.fn(() => []) }))
jest.mock('../../services/locality', () => ({
  getLocalityDetails: jest.fn(),
  filterDuplicateLocalitySpecies: jest.fn(() => undefined),
  filterDuplicateLocalityProjects: jest.fn(() => undefined),
}))

describe('writeLocality', () => {
  const mockUser: User = { username: 'test', role: Role.Admin, userId: 1, initials: 'T' }
  const startSpy = jest.spyOn(WriteHandler.prototype, 'start')
  const updateObjectSpy = jest.spyOn(WriteHandler.prototype, 'updateObject')
  const applyListChangesSpy = jest.spyOn(WriteHandler.prototype, 'applyListChanges')
  const logUpdatesAndCompleteSpy = jest.spyOn(WriteHandler.prototype, 'logUpdatesAndComplete')
  const endSpy = jest.spyOn(WriteHandler.prototype, 'end')

  beforeEach(() => {
    jest.clearAllMocks()
    startSpy.mockResolvedValue(undefined)
    updateObjectSpy.mockResolvedValue(undefined)
    applyListChangesSpy.mockResolvedValue(undefined)
    logUpdatesAndCompleteSpy.mockResolvedValue(undefined)
    endSpy.mockResolvedValue(undefined)
  })

  it('does not individually update existing occurrences while saving a locality', async () => {
    const locality = {
      lid: 42,
      approx_coord: null,
      now_ls: [
        {
          lid: 42,
          species_id: 7,
          rowState: 'clean',
          com_species: { species_id: 7, now_ls: [], com_taxa_synonym: [], now_sau: [] },
        },
      ],
      now_mus: [],
      projects: [],
      now_plr: [],
      now_syn_loc: [],
      now_ss: [],
      now_coll_meth: [],
      now_lau: [],
    } as EditDataType<LocalityDetailsType>

    await expect(writeLocality(locality, undefined, undefined, mockUser)).resolves.toBe(42)

    expect(updateObjectSpy).toHaveBeenCalledTimes(1)
    expect(updateObjectSpy).toHaveBeenCalledWith('now_loc', expect.any(Object), ['lid'])
    expect(updateObjectSpy).toHaveBeenCalledWith('now_loc', expect.objectContaining({ approx_coord: null }), ['lid'])
    expect(applyListChangesSpy).toHaveBeenCalledWith('now_ls', locality.now_ls, ['lid', 'species_id'])
  })

  it.each([
    ['true', true],
    ['false', false],
  ])('persists explicit Approximate Coordinates value %s', async (value, expected) => {
    const locality = {
      lid: 42,
      approx_coord: value,
      now_ls: [],
      now_mus: [],
      projects: [],
      now_plr: [],
      now_syn_loc: [],
      now_ss: [],
      now_coll_meth: [],
      now_lau: [],
    } as unknown as EditDataType<LocalityDetailsType>

    await expect(writeLocality(locality, undefined, undefined, mockUser)).resolves.toBe(42)

    expect(updateObjectSpy).toHaveBeenCalledWith('now_loc', expect.objectContaining({ approx_coord: expected }), [
      'lid',
    ])
  })
})
