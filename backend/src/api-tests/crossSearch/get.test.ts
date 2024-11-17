import type { CrossSearch, ColumnFilter } from '../../../../frontend/src/backendTypes'
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'
import { constructFilterSortPageUrl } from '../../utils/url'
import { columnFilter, sorting, page } from './data'
import { login, logout } from '../utils'

describe('Getting cross-search data works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  afterAll(async () => {
    await pool.end()
  })

  it('Requesting get all has correct length and status code', async () => {
    const { body: getReqBody, status: getReqStatus } = await send(`crosssearch/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody.length).toEqual(20)
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

  it('Get filtered with correct but empty parameters returns everything', async () => {
    const parameters = constructFilterSortPageUrl([], [], page)
    const result = await send('crosssearch/testing/all?' + parameters, 'GET')

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(15)
  })

  it('Get filtered with correct but empty parameters no user rights with pagination returns correct amount of rows', async () => {
    const parameters = constructFilterSortPageUrl([], [], { pageIndex: 3, pageSize: 3 })
    const result = await send('crosssearch/testing/all?' + parameters, 'GET')

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(3)
    expect(result.body[0].lid).toEqual(24750)
    expect(result.body[1].lid).toEqual(24797)
  })

  it('Get filtered with correct but empty parameters and no user rights with large page size returns correct amount of rows', async () => {
    const parameters = constructFilterSortPageUrl([], [], { pageIndex: 0, pageSize: 100 })
    const result = await send('crosssearch/testing/all?' + parameters, 'GET')

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(20)
  })

  it('Get filtered with missing parameters returns nothing', async () => {
    const result = await send('crosssearch/testing/all?', 'GET')

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(0)
  })

  it('Get filtered with correct but empty parameters with admin rights and large page size returns correct amount of rows', async () => {
    const parameters = constructFilterSortPageUrl([], [], { pageIndex: 0, pageSize: 100 })
    await login()
    const result = await send('crosssearch/testing/all?' + parameters, 'GET')
    logout()

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(22)
  })

  it('Get filtered with correct but empty parameters with some user rights and large page size returns correct amount of rows', async () => {
    const parameters = constructFilterSortPageUrl([], [], { pageIndex: 0, pageSize: 100 })
    await login('testPl', 'test')
    const result = await send('crosssearch/testing/all?' + parameters, 'GET')
    console.log('result length: ', result.body.length)
    console.log('result: ', result.body)
    logout()

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(21)
  })

  it('Get filtered with correct parameters including a filter and with user rights returns only items matching to the filter', async () => {
    const filter: ColumnFilter = {
      country: 'Spa',
      //loc_name: 'Las',
    }
    const parameters = constructFilterSortPageUrl(filter, [], { pageIndex: 0, pageSize: 100 })
    await login()
    const result = await send('crosssearch/testing/all?' + parameters, 'GET')
    logout()

    expect(result.status).toEqual(200)
    expect(result.body.length).toEqual(5)
  })

  it.todo('Get filtered with sorting returns with correct sorting')
  it.todo('Get filtered with multiple filters returns items matching to all filters')
})
