import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool, nowDb } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send, unauthenticatedError } from '../utils'
import { existingPerson } from './data'
import { PersonDetails } from '../../../../frontend/src/shared/types'

describe('Getting a persons information works', () => {
  beforeAll(async () => {
    await resetDatabase()
    const existing = await nowDb.com_people.findUnique({ where: { initials: existingPerson.initials } })
    expect(existing).not.toBeNull()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('getting a list of all persons succeeds with admin permissions', async () => {
    const getResultAdmin = await send(`person/all`, 'GET')
    expect(getResultAdmin.status).toEqual(200)
    expect(getResultAdmin.body.length).toEqual(13)
    expect((getResultAdmin.body as PersonDetails[])[0].first_name).toEqual(existingPerson.first_name)
  })

  it('getting person details succeeds with admin permissions', async () => {
    const getResultAdmin = await send(`person/${existingPerson.initials}`, 'GET')
    expect(getResultAdmin.status).toEqual(200)
    expect((getResultAdmin.body as PersonDetails).first_name).toEqual(existingPerson.first_name)
  })

  it('getting a list of all persons fails without admin permissions', async () => {
    logout()
    const getResultNoPerm = await send(`person/all`, 'GET')
    expect(getResultNoPerm.body).toEqual(noPermError)
    expect(getResultNoPerm.status).toEqual(403)

    await login('testEr')
    const getResultEr = await send(`person/all`, 'GET')
    expect(getResultEr.body).toEqual(noPermError)
    expect(getResultEr.status).toEqual(403)

    await login('testEu')
    const getResultEu = await send(`person/all`, 'GET')
    expect(getResultEu.body).toEqual(noPermError)
    expect(getResultEu.status).toEqual(403)
  })

  it('getting person details fails without admin permissions', async () => {
    logout()
    const getResultNoPerm = await send(`person/${existingPerson.initials}`, 'GET')
    // this throws a different error since access checking happens differently in person router
    expect(getResultNoPerm.body).toEqual(unauthenticatedError)
    expect(getResultNoPerm.status).toEqual(401)

    await login('testEr')
    const getResultEr = await send(`person/${existingPerson.initials}`, 'GET')
    expect(getResultEr.body).toEqual(noPermError)
    expect(getResultEr.status).toEqual(403)

    await login('testEu')
    const getResultEu = await send(`person/${existingPerson.initials}`, 'GET')
    expect(getResultEu.body).toEqual(noPermError)
    expect(getResultEu.status).toEqual(403)
  })
})
