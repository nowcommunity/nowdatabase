/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { describe, it, before } from 'node:test'
import { login, send } from '../utils'

describe('Deleting a locality works', async () => {
  before(async () => {
    await login()
  })
  await it('Deleting works', async () => {
    const deleteResult = await send<{ id: number }>('locality/28518', 'DELETE')
    assert(deleteResult.status === 200)
    const getResult = await send('locality/28518', 'GET')
    assert(getResult.status === 404, 'Locality response status was not 404 after deletion')
  })
})
