import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { Museum } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { editedMuseum } from './data'

let updatedMuseum: Museum | null = null

describe('Updating museum works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ museum: string }>('museum/', 'PUT', {
      museum: editedMuseum,
    })
    const { museum: updatedId } = resultBody

    expect(typeof updatedId).toEqual('string') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { body, status: getReqStat } = await send<Museum>(`museum/${updatedId}`, 'GET')
    expect(getReqStat).toEqual(200)
    updatedMuseum = body
  })

  it('Contains correct data', () => {
    const { museum, city, state, state_code } = updatedMuseum!
    expect(museum).toEqual('AM')
    expect(city).toEqual('Canberra')
    expect(state).toEqual('New South Wales')
    expect(state_code).toEqual('NSW')
  })

  it('Updating fails with empty institution', async () => {
    const { body: resultBody, status: getReqStatus } = await send('museum/', 'PUT', {
      museum: { ...editedMuseum, institution: null },
    })
    expect(getReqStatus).toEqual(403)
    expect(resultBody.length).toEqual(1) //There should be 1 validation error
  })

  it('Updating fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('museum/', 'PUT', {
      museum: { ...editedMuseum, institution: 'New Museum 2' },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('museum/', 'PUT', {
      museum: { ...editedMuseum, institution: 'New Museum 2' },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)

    await login('testEu')
    const { body: resultBodyEu, status: resultStatusEu } = await send('museum/', 'PUT', {
      museum: { ...editedMuseum, institution: 'New Museum 2' },
    })
    expect(resultBodyEu).toEqual(noPermError)
    expect(resultStatusEu).toEqual(403)
  })
})
