import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { CrossSearch } from '../../../../frontend/src/backendTypes'
import { resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Getting cross-search data works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, 10 * 1000)
  afterAll(async () => {
    await pool.end()
  })

  it('Requesting get all has correct length and status code', async () => {
    const { body: getReqBody, status: getReqStatus } = await send(`crosssearch/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody.length).toEqual(6)
  })

  it('Get all has some correct fields from locality and species', async () => {
    const { body: getReqBody } = await send(`crosssearch/all`, 'GET')
    expect(getReqBody[0]).toHaveProperty('lid')
    expect(getReqBody[0]).toHaveProperty('loc_name')
    expect(getReqBody[0]).toHaveProperty('subclass_or_superorder_name')
    expect(getReqBody[0]).toHaveProperty('family_name')
    expect(getReqBody[0]).toHaveProperty('taxonomic_status')
  })

  it('Requesting get all has some correct fields', async () => {
    const { body: getReqBody } = (await send(`crosssearch/all`, 'GET')) as { body: unknown } as { body: CrossSearch[] }
    expect(getReqBody.map(e => e.lid)).toContain(24797)
    expect(getReqBody.map(e => e.lid)).toContain(24750)
    expect(getReqBody.map(e => e.loc_name)).toContain('RomanyÃ  dEmpordÃ ')
    expect(getReqBody.map(e => e.loc_name)).toContain('Goishi')
    expect(getReqBody.map(e => e.species_name)).toContain('dubia')
    expect(getReqBody.map(e => e.species_name)).toContain('planicephala')
  })

  it("Get all doesn't have a species that doesn't have locality", async () => {
    const { body: getReqBody } = (await send(`crosssearch/all`, 'GET')) as { body: unknown } as { body: CrossSearch[] }
    const specieslist = getReqBody.map(e => e.species_name)
    expect(specieslist).not.toContain('legidensis')
  })

  it("Get all doesn't have a locality that doesn't have species", async () => {
    const { body: getReqBody } = (await send(`crosssearch/all`, 'GET')) as { body: unknown } as { body: CrossSearch[] }
    const loclist = getReqBody.map(e => e.loc_name)
    expect(loclist).not.toContain('not in cross search')
  })
})
