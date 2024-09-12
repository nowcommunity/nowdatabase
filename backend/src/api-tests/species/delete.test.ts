/* eslint-disable @typescript-eslint/no-floating-promises */
import { beforeEach, describe, it, expect } from '@jest/globals'
import { login, send } from '../utils'

describe('Deleting a species works', () => {
  beforeEach(async () => {
    await login()
  })
  it('Deleting returns correct status and after that is not found on request', async () => {
    const deleteResult = await send<{ id: number }>('species/84357', 'DELETE')
    expect(deleteResult.status).toEqual(200)
    const getResult = await send('species/84357', 'GET')
    expect(getResult.status).toEqual(404) // 'Species response status was not 404 after deletion'
  })
})
