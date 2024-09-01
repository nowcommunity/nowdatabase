/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { describe, it, before } from 'node:test'
import { login, send } from '../utils'

describe('Deleting a species works', async () => {
  before(async () => {
    await login()
  })
  await it('Deleting returns correct status and after that is not found on request', async () => {
    const deleteResult = await send<{ id: number }>('species/84357', 'DELETE')
    assert(deleteResult.status === 200)
    const getResult = await send('species/84357', 'GET')
    assert(getResult.status === 404, 'Species response status was not 404 after deletion')
  })
})
