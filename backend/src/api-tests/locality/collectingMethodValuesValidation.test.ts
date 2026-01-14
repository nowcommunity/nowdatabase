import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/shared/types'
import { ValidationObject } from '../../../../frontend/src/shared/validators/validator'
import { newLocalityBasis } from './data'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('Locality collecting method validation', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('persists valid collecting methods for a locality', async () => {
    const created = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const lid = created.body.id

    const { body: locality } = await send<LocalityDetailsType>(`locality/${lid}`, 'GET')

    const values = locality.now_coll_meth.map(method => method.coll_meth)
    expect(values).toEqual(expect.arrayContaining(['surface', 'systematic_loc_survey']))
    locality.now_coll_meth.forEach(method => {
      expect(method.lid).toEqual(lid)
    })
  })

  it('rejects invalid collecting method values', async () => {
    const created = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const lid = created.body.id

    const updatePayload = {
      ...newLocalityBasis,
      lid,
      now_ls: [],
      now_mus: [],
      now_ss: [],
      now_syn_loc: [],
      now_plr: [],
      now_coll_meth: [{ coll_meth: 'not_real', rowState: 'new' }],
      references: newLocalityBasis.references,
    }

    const { body, status } = await send<ValidationObject[]>('locality', 'PUT', { locality: updatePayload })

    expect(status).toEqual(400)
    expect(body).toEqual([
      {
        name: 'now_coll_meth',
        error: 'Collecting method value(s) not recognized: not_real',
      },
    ])
  })
})
