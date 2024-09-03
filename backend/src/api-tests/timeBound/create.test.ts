/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { LogRow } from '../../services/write/writeOperations/types'
import { login, send, testLogRows } from '../utils'
import { newTimeBoundBasis } from './data'
import { TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'

let createdTimeBound: TimeBoundDetailsType | null = null

describe.only('Creating new time bound works', () => {
  before(async () => {
    await login()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('time-bound', 'PUT', {
      timeBound: { ...newTimeBoundBasis },
    })

    const { id: createdId } = resultBody

    assert(typeof createdId === 'number', `Invalid result returned on write: ${createdId}`)

    const { body } = await send<TimeBoundDetailsType>(`time-bound/${createdId}`, 'GET')
    createdTimeBound = body
  })

  it('Contains correct data', () => {
    const { b_name, b_comment, age } = createdTimeBound!
    assert(b_name === newTimeBoundBasis.b_name, 'Name is different than expected')
    assert(age === newTimeBoundBasis.age, 'Age differs')
    assert(b_comment === newTimeBoundBasis.b_comment, 'Comment differs')
  })

  it('Update logs are correct', () => {
    const lastUpdate = createdTimeBound!.now_bau[createdTimeBound!.now_bau.length - 1]
    assert(lastUpdate.bau_comment === newTimeBoundBasis.comment, 'Comment is correct')
    const logRows = lastUpdate.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        table: 'now_tu_bound',
        column: 'b_name',
        oldValue: null,
        value: newTimeBoundBasis.b_name!,
        type: 'add',
      },
    ]
    testLogRows(logRows, expectedLogRows, 3)
  })
})
