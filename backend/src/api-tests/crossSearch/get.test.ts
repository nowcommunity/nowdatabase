import { beforeEach, describe, it, expect } from '@jest/globals'
import { CrossSearchListType } from '../../../../frontend/src/backendTypes'
import { login, send } from '../utils'

describe('Getting cross-search data works', () => {
  beforeEach(async () => {
    await login()
  })

  it('Requesting get all has correct length and status code', async () => {
    const { body: getReqBody, status: getReqStatus } = await send(`crosssearch/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody).toHaveLength(6) // TODO: this is sometimes 7, sometimes more because of jest parallel stuff
  })

  it('Get all has some correct fields from locality and species', async () => {
    const { body: getReqBody } = await send<CrossSearchListType>(`crosssearch/all`, 'GET')
    expect(getReqBody[0]).toHaveProperty('lid')
    expect(getReqBody[0]).toHaveProperty('loc_name')
    expect(getReqBody[0]).toHaveProperty('subclass_or_superorder_name')
    expect(getReqBody[0]).toHaveProperty('family_name')
    expect(getReqBody[0]).toHaveProperty('taxonomic_status')
  })

  it('Requesting get all has some correct fields', async () => {
    const { body: getReqBody } = await send<CrossSearchListType>(`crosssearch/all`, 'GET')
    expect(getReqBody[0].lid).toEqual(21050)
    expect(getReqBody[0].loc_name).toEqual('Dmanisi')
    expect(getReqBody[0].subclass_or_superorder_name).toEqual('Eutheria')
    expect(getReqBody[0].family_name).toEqual('Bovidae')
  })

  it("Get all doesn't have a species that doesn't have locality", async () => {
    const { body: getReqBody } = await send<CrossSearchListType>(`crosssearch/all`, 'GET')
    const specieslist = getReqBody.map(e => e.species_name)
    expect(specieslist).not.toContain('legidensis')
  })

  it("Get all doesn't have a locality that doesn't have species", async () => {
    const { body: getReqBody } = await send<CrossSearchListType>(`crosssearch/all`, 'GET')
    const loclist = getReqBody.map(e => e.loc_name)
    expect(loclist).not.toContain('Lantian-Shuijiazui')
  })
})
