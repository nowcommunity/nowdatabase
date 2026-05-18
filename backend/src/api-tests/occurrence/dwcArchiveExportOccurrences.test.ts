import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import JSZip from 'jszip'
import type { Response } from 'superagent'
import app from '../../app'
import { pool } from '../../utils/db'
import { noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'

type ResponseStream = {
  on: (event: 'data', handler: (chunk: Buffer) => void) => void
} & {
  on: (event: 'end', handler: () => void) => void
}

const parseBinary = (res: Response, callback: (err: Error | null, body: Buffer) => void) => {
  const data: Buffer[] = []
  const stream = res as unknown as ResponseStream
  stream.on('data', chunk => data.push(chunk))
  stream.on('end', () => {
    callback(null, Buffer.concat(data))
  })
}

describe('DwC-A occurrence export (admin-only)', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('returns a ZIP archive for admins', async () => {
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)

    const result = await request(app)
      .get('/occurrence/export/dwc-archive')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .buffer(true)
      .parse(parseBinary)

    expect(result.status).toEqual(200)
    expect(result.headers['content-type']).toMatch(/application\/zip/i)
    expect(result.headers['content-disposition']).toMatch(/attachment;\s*filename="now_dwc_occurrences_test_export_/i)

    const zip = await JSZip.loadAsync(result.body as unknown as Buffer)
    expect(zip.file('location.csv')).toBeTruthy()
    expect(zip.file('geologicalcontext.csv')).toBeTruthy()
    expect(zip.file('taxon.csv')).toBeTruthy()
    expect(zip.file('occurrence.csv')).toBeTruthy()
    expect(zip.file('measurementorfact.csv')).toBeTruthy()
    expect(zip.file('meta.xml')).toBeTruthy()
    expect(zip.file('eml.xml')).toBeTruthy()

    const occurrenceCsv = await zip.file('occurrence.csv')!.async('string')
    expect(occurrenceCsv).toContain('"occurrenceID"')
    expect(occurrenceCsv).toContain('"locationID"')
    expect(occurrenceCsv).toContain('"taxonID"')

    const measurementCsv = await zip.file('measurementorfact.csv')!.async('string')
    expect(measurementCsv).toContain('"verbatimMeasurementType"')
  })

  it('rejects non-admin requests', async () => {
    const result = await request(app).get('/occurrence/export/dwc-archive')
    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })

  it('returns a DwC-DP ZIP archive for admins', async () => {
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)

    const result = await request(app)
      .get('/occurrence/export/dwc-data-package')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .buffer(true)
      .parse(parseBinary)

    expect(result.status).toEqual(200)
    expect(result.headers['content-type']).toMatch(/application\/zip/i)
    expect(result.headers['content-disposition']).toMatch(/attachment;\s*filename="now_dwc_dp_test_export_/i)

    const zip = await JSZip.loadAsync(result.body as unknown as Buffer)
    expect(zip.file('datapackage.json')).toBeTruthy()
    expect(zip.file('event.csv')).toBeTruthy()
    expect(zip.file('geological-context.csv')).toBeTruthy()
    expect(zip.file('occurrence.csv')).toBeTruthy()
    expect(zip.file('event-assertion.csv')).toBeTruthy()
    expect(zip.file('occurrence-assertion.csv')).toBeTruthy()
    expect(zip.file('eml.xml')).toBeTruthy()
  })

  it('rejects non-admin DwC-DP requests', async () => {
    const result = await request(app).get('/occurrence/export/dwc-data-package')
    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })

  it('returns a full Darwin Core ZIP archive for admins', async () => {
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)

    const result = await request(app)
      .get('/occurrence/export/dwc-full-package')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .buffer(true)
      .parse(parseBinary)

    expect(result.status).toEqual(200)
    expect(result.headers['content-type']).toMatch(/application\/zip/i)
    expect(result.headers['content-disposition']).toMatch(/attachment;\s*filename="now_dwc_full_test_export_/i)

    const zip = await JSZip.loadAsync(result.body as unknown as Buffer)
    expect(zip.file('README.txt')).toBeTruthy()
    expect(zip.file('dwc-dp/datapackage.json')).toBeTruthy()
    expect(zip.file('dwc-dp/occurrence.csv')).toBeTruthy()
    expect(zip.file('dwc-a-taxa/taxon.csv')).toBeTruthy()
    expect(zip.file('dwc-a-taxa/measurementorfact.csv')).toBeTruthy()
    expect(zip.file('dwc-a-taxa/meta.xml')).toBeTruthy()
  })

  it('rejects non-admin full Darwin Core requests', async () => {
    const result = await request(app).get('/occurrence/export/dwc-full-package')
    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })
})
