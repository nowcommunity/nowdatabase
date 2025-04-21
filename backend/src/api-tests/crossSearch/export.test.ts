import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

describe('Getting cross-search export', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  afterAll(async () => {
    await pool.end()
  })

  it('with invalid column filters type does not work', async () => {
    const response = await send(`crosssearch/export/"not an array"/[]`, 'GET')
    expect(response.status).toEqual(403)
    expect(response.body).toEqual({ error: 'ColumnFilters is not an array.' })
  })

  it('with invalid column filters content does not work', async () => {
    const { body: responseBody1, status: responseStatus1 } = await send(
      `crosssearch/export/[{"id": "not_a_column", "value": "Dmanisi"}]/[]`,
      'GET'
    )
    expect(responseStatus1).toEqual(403)
    expect(responseBody1).toEqual({ error: 'columnFilters has an invalid column id.' })

    const { body: responseBody2, status: responseStatus2 } = await send(
      `crosssearch/export/[{"value": "Dmanisi"}]/[]`,
      'GET'
    )
    expect(responseStatus2).toEqual(403)
    expect(responseBody2).toEqual([{ error: 'Invalid or missing id field in filter', name: 'Column Filters' }])

    const { body: responseBody3, status: responseStatus3 } = await send(
      `crosssearch/export/[{"id": "lid_now_loc' OR 1=1 --", "value": "Dmanisi"}]/[]`,
      'GET'
    )
    expect(responseStatus3).toEqual(403)
    expect(responseBody3).toEqual({ error: 'columnFilters has an invalid column id.' })
  })

  it('with invalid sorting type does not work', async () => {
    const response = await send(`crosssearch/export/[]/20`, 'GET')
    expect(response.status).toEqual(403)
    expect(response.body).toEqual({ error: 'Sorting is not an array.' })
  })

  it('with invalid sorting content does not work', async () => {
    const { body: responseBody1, status: responseStatus1 } = await send(
      `crosssearch/export/[]/[{"id": "not_a_column", "desc": true}]`,
      'GET'
    )
    expect(responseStatus1).toEqual(403)
    expect(responseBody1).toEqual({ error: 'orderBy was not a valid column id.' })

    const { body: responseBody2, status: responseStatus2 } = await send(`crosssearch/export/[]/[{"desc": true}]`, 'GET')
    expect(responseStatus2).toEqual(403)
    expect(responseBody2).toEqual([{ error: 'Invalid or missing id field in sort object', name: 'Sorting' }])

    const { body: responseBody3, status: responseStatus3 } = await send(
      `crosssearch/export/[]/[{"id": "lid_now_loc' OR 1=1 --", "desc": true}]`,
      'GET'
    )
    expect(responseStatus3).toEqual(403)
    expect(responseBody3).toEqual({ error: 'orderBy was not a valid column id.' })
  })
})
