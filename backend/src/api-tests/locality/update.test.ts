/* eslint-disable @typescript-eslint/no-floating-promises */
import { beforeEach, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/backendTypes'
import { LogRow } from '../../services/write/writeOperations/types'
import { editedLocality } from './data'
import { login, send, testLogRows } from '../utils'

let resultLocality: LocalityDetailsType | null = null

describe('Locality update works', () => {
  beforeEach(async () => {
    await login()
  })

  it('Edits name, synonyms and locality species correctly', async () => {
    const writeResult = await send<{ id: number }>('locality', 'PUT', { locality: editedLocality })

    expect(writeResult.body.id).toEqual(editedLocality.lid) // `Invalid result returned on write: ${writeResult.body.id}`

    const { body } = await send<LocalityDetailsType>(`locality/${editedLocality.lid}`, 'GET')
    resultLocality = body
  })

  it('Name changed correctly', () => {
    expect(resultLocality!.loc_name).toEqual(editedLocality.loc_name) // 'Name was not changed correctly'
  })

  it('Added locality species is found', () => {
    resultLocality!.now_ls.find(ls => {
        ls.species_id === 21052 &&
        ls.lid === 21050
    }) //'Added locality species not found'
    expect(!!resultLocality).toEqual(true)
  })

  it('Locality species include exactly two entries', () => {
    expect(resultLocality!.now_ls.length).toEqual(2) // `Unexpected now_ls length: ${resultLocality!.now_ls.length}`
  })

  it('Changes were logged correctly', () => {
    const update = resultLocality!.now_lau
    const lastUpdate = update[update.length - 1]

    expect(lastUpdate.lau_comment).toEqual(editedLocality.comment) // 'Comment wrong'
    expect(lastUpdate.now_lr[lastUpdate.now_lr.length - 1].rid).toEqual(editedLocality.references[0].rid)

    const logRows = lastUpdate.updates

    const expectedLogRows: Partial<LogRow>[] = [
      {
        oldValue: 'Dmanisi',
        value: editedLocality.loc_name,
        type: 'update',
        column: 'loc_name',
        table: 'now_loc',
      },
      {
        oldValue: '21050',
        value: null,
        type: 'delete',
        column: 'lid',
        table: 'now_ls',
      },
      {
        oldValue: '85729',
        value: null,
        type: 'delete',
        column: 'species_id',
        table: 'now_ls',
      },
    ]
    testLogRows(logRows, expectedLogRows, 5)
  })
})
