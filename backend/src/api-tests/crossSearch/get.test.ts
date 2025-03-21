import type { CrossSearch } from '../../../../frontend/src/shared/types'
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { resetDatabase, send, resetDatabaseTimeout, login, logout } from '../utils'
import { pool } from '../../utils/db'

describe('Getting cross-search data works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  afterAll(async () => {
    await pool.end()
  })

  it('Requesting get all has correct length and status code', async () => {
    const response = await send(`crosssearch/all`, 'GET')
    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(20)
  })

  it('Requesting get all with limit and offset has correct length and status code', async () => {
    const response1 = await send(`crosssearch/all/10/0/[]/[]`, 'GET')
    expect(response1.status).toEqual(200)
    expect(response1.body.length).toEqual(10)

    const response2 = await send(`crosssearch/all/10/5/[]/[]`, 'GET')
    expect(response2.status).toEqual(200)
    expect(response2.body.length).toEqual(10)
  })

  it('Requesting get all with column filters has correct data', async () => {
    const { body: responseBody1, status: responseStatus1 } = await send(
      `crosssearch/all/20/0/[{"id": "lid_now_loc", "value": "21050"}]/[]`,
      'GET'
    )
    expect(responseStatus1).toEqual(200)
    expect(responseBody1).toHaveLength(5)
    const localityIds = responseBody1.map(row => row.lid_now_loc)
    expect(localityIds).toEqual([21050, 21050, 21050, 21050, 21050])

    const { body: responseBody2, status: responseStatus2 } = await send(
      `crosssearch/all/20/0/[{"id": "country", "value": "Spain"}]/[]`,
      'GET'
    )
    expect(responseStatus2).toEqual(200)
    expect(responseBody2).toHaveLength(10)
    const countries = responseBody2.map(row => row.country)
    expect(countries).toEqual([
      'Spain',
      'Spain',
      'Spain',
      'Spain',
      'Spain',
      'Spain',
      'Spain',
      'Spain',
      'Spain',
      'Spain',
    ])

    const { body: responseBody3, status: responseStatus3 } = await send(
      `crosssearch/all/20/0/[{"id": "lid_now_loc", "value": "invalid"}]/[]`,
      'GET'
    )
    expect(responseStatus3).toEqual(200)
    expect(responseBody3).toHaveLength(0)
  })

  it('Requesting get all with sorting has correct data', async () => {
    const { body: responseBody1, status: responseStatus1 } = await send(
      `crosssearch/all/20/0/[]/[{"id": "lid_now_loc", "desc": true}]`,
      'GET'
    )
    expect(responseStatus1).toEqual(200)
    expect(responseBody1).toHaveLength(20)
    const firstLocalityIds = responseBody1.slice(0, 5).map(row => row.lid_now_loc)
    expect(firstLocalityIds).toEqual([28518, 28518, 28518, 28518, 28518])
    const nextLocalityIds = responseBody1.slice(5, 10).map(row => row.lid_now_loc)
    expect(nextLocalityIds).toEqual([24797, 24797, 24797, 24797, 24797])

    const { body: responseBody2, status: responseStatus2 } = await send(
      `crosssearch/all/10/0/[]/[{"id": "loc_name", "desc": false}]`,
      'GET'
    )
    expect(responseStatus2).toEqual(200)
    expect(responseBody2).toHaveLength(10)
    const firstCountries = responseBody2.slice(0, 5).map(row => row.country)
    expect(firstCountries).toEqual(['Georgia', 'Georgia', 'Georgia', 'Georgia', 'Georgia'])
    const lastCountries = responseBody2.slice(5, 10).map(row => row.country)
    expect(lastCountries).toEqual(['Japan', 'Japan', 'Japan', 'Japan', 'Japan'])
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
    const { body: getReqBody } = (await send(`crosssearch/all`, 'GET')) as { body: unknown } as {
      body: CrossSearch[]
    }
    expect(getReqBody.map(e => e.lid)).toContain(24797)
    expect(getReqBody.map(e => e.lid)).toContain(24750)
    expect(getReqBody.map(e => e.loc_name)).toContain('RomanyÃ  dEmpordÃ ')
    expect(getReqBody.map(e => e.loc_name)).toContain('Goishi')
    expect(getReqBody.map(e => e.species_name)).toContain('dubia')
    expect(getReqBody.map(e => e.species_name)).toContain('planicephala')
  })

  it("Get all doesn't have a species that doesn't have locality", async () => {
    const { body: getReqBody } = (await send(`crosssearch/all`, 'GET')) as { body: unknown } as {
      body: CrossSearch[]
    }
    const speciesNameList = getReqBody.map(e => e.species_name)
    expect(speciesNameList).not.toContain('legidensis')
  })

  it("Get all doesn't have a locality that doesn't have species", async () => {
    const { body: getReqBody } = await send(`crosssearch/all`, 'GET')
    const locNameList = getReqBody.map(e => e.loc_name)
    expect(locNameList).not.toContain('not in cross search')
  })

  it('Requesting get all with sorting does not allow invalid column names', async () => {
    const { body: responseBody1, status: responseStatus1 } = await send(
      `crosssearch/all/20/0/[]/[{"id": "invalid_column", "desc": true}]`,
      'GET'
    )
    expect(responseStatus1).toEqual(403)
    expect(responseBody1).toEqual({ error: 'orderBy was not a valid column id.' })

    const { body: responseBody2, status: responseStatus2 } = await send(
      `crosssearch/all/20/0/[]/[{"id": "10", "desc": true}]`,
      'GET'
    )
    expect(responseStatus2).toEqual(403)
    expect(responseBody2).toEqual({ error: 'orderBy was not a valid column id.' })

    const { body: responseBody3, status: responseStatus3 } = await send(
      `crosssearch/all/20/0/[]/[{"id": "lid_now_loc--", "desc": true}]`,
      'GET'
    )
    expect(responseStatus3).toEqual(403)
    expect(responseBody3).toEqual({ error: 'orderBy was not a valid column id.' })
  })

  it('Get all with admin has correct amount of data', async () => {
    await login()
    const response = await send(`crosssearch/all`, 'GET')
    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(22)
    const locNameList = response.body.map(e => e.loc_name)
    expect(locNameList).toContain('draftLocality')
    expect(locNameList).toContain('draftLocalityWithProject')

    logout()
  })

  it('Get all with user included in a project has correct data', async () => {
    await login('testPl', 'test')
    const response = await send(`crosssearch/all`, 'GET')
    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(21)
    const locNameList = response.body.map(e => e.loc_name)
    expect(locNameList).toContain('draftLocalityWithProject')
    expect(locNameList).not.toContain('draftLocality')
    logout()
  })

  it('Get all with anonymous user has correct data', async () => {
    logout()
    const response = await send(`crosssearch/all`, 'GET')
    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(20)
    const locNameList = response.body.map(e => e.loc_name)
    expect(locNameList).not.toContain('draftLocalityWithProject')
    expect(locNameList).not.toContain('draftLocality')
    logout()
  })
})
