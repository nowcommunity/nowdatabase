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
    const deleteResult1 = await send('reference/10039', 'DELETE')
    expect(deleteResult1.status).toEqual(403)
    const { status: getReqStatus1 } = await send('reference/10039', 'GET')
    expect(getReqStatus1).toEqual(200)

    logout()
    await login('testEr')
    const deleteResult2 = await send('reference/10039', 'DELETE')
    expect(deleteResult2.status).toEqual(403)
    const { status: getReqStatus2 } = await send('reference/10039', 'GET')
    expect(getReqStatus2).toEqual(200)

    logout()
    await login('testEu')
    const deleteResult3 = await send('reference/10039', 'DELETE')
    expect(deleteResult3.status).toEqual(403)
    const { status: getReqStatus3 } = await send('reference/10039', 'GET')
    expect(getReqStatus3).toEqual(200)
  })
})
