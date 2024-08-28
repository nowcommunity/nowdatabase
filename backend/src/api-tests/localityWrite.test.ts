/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { LocalityDetailsType } from '../../../frontend/src/backendTypes'
import { LogRow } from '../services/writeOperations/types'
import { editedLocality, newLocalityBasis } from './data'
import { login, send } from './utils'

const actionTypeToString = {
  1: 'delete',
  2: 'add',
  3: 'update',
} as Record<number, string>

let resultLocality: LocalityDetailsType | null = null

let createdLocality: LocalityDetailsType | null = null

describe('Locality write works', () => {
  before(async () => {
    await login()
  })

  it('Edits name, synonyms and locality species correctly', async () => {
    const writeResult = await send<{ id: number }>('locality', 'PUT', { locality: editedLocality })
    assert(writeResult.body.id === editedLocality.lid, `Invalid result returned on write: ${writeResult.body.id}`)
    const { body } = await send<LocalityDetailsType>(`locality/${editedLocality.lid}`, 'GET')
    resultLocality = body
  })

  it('Name changed correctly', () => {
    assert(resultLocality!.loc_name === editedLocality.loc_name, 'Name was not changed correctly')
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

    assert(lastUpdate.lau_comment === editedLocality.comment, 'Comment wrong')
    assert(lastUpdate.now_lr[lastUpdate.now_lr.length - 1].rid === editedLocality.references[0].rid)

    const logRows = lastUpdate.updates

    const expectedLogRows: Partial<LogRow & { errorMessage: string }>[] = [
      {
        oldValue: 'Dmanisi',
        value: editedLocality.loc_name,
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
        row =>
          row.column_name === expectedRow.column &&
          row.table_name === expectedRow.table &&
          row.old_data === expectedRow.oldValue &&
          row.new_data === expectedRow.value
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
    assert(logRows.length === 5, 'Wrong amount of log rows in relevant update')
  })
})

describe('Creating new locality works', () => {
  before(async () => {
    await login()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const { id: createdId } = resultBody
    assert(typeof createdId === 'number', `Invalid result returned on write: ${createdId}`)
    const { body } = await send<LocalityDetailsType>(`locality/${createdId}`, 'GET')
    createdLocality = body
  })

  it('Contains correct data', () => {
    const { loc_name, now_ls } = createdLocality!
    assert(loc_name === newLocalityBasis.loc_name, 'Name is different')
    const newSpecies = now_ls.find(ls => ls.com_species.species_name === 'Newspecies')
    assert(!!newSpecies, 'New species not found')
    const oldSpecies = now_ls.find(ls => ls.species_id === 21052 && ls.lid === createdLocality!.lid)
    assert(!!oldSpecies, 'Old species not found')
  })
})
