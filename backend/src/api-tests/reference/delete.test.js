import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { login, logout, resetDatabase, resetDatabaseTimeout, send } from '../utils'

describe('Deleting a locality works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })

  it.todo('Deleting works')

  it('Deleting fails without permissions', async () => {
    logout()
    const deleteResultNoPerm = await send('reference/10039', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)
    const { status: getReqStatusNoPerm } = await send('reference/10039', 'GET')
    expect(getReqStatusNoPerm).toEqual(200)

    logout()
    await login('testEr')
    const deleteResultEr = await send('reference/10039', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
    const { status: getReqStatusEr } = await send('reference/10039', 'GET')
    expect(getReqStatusEr).toEqual(200)

    logout()
    await login('testEu')
    const deleteResultEu = await send('reference/10039', 'DELETE')
    expect(deleteResultEu.status).toEqual(403)
    const { status: getReqStatusEu } = await send('reference/10039', 'GET')
    expect(getReqStatusEu).toEqual(200)
  })
})
