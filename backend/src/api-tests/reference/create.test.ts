import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { ReferenceDetailsType } from '../../../../frontend/src/shared/types'
//import { LogRow } from '../../services/write/writeOperations/types'
import { newReferenceBasis, emptyReferenceBasis } from './data'
import { login, logout, resetDatabase, send, /*testLogRows,*/ resetDatabaseTimeout, noPermError } from '../utils'
import { pool } from '../../utils/db'
import Prisma from '../../../prisma/generated/now_test_client'

let createdRef: ReferenceDetailsType | null = null

describe('Creating new reference works', () => {
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
    const { body: resultBody, status: getReqStatus } = await send<{ rid: number }>('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    const { rid: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`
    expect(getReqStatus).toEqual(200)

    const { status: getReqStat } = await send<ReferenceDetailsType>(`reference/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)

    const { body } = await send<ReferenceDetailsType>(`reference/${createdId}`, 'GET')
    createdRef = body
  })

  it('Contains correct data', () => {
    const { title_primary, ref_authors, ref_journal, journal_id } = createdRef!
    expect(title_primary).toEqual(newReferenceBasis.title_primary) // 'Name is different'
    expect(ref_authors.length).toEqual(3) //authors have been created and are fetched
    expect(ref_journal.journal_title).toEqual(newReferenceBasis.ref_journal?.journal_title) //journal have been created and is fetched
    expect(journal_id).toBeDefined()
  })

  it('Adding "removed" in rowstate of authors & journal deletes author and clear journal data from reference', async () => {
    const { status: getReqStatus } = await send<{ rid: number }>(`reference/`, 'PUT', {
      reference: {
        ...createdRef,
        //changing type_id to 2 since journals are mandatory on type 1
        ref_type_id: 2,
        ref_authors: [
          {
            rid: undefined,
            au_num: 1,
            author_surname: 'testiauthor',
            author_initials: 'testi-initials',
            field_id: 2,
            rowState: 'removed',
          },
          {
            rid: undefined,
            au_num: 2,
            author_surname: 'testiauthor2',
            author_initials: 'testi-initials2',
            field_id: 2,
            rowState: 'removed',
          },
          {
            rid: undefined,
            au_num: 1,
            author_surname: 'testiauthor3',
            author_initials: 'testi-initials3',
            field_id: 12,
            rowState: 'new',
          },
        ],
        ref_journal: {
          ...createdRef!.ref_journal,
          rowState: 'removed',
        },
      },
    })
    expect(getReqStatus).toEqual(200)
    const { body: resultBody } = await send<ReferenceDetailsType>(`reference/${createdRef!.rid}`, 'GET')
    const updatedRef = resultBody
    const { ref_authors, ref_journal, journal_id } = updatedRef

    expect(ref_authors.length).toEqual(1) //authors have been removed from the reference
    expect(journal_id).toBeNull() //journal id set to null
    expect(ref_journal).toBeNull() //no journal fetched

    const { status: getReqStatus2 } = await send<Prisma.ref_journal>(
      `reference/journal/${createdRef?.journal_id}`,
      'GET'
    )
    expect(getReqStatus2).toEqual(200) // check journal still exists in db

    const { body, status: getReqStatus3 } = await send(`reference/authors/${createdRef?.rid}`, 'GET')
    expect(getReqStatus3).toEqual(200)
    expect(body.length).toEqual(1) // Authors should be deleted from db
  })

  it('Removing author / journal data from reference should clear the data from db', async () => {
    const { status: getReqStatus } = await send<{ rid: number }>(`reference/`, 'PUT', {
      reference: {
        ...createdRef,
        ref_type_id: 2,
        ref_authors: [createdRef!.ref_authors[0]],
        ref_journal: null,
      },
    })
    expect(getReqStatus).toEqual(200)
    const { body: resultBody } = await send<ReferenceDetailsType>(`reference/${createdRef!.rid}`, 'GET')

    const updatedRef = resultBody

    const { ref_authors, ref_journal, journal_id } = updatedRef

    expect(ref_authors.length).toEqual(1) //there should be only 1 author with the 2 others being deleted
    expect(journal_id).toBeNull() //journal id set to null
    expect(ref_journal).toBeNull() //no journal fetched

    const { status: getReqStatus2 } = await send<Prisma.ref_journal>(
      `reference/journal/${createdRef?.journal_id}`,
      'GET'
    )
    expect(getReqStatus2).toEqual(200) // check journal still exists in db

    const { body, status: getReqStatus3 } = await send(`reference/authors/${createdRef?.rid}`, 'GET')
    expect(getReqStatus3).toEqual(200)
    expect(body.length).toEqual(1) //Unused authors should be deleted from db
  })

  it('All validators fail with empty reference', async () => {
    const { body: resultBody, status: getReqStatus } = await send('reference/', 'PUT', {
      reference: { ...emptyReferenceBasis },
    })
    expect(getReqStatus).toEqual(403)
    expect(resultBody.length).toEqual(8) //There should be 8 validation errors
  })

  it('All validators pass with correct data', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ rid: number }>('reference/', 'PUT', {
      reference: {
        ...emptyReferenceBasis,
        title_primary: 'title_primary',
        date_primary: 2020,
        title_secondary: 'title_secondary',
        title_series: 'title_series',
        gen_notes: 'gen_notes',
        exact_date: '2024-11-18',
        ref_authors: [
          {
            rid: undefined,
            au_num: 1,
            author_surname: 'testiauthor',
            author_initials: 'testi-initials',
            field_id: 2,
            rowState: 'new',
          },
        ],
        ref_journal: {
          journal_title: 'testijournal',
          short_title: 'shorttitle',
          alt_title: 'alttitle',
          ISSN: 'issn',
          rowState: 'new',
        },
      },
    })
    expect(getReqStatus).toEqual(200)
    expect(typeof resultBody.rid).toEqual('number')
  })

  it('Creation fails without permissions', async () => {
    logout()
    const { body: resultBodyNoPerm, status: resultStatusNoPerm } = await send('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    expect(resultBodyNoPerm).toEqual(noPermError)
    expect(resultStatusNoPerm).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send('reference/', 'PUT', {
      reference: { ...newReferenceBasis },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)
  })
})
