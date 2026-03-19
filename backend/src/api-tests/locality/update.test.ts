import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/shared/types'
import { LogRow } from '../../services/write/writeOperations/types'
import { ValidationObject } from '../../../../frontend/src/shared/validators/validator'
import {
  editedLocality,
  invalidEstimateTempUpdateLocality,
  invalidPollenTotalUpdateLocality,
  invalidPollenUpdateLocality,
  newLocalityBasis,
} from './data'
import { login, resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

let resultLocality: LocalityDetailsType | null = null

const buildUpdatePayload = (overrides: Record<string, unknown> = {}) => ({
  ...newLocalityBasis,
  ...editedLocality,
  lid: editedLocality.lid,
  ...overrides,
})

describe('Locality update works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await resetDatabase()
    await login()
    resultLocality = null
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('with a successful locality update applied', () => {
    beforeEach(async () => {
      const writeResult = await send<{ id: number }>('locality', 'PUT', { locality: buildUpdatePayload() })

      expect(writeResult.status).toEqual(200)
      expect(writeResult.body.id).toEqual(editedLocality.lid) // `Invalid result returned on write: ${writeResult.body.id}`

      const { body } = await send<LocalityDetailsType>(`locality/${editedLocality.lid}`, 'GET')
      resultLocality = body
    })

    it('Edits name, synonyms and locality species correctly', () => {
      expect(resultLocality?.lid).toEqual(editedLocality.lid)
    })

    it('Returns full names for coordinator and authorizer in update logs', () => {
      const updateWithCoordinator = resultLocality!.now_lau.find(lau => lau.luid === 23101)
      expect(updateWithCoordinator).toBeDefined()
      expect(updateWithCoordinator?.lau_coordinator).toEqual('cfn csn')
      expect(updateWithCoordinator?.lau_authorizer).toEqual('euf eus')
    })

    it('Name changed correctly', () => {
      expect(resultLocality!.loc_name).toEqual(editedLocality.loc_name) // 'Name was not changed correctly'
    })

    it('Added locality species is found', () => {
      resultLocality!.now_ls.find(ls => {
        return ls.species_id === 21052 && ls.lid === 21050
      }) //'Added locality species not found'
      expect(!!resultLocality).toEqual(true)
    })

    it('Locality species include exactly five entries', () => {
      expect(resultLocality!.now_ls.length).toEqual(5) // `Unexpected now_ls length: ${resultLocality!.now_ls.length}`
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
          oldValue: '85730',
          value: null,
          type: 'delete',
          column: 'species_id',
          table: 'now_ls',
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

        expect(receivedRow).toBeDefined()
      }
    })
  })

  it('Update fails when pollen values are out of range', async () => {
    const { body, status } = await send<ValidationObject[]>('locality', 'PUT', {
      locality: buildUpdatePayload(invalidPollenUpdateLocality),
    })

    expect(status).toEqual(403)
    expect(body).toEqual(
      expect.arrayContaining([
        {
          name: 'Arboreal pollen (AP%)',
          error: 'Arboreal pollen (AP%) must be between 0 and 100',
        },
      ])
    )
  })

  it('Update fails when pollen total exceeds 100', async () => {
    const { body, status } = await send<ValidationObject[]>('locality', 'PUT', {
      locality: buildUpdatePayload(invalidPollenTotalUpdateLocality),
    })

    expect(status).toEqual(403)
    expect(body).toEqual(
      expect.arrayContaining([
        {
          name: 'Arboreal pollen (AP%)',
          error:
            'Combined Arboreal (AP%), Non-arboreal (NAP%), and Other pollen (OP%) must be less than or equal to 100',
        },
      ])
    )
  })

  it('Update fails when estimate temperature is out of range', async () => {
    const { body, status } = await send<ValidationObject[]>('locality', 'PUT', {
      locality: buildUpdatePayload(invalidEstimateTempUpdateLocality),
    })

    expect(status).toEqual(403)
    expect(body).toEqual(
      expect.arrayContaining([
        {
          name: 'Estimated temperature',
          error: 'Estimated temperature must be between -999.9 and 999.9',
        },
      ])
    )
  })

  it('Editing locality without changing anything should succeed', async () => {
    const writeResult = await send<{ id: number }>('locality', 'PUT', { locality: buildUpdatePayload() })
    expect(writeResult.status).toEqual(200)
    expect(writeResult.body.id).toEqual(editedLocality.lid) // `Invalid result returned on write: ${writeResult.body.id}
  })
})
