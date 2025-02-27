import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { PersonDetailsType } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { editedPerson, existingPerson } from './data'

let updatedPerson: PersonDetailsType | null = null

describe('Updating person works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid initials', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ initials: string }>('person/', 'PUT', {
      person: editedPerson,
    })
    const { initials: resultId } = resultBody

    expect(typeof resultId).toEqual('string')
    expect(getReqStatus).toEqual(200)

    const { body, status: getReqStat } = await send<PersonDetailsType>(`person/${resultId}`, 'GET')
    expect(getReqStat).toEqual(200)
    updatedPerson = body
  })

  it('Contains correct data and full name is automatically updated', () => {
    const { initials, first_name, surname, full_name, email, organization, country } = updatedPerson!
    expect(initials).toEqual(existingPerson.initials)
    expect(first_name).toEqual(editedPerson.first_name)
    expect(surname).toEqual(editedPerson.surname)
    expect(email).toEqual(editedPerson.email)
    expect(organization).toEqual(editedPerson.organization)
    expect(country).toEqual(editedPerson.country)

    expect(full_name).toEqual(`${editedPerson.first_name} ${editedPerson.surname}`)
  })

  it('Updating fails if any person field is empty', async () => {
    const { body: resultBody1, status: getReqStatus1 } = await send('person/', 'PUT', {
      person: { ...editedPerson, first_name: '' },
    })
    expect(getReqStatus1).toEqual(403)
    expect(resultBody1.length).toEqual(1) //There should be 1 validation error

    const { body: resultBody2, status: getReqStatus2 } = await send('person/', 'PUT', {
      person: { ...editedPerson, surname: '' },
    })
    expect(getReqStatus2).toEqual(403)
    expect(resultBody2.length).toEqual(1) //There should be 1 validation error

    const { body: resultBody3, status: getReqStatus3 } = await send('person/', 'PUT', {
      person: { ...editedPerson, email: '' },
    })
    expect(getReqStatus3).toEqual(403)
    expect(resultBody3.length).toEqual(1) //There should be 1 validation error

    const { body: resultBody4, status: getReqStatus4 } = await send('person/', 'PUT', {
      person: { ...editedPerson, organization: '' },
    })
    expect(getReqStatus4).toEqual(403)
    expect(resultBody4.length).toEqual(1) //There should be 1 validation error

    const { body: resultBody5, status: getReqStatus5 } = await send('person/', 'PUT', {
      person: { ...editedPerson, country: '' },
    })
    expect(getReqStatus5).toEqual(403)
    expect(resultBody5.length).toEqual(1) //There should be 1 validation error
  })

  it('Updating other people fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('person/', 'PUT', {
      person: { initials: 'AD', first_name: 'Test first name 2' },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(401)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('person/', 'PUT', {
      person: { initials: 'AD', first_name: 'Test first name 2' },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(401)

    await login('testEu')
    const { body: resultBodyEu, status: resultStatusEu } = await send('person/', 'PUT', {
      person: { initials: 'AD', first_name: 'Test first name 2' },
    })
    expect(resultBodyEu).toEqual(noPermError)
    expect(resultStatusEu).toEqual(401)
  })

  it('Non-admin user updating their own information succeeds', async () => {
    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send<{ initials: string }>('person/', 'PUT', {
      person: { initials: 'TEST-ER', first_name: 'Test first name 3' },
    })
    const { initials: resultId } = resultBodyEr

    expect(typeof resultId).toEqual('string')
    expect(resultStatusEr).toEqual(200)

    const { body, status: getReqStat } = await send<PersonDetailsType>(`person/${resultId}`, 'GET')
    expect(getReqStat).toEqual(200)
    expect(body.first_name).toEqual('Test first name 3')
  })
})
