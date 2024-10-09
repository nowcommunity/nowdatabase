import { describe, it, beforeAll, beforeEach, expect } from '@jest/globals'
import { editedTimeBound, newTimeBoundBasis } from './data'
import { send, resetDatabase, login } from '../utils'
import { TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'

const existingTimeBound = { ...newTimeBoundBasis, bid: 11 }

describe('Time bound updating', () => {
  beforeAll(async () => {
    await resetDatabase()
  })
  beforeEach(async () => {
    await login()
  })
  it('Update request with valid timebound succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: editedTimeBound,
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound.bid)
    expect(body.b_name).toEqual(editedTimeBound.b_name)
    expect(body.age).toEqual(editedTimeBound.age)
  })
  it('Update request that does not change anything works', async () => {
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: existingTimeBound,
    })
    const { bid: existingId } = resultBody

    expect(typeof existingId).toEqual('number')
    expect(existingId).toEqual(11)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingId}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound.bid)
    expect(body.b_name).toEqual(existingTimeBound.b_name)
    expect(body.age).toEqual(existingTimeBound.age)
  })
  it('Update request with invalid timebound age fails', async () => {
    const invalidAgeTimeBound = { ...existingTimeBound, age: null }
    const { body: resultBody } = await send<{ bid: number }>('time-bound', 'PUT', {
      timeBound: { ...invalidAgeTimeBound },
    })
    const { bid: existingId } = resultBody
    expect(typeof existingId).toEqual('undefined')

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${existingTimeBound.bid}`, 'GET')
    expect(body.bid).toEqual(existingTimeBound.bid)
    expect(body.b_name).toEqual(existingTimeBound.b_name)
    expect(body.age).toEqual(existingTimeBound.age)
  })
})
