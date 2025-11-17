import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool } from '../../utils/db'
import { login, logout, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { ReferenceDetailsType } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'
import { newReferenceBasis } from './data'

describe('Deleting a reference', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('with permissions succeeds', async () => {
    await login('testSu')

    // Deleting a reference doesn't work if it is still used by some other entity so creating a new one

    const { body: resultBody, status: getReqStatus } = await send<{ rid: number }>('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    const { rid: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { body: data } = await send<ReferenceDetailsType>(`reference/${createdId}`, 'GET')
    const createdRef = data

    const { ref_authors, ref_journal, journal_id } = createdRef

    expect(ref_authors.length).toEqual(3) //there should be an authors
    expect(typeof journal_id).toEqual('number') //journal id should exist
    expect(ref_journal).toBeTruthy() //There should be a journal

    //now deleting the reference
    const deleteResultSu = await send(`reference/${createdId}`, 'DELETE')
    expect(deleteResultSu.status).toEqual(200)
    const { status: getReqStatusSu } = await send(`reference/${createdId}`, 'GET')
    expect(getReqStatusSu).toEqual(404)

    const { status: getReqStatus2 } = await send<Prisma.ref_journal>(`reference/journal/${journal_id}`, 'GET')
    expect(getReqStatus2).toEqual(200) // check journal still exists in db

    const { body, status: getReqStatus3 } = await send(`reference/authors/${createdId}`, 'GET')
    expect(getReqStatus3).toEqual(200)
    expect(body.length).toEqual(0) //There should be no authors linked to the id of the ledeted reference
  })

  it('fails when linked updates exist', async () => {
    await login('testSu')

    const { body, status } = await send<{ message: string }>('reference/10039', 'DELETE')

    expect(status).toEqual(409)
    expect(body).toEqual({ message: 'The Reference with associated updates cannot be deleted.' })

    const { status: stillExistsStatus } = await send(`reference/10039`, 'GET')
    expect(stillExistsStatus).toEqual(200)
  })

  it('without permissions fails', async () => {
    logout()
    const deleteResultNoPerm = await send('reference/10039', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)
    const getResultNoPerm = await send('reference/10039', 'GET')
    expect(getResultNoPerm.status).toEqual(200)

    logout()
    await login('testEr')
    const deleteResultEr = await send('reference/10039', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
    const getResultEr = await send('reference/10039', 'GET')
    expect(getResultEr.status).toEqual(200)

    logout()
    await login('testEu')
    const deleteResultEu = await send('reference/10039', 'DELETE')
    expect(deleteResultEu.status).toEqual(403)
    const getResultEu = await send('reference/10039', 'GET')
    expect(getResultEu.status).toEqual(200)
  })
})
