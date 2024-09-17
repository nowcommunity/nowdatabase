import { beforeEach, describe, it, expect } from '@jest/globals'
import { login, send } from '../utils'

describe('Getting cross-search data works', () => {
  beforeEach(async () => {
    await login()
  })

  it('Requesting get all has correct length', async () => {
    const { body: getReqBody, status: getReqStatus } = await send(`crosssearch/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody).toHaveLength(6)
  })
})
