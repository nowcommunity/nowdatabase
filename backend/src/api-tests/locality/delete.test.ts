/* eslint-disable @typescript-eslint/no-floating-promises */
import { beforeEach, describe, it, expect } from '@jest/globals'
import { login, send } from '../utils'

describe('Deleting a locality works', () => {
  beforeEach(async () => {
    await login()
  })

  it('Deleting works', async () => {
    const deleteResult = await send<{ id: number }>('locality/49999', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('locality/49999', 'GET')
    expect(getResult.status).toEqual(404) // Locality response status was not 404 after deletion
  })
})
