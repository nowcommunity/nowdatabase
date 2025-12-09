import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/shared/types'
import { newLocalityBasis } from './data'
import { login, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Updating locality time unit keeps provided ages', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('persists min/max ages when time unit changes', async () => {
    const created = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const lid = created.body.id

    const updatedAges = { min_age: '5.4', max_age: '7.8' }
    const updatePayload = {
      ...newLocalityBasis,
      ...updatedAges,
      lid,
      bfa_min: 'abdounian',
      bfa_max: 'abdounian',
      now_ls: [],
      now_mus: [],
      now_ss: [],
      now_coll_meth: [],
      now_syn_loc: [],
      now_plr: [],
      references: newLocalityBasis.references,
    }

    const updateResult = await send<{ id: number }>('locality', 'PUT', { locality: updatePayload })
    expect(updateResult.status).toEqual(200)
    expect(updateResult.body.id).toEqual(lid)

    const { body: updatedLocality } = await send<LocalityDetailsType>(`locality/${lid}`, 'GET')
    expect(updatedLocality.min_age).toEqual(parseFloat(updatedAges.min_age))
    expect(updatedLocality.max_age).toEqual(parseFloat(updatedAges.max_age))
    expect(updatedLocality.bfa_min).toEqual('abdounian')
    expect(updatedLocality.bfa_max).toEqual('abdounian')
  })
})
