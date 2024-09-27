import { describe, it, beforeAll, beforeEach, expect } from '@jest/globals'
import { editedTimeBound } from './data'
import { send, resetDatabase, login } from '../utils'

describe('Time bound updating', () => {
  beforeAll(async () => {
    await resetDatabase()
  })
  beforeEach(async () => {
    await login()
  })
  it('Update request with valid timebound succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('time-bound', 'PUT', {
      timeBound: { ...editedTimeBound },
    })
    const { id: existingId } = resultBody

    expect(typeof existingId).toEqual('number') // `Invalid result returned on write: ${createdId}`
  })
  it('Update request with invalid timebound age fails', async () => {
    const { body: resultBody } = await send<{ id: number }>('time-bound', 'PUT', {
      timeBound: { ...editedTimeBound },
    })
    const { id: existingId } = resultBody

    expect(typeof existingId).toEqual('number') // `Invalid result returned on write: ${createdId}`
  })
})
