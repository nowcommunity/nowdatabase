import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/shared/types'
import { editedLocality, newLocalityBasis } from './data'
import { login, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Min and max age checks work', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Creating a locality with contradictory min and max ages does not work', async () => {
    const locality = newLocalityBasis
    locality.min_age = 10
    locality.max_age = 9
    const { status: putReqStatus } = await send<{ id: number }>('locality', 'PUT', {
      locality: locality,
    })

    expect(putReqStatus).toEqual(403)

    const { body: getReqBody, status: getReqStatus } = await send<LocalityDetailsType>(`locality/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody).not.toContain(newLocalityBasis)
  })

  it('Editing a locality with contradictory min and max ages does not work', async () => {
    const locality = editedLocality
    // @ts-expect-error: min age property is not implied to exist in locality
    locality.min_age = 10
    // @ts-expect-error: max age property is not implied to exist in locality
    locality.max_age = 9
    const writeResult = await send<{ id: number }>('locality', 'PUT', { locality: locality })

    expect(writeResult.status).toEqual(403)
    expect(writeResult.body).toEqual([
      { error: 'Min value cannot be higher than max', name: 'Age (min)' },
      { error: 'Max value cannot be lower than min', name: 'Age (max)' },
    ])
  })
})
