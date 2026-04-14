import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getSpeciesDetails } from '../../services/species'
import { Role, User } from '../../../../frontend/src/shared/types'
import { nowDb, logDb } from '../../utils/db'
import Prisma from '../../../prisma/generated/now_test_client'

jest.mock('../../utils/db', () => ({
  nowDb: {
    com_species: { findUnique: jest.fn() },
    com_taxa_synonym: { findMany: jest.fn() },
    now_proj_people: { findMany: jest.fn() },
  },
  logDb: {
    log: { findMany: jest.fn() },
  },
}))

const mockedNowDb = jest.mocked(nowDb)
const mockedLogDb = jest.mocked(logDb)

const buildSpeciesResult = (nowLs: Prisma.now_ls[]) =>
  ({
    species_id: 1,
    now_ls: nowLs,
    now_sau: [],
  }) as unknown as Awaited<ReturnType<typeof nowDb.com_species.findUnique>>

const makeLocalityRow = (options: {
  lid: number
  loc_status: boolean | null
  projectIds?: number[]
}): Prisma.now_ls => {
  return {
    lid: options.lid,
    species_id: 1,
    now_loc: {
      lid: options.lid,
      loc_status: options.loc_status,
      now_plr: (options.projectIds ?? []).map(pid => ({ pid })),
    },
  } as unknown as Prisma.now_ls
}

describe('getSpeciesDetails', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('filters restricted localities for guests', async () => {
    const publicLocality = makeLocalityRow({ lid: 10, loc_status: false })
    const restrictedLocality = makeLocalityRow({ lid: 20, loc_status: true, projectIds: [99] })

    mockedNowDb.com_species.findUnique.mockResolvedValue(buildSpeciesResult([publicLocality, restrictedLocality]))
    mockedNowDb.com_taxa_synonym.findMany.mockResolvedValue([])
    mockedLogDb.log.findMany.mockResolvedValue([])

    const result = await getSpeciesDetails(1)

    expect(result).toBeTruthy()
    expect(result?.now_ls).toHaveLength(1)
    expect(result?.now_ls[0]?.lid).toBe(10)
    expect((result?.now_ls[0]?.now_loc as { now_plr?: unknown }).now_plr).toBeUndefined()
  })

  it('includes restricted localities for users with matching projects', async () => {
    const publicLocality = makeLocalityRow({ lid: 10, loc_status: false })
    const restrictedLocality = makeLocalityRow({ lid: 20, loc_status: true, projectIds: [42] })

    mockedNowDb.com_species.findUnique.mockResolvedValue(buildSpeciesResult([publicLocality, restrictedLocality]))
    mockedNowDb.com_taxa_synonym.findMany.mockResolvedValue([])
    mockedLogDb.log.findMany.mockResolvedValue([])
    mockedNowDb.now_proj_people.findMany.mockResolvedValue([{ pid: 42, initials: 'AB' }])

    const user: User = { username: 'test', role: Role.EditRestricted, userId: 1, initials: 'AB' }

    const result = await getSpeciesDetails(1, user)

    expect(result).toBeTruthy()
    expect(result?.now_ls).toHaveLength(2)
    expect((result?.now_ls[1]?.now_loc as { now_plr?: unknown }).now_plr).toBeUndefined()
  })
})
