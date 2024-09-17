import { beforeEach, describe, it, expect } from '@jest/globals'
import { login, send } from '../utils'

describe('Getting cross-search data works', () => {
  beforeEach(async () => {
    await login()
  })

  it('Requesting get all has correct length', async () => {
    const { body: getReqBody, status: getReqStatus } = await send(`crosssearch/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody).toHaveLength(6) // TODO: this is sometimes 7, sometimes more because of jest parallel stuff
  })

  it('Get all has some correct fields from locality and species', async () => {
    const { body: getReqBody } = await send(`crosssearch/all`, 'GET')
    expect(getReqBody[0]).toHaveProperty('lid')
    expect(getReqBody[0]).toHaveProperty('loc_name')
    expect(getReqBody[0]).toHaveProperty('subclass_or_superorder_name')
    expect(getReqBody[0]).toHaveProperty('family_name')
    expect(getReqBody[0]).toHaveProperty('taxonomic_status')
  })
})
