/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { LocalityDetailsType, Reference, SpeciesDetailsType } from '../../../frontend/src/backendTypes'
import { LogRow } from '../services/writeOperations/types'

const actionTypeToString = {
  1: 'delete',
  2: 'add',
  3: 'update',
} as Record<number, string>

const baseUrl = 'http://localhost:4000'

let token: string | null = null

let resultLocality: LocalityDetailsType | null = null

const locality = {
  lid: 21050,
  loc_name: 'New test name',
  now_mus: [],
  now_ls: [
    {
      rowState: 'new',
      species_id: 21052,
      lid: 21050,
      com_species: { species_id: 21052 } as SpeciesDetailsType,
    },
    {
      rowState: 'removed',
      species_id: 85729,
      lid: 21050,
      com_species: { species_id: 85729 } as SpeciesDetailsType,
    },
  ],
  projects: [],
  now_plr: [],
  now_ss: [],
  now_coll_meth: [],
  now_lau: [],
  now_syn_loc: [],
  comment: 'Test update',
  references: [{ rid: 24188 } as Reference],
}

const send = async <T extends Record<string, unknown>>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
) => {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')
  if (token) headers.append('authorization', `bearer ${token}`)

  const options = { body: method !== 'GET' ? JSON.stringify(body) : undefined, method, headers }
  const result = await fetch(`${baseUrl}/${path}`, options)
  const r = await result.text()
  if (!r) return { body: {} as T, status: result.status }
  return { body: JSON.parse(r) as T, status: result.status }
}

describe('Locality write works', () => {
  before(async () => {
    await send('test/create-test-users', 'GET')
  })

  it('Edits name, synonyms and locality species correctly', async () => {
    const loginResponse = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    if (loginResponse?.body?.token) token = loginResponse.body.token
    else throw Error('Login unsuccessful')

    const writeResult = await send<{ id: number }>('locality', 'PUT', { locality })
    assert(writeResult.body.id === locality.lid, `Invalid result returned on write: ${writeResult.body.id}`)
    const { body } = await send<LocalityDetailsType>(`locality/${locality.lid}`, 'GET')
    resultLocality = body
  })

  it('Name changed correctly', () => {
    assert(resultLocality!.loc_name === locality.loc_name, 'Name was not changed correctly')
  })

  it('Added locality species is found', () => {
    assert(
      resultLocality!.now_ls.find(ls => ls.species_id === 21052 && ls.lid === 21050),
      'Added locality species not found'
    )
  })

  it('Locality species include exactly two entries', () => {
    assert(resultLocality!.now_ls.length === 2, `Unexpected now_ls length: ${resultLocality!.now_ls.length}`)
  })

  it('Changes were logged correctly', () => {
    const update = resultLocality!.now_lau
    const lastUpdate = update[update.length - 1]
    assert(lastUpdate.lau_comment === locality.comment, 'Comment wrong')
    assert(lastUpdate.now_lr[lastUpdate.now_lr.length - 1].rid === locality.references[0].rid)
    const logRows = lastUpdate.updates
    const expectedLogRows: Partial<LogRow & { errorMessage: string }>[] = [
      {
        oldValue: 'Dmanisi',
        value: locality.loc_name,
        type: 'update',
        column: 'loc_name',
        table: 'now_loc',
        errorMessage: 'loc_name log row was not correct',
      },
      {
        oldValue: '21050',
        value: null,
        type: 'delete',
        column: 'lid',
        table: 'now_ls',
        errorMessage: 'Locality-species lid log row was not correct',
      },
      {
        oldValue: '85729',
        value: null,
        type: 'delete',
        column: 'species_id',
        table: 'now_ls',
        errorMessage: 'Locality-species species_id log row was not correct',
      },
    ]
    for (const expectedRow of expectedLogRows) {
      const receivedRow = logRows.find(
        row => row.column_name === expectedRow.column && row.table_name === expectedRow.table
      )
      assert(!!receivedRow, 'Did not find relevant log row')
      const debugLog = `Row: \n${JSON.stringify(receivedRow, null, 2)}\nExpected:\n${JSON.stringify(expectedRow)}`
      assert(receivedRow.new_data === expectedRow.value, `Log rows new data differs. ${debugLog}`)
      assert(receivedRow.old_data === expectedRow.oldValue, `Log rows old data differs. ${debugLog}`)
      assert(
        actionTypeToString[receivedRow.log_action!] === expectedRow.type,
        `Log rows action type differs. ${debugLog}`
      )
    }
  })
})
