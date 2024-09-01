/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { EditMetaData, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/writeOperations/types'
import { login, send, testLogRows } from '../utils'
import { editedSpecies } from './data'

let editedSpeciesResult: (SpeciesDetailsType & EditMetaData) | null = null

describe('Updating species works', () => {
  before(async () => {
    await login()
  })

  it('Edits name, comment and locality-species correctly', async () => {
    const writeResult = await send<{ id: number }>('species', 'PUT', { species: editedSpecies })
    assert(writeResult.status === 200, 'Response status was OK')
    assert(writeResult.body.id === editedSpecies.species_id, `Invalid result returned on write: ${writeResult.body.id}`)

    const { body, status } = await send<SpeciesDetailsType>(`species/${writeResult.body.id}`, 'GET')
    assert(status === 200, 'Status on response to GET added species request was OK')
    editedSpeciesResult = body
  })

  it('Name changed correctly', () => {
    assert(editedSpeciesResult!.species_name === editedSpecies.species_name, 'Name was not changed correctly')
  })

  it('Added locality species is found', () => {
    assert(
      editedSpeciesResult!.now_ls.find(ls => ls.species_id === editedSpecies.species_id && ls.lid === 20920),
      'Added locality species not found'
    )
  })

  it('Locality species include correct amount of entries', () => {
    assert(editedSpeciesResult!.now_ls.length === 2, `Unexpected now_ls length: ${editedSpeciesResult!.now_ls.length}`)
  })

  it('Changes were logged correctly', () => {
    const update = editedSpeciesResult!.now_sau
    const lastUpdate = update[update.length - 1]

    assert(lastUpdate.sau_comment === editedSpecies.comment, 'Comment wrong')
    assert(lastUpdate.now_sr[lastUpdate.now_sr.length - 1].rid === editedSpecies.references![0].rid)

    const logRows = lastUpdate.updates

    const expectedLogRows: Partial<LogRow>[] = [
      {
        table: 'com_species',
        column: 'sp_comment',
        value: editedSpecies.sp_comment,
        oldValue: null,
        type: 'update',
      },
      {
        table: 'now_ls',
        column: 'species_id',
        value: editedSpecies.species_id!.toString(),
        oldValue: null,
        type: 'add',
      },
    ]
    testLogRows(logRows, expectedLogRows, 4)
  })
})
