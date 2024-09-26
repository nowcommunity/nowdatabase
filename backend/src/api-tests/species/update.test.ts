import { beforeEach, beforeAll, describe, it, expect } from '@jest/globals'
import { EditMetaData, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, resetDatabase, send, testLogRows } from '../utils'
import { editedSpecies } from './data'

let editedSpeciesResult: (SpeciesDetailsType & EditMetaData) | null = null

describe('Updating species works', () => {
  beforeAll(async () => {
    await resetDatabase()
  })
  beforeEach(async () => {
    await login()
  })

  it('Edits name, comment and locality-species correctly', async () => {
    const writeResult = await send<{ id: number }>('species', 'PUT', { species: editedSpecies })
    expect(writeResult.status).toEqual(200) // 'Response status was OK'
    expect(writeResult.body.id).toEqual(editedSpecies.species_id) // `Invalid result returned on write: ${writeResult.body.id}`

    const { body, status } = await send<SpeciesDetailsType>(`species/${writeResult.body.id}`, 'GET')
    expect(status).toEqual(200) // 'Status on response to GET added species request was OK'
    editedSpeciesResult = body
  })

  it('Name changed correctly', () => {
    expect(editedSpeciesResult!.species_name).toEqual(editedSpecies.species_name) // 'Name was not changed correctly'
  })

  it('Added locality species is found', () => {
    editedSpeciesResult!.now_ls.find(ls => ls.species_id === editedSpecies.species_id && ls.lid === 20920) //'Added locality species not found'
    expect(!!editedSpeciesResult).toEqual(true)
  })

  it('Locality species include correct amount of entries', () => {
    expect(editedSpeciesResult!.now_ls.length).toEqual(2) // `Unexpected now_ls length: ${editedSpeciesResult!.now_ls.length}`)
  })

  it('Changes were logged correctly', () => {
    const update = editedSpeciesResult!.now_sau
    const lastUpdate = update[update.length - 1]

    expect(lastUpdate.sau_comment).toEqual(editedSpecies.comment) // 'Comment wrong'
    expect(lastUpdate.now_sr[lastUpdate.now_sr.length - 1].rid).toEqual(editedSpecies.references![0].rid)

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
