import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { Museum } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { newMuseumBasis } from './data'

let createdMuseum: Museum | null = null

describe('Creating new museum works', () => {
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
      museum: newMuseumBasis,
    })
    const { museum: createdId } = resultBody
    console.log(resultBody)

    expect(typeof createdId).toEqual('string') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { body, status: getReqStat } = await send<Museum>(`museum/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)
    createdMuseum = body
  })

  it('Contains correct data', () => {
    const { museum: museumId, institution } = createdMuseum!
    expect(institution).toEqual('Australian Museum') // 'Institution name is different'
    expect(museumId).toBeDefined()
  })

  it('Creation fails with empty museum code', async () => {
    const { body: resultBody, status: getReqStatus } = await send('museum/', 'PUT', {
      museum: { ...newMuseumBasis, museum: null },
    })
    expect(getReqStatus).toEqual(403)
    expect(resultBody.length).toEqual(1) //There should be 1 validation error
  })

  it('Creation fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('museum/', 'PUT', {
      museum: { ...newMuseumBasis, museum: 'New Museum 2' },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('museum/', 'PUT', {
      museum: { ...newMuseumBasis, museum: 'New Museum 3' },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)

    await login('testEu')
    const { body: resultBodyEu, status: resultStatusEu } = await send('museum/', 'PUT', {
      museum: { ...newMuseumBasis, museum: 'New Museum 4' },
    })
    expect(resultBodyEu).toEqual(noPermError)
    expect(resultStatusEu).toEqual(403)
  })
})
