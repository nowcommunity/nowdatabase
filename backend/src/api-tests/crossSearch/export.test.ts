import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { parseString } from 'fast-csv'
import request from 'supertest'
import type { Response } from 'superagent'
import app from '../../app'
import { resetDatabase, send, resetDatabaseTimeout } from '../utils'
import { pool } from '../../utils/db'

type ResponseStream = {
  on: (event: 'data', handler: (chunk: Buffer) => void) => void
} & {
  on: (event: 'end', handler: () => void) => void
}

type CsvRow = Record<string, string>

const parseResponseBody = (res: Response, callback: (err: Error | null, body: Buffer) => void) => {
  const data: Buffer[] = []
  const stream = res as unknown as ResponseStream
  stream.on('data', chunk => data.push(chunk))
  stream.on('end', () => {
    callback(null, Buffer.concat(data))
  })
}

const parseCsvRows = async (csvContent: string) =>
  new Promise<CsvRow[]>((resolve, reject) => {
    const rows: CsvRow[] = []
    parseString<CsvRow, CsvRow>(csvContent, { headers: true })
      .on('error', reject)
      .on('data', (row: CsvRow) => rows.push(row))
      .on('end', () => resolve(rows))
  })

const exportCrossSearchCsv = async (body: { columnFilters: unknown[]; sorting: unknown[] }) => {
  const response = await request(app).post('/crosssearch/export').send(body).buffer(true).parse(parseResponseBody)
  return {
    ...response,
    csvContent: (response.body as Buffer).toString('utf8'),
  }
}

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

  it('with invalid POST column filters type does not work', async () => {
    const response = await send(`crosssearch/export`, 'POST', { columnFilters: '"not an array"', sorting: [] })
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

  it('exports filtered CSV content with expected headers and rows', async () => {
    const response = await exportCrossSearchCsv({
      columnFilters: [{ id: 'country', value: 'Spain' }],
      sorting: [{ id: 'loc_name', desc: false }],
    })

    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toMatch(/text\/csv/i)
    expect(response.headers['content-disposition']).toMatch(/attachment;\s*filename="cross_search/i)
    expect(response.csvContent).toContain('"lid_now_loc"')
    expect(response.csvContent).toContain('"loc_name"')
    expect(response.csvContent).toContain('"country"')
    expect(response.csvContent).toContain('"species_name"')
    expect(response.csvContent).not.toContain('"full_count"')

    const rows = await parseCsvRows(response.csvContent)
    expect(rows).toHaveLength(10)
    expect(rows.every(row => row.country === 'Spain')).toBe(true)
    expect(rows.map(row => row.loc_name)).toContain("Romanyà d'Empordà")
    expect(rows.map(row => row.species_name)).toContain('dubia')
  })

  it('exports CSV content in the requested sorting order', async () => {
    const response = await exportCrossSearchCsv({
      columnFilters: [],
      sorting: [{ id: 'lid_now_loc', desc: true }],
    })

    expect(response.status).toEqual(200)
    const rows = await parseCsvRows(response.csvContent)
    expect(rows).toHaveLength(20)
    expect(rows.slice(0, 5).map(row => row.lid_now_loc)).toEqual(['28518', '28518', '28518', '28518', '28518'])
    expect(rows.slice(5, 10).map(row => row.lid_now_loc)).toEqual(['24797', '24797', '24797', '24797', '24797'])
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
