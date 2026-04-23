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

describe('DwC-A species export (admin-only)', () => {
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
      .get('/species/export/dwc-archive')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .buffer(true)
      .parse(parseBinary)

    expect(result.status).toEqual(200)
    expect(result.headers['content-type']).toMatch(/application\/zip/i)
    expect(result.headers['content-disposition']).toMatch(/attachment;\s*filename="now_dwc_test_export_/i)

    const zip = await JSZip.loadAsync(result.body as unknown as Buffer)
    expect(zip.file('taxon.csv')).toBeTruthy()
    expect(zip.file('measurementorfact.csv')).toBeTruthy()
    expect(zip.file('meta.xml')).toBeTruthy()
    expect(zip.file('eml.xml')).toBeTruthy()

    const taxonCsv = await zip.file('taxon.csv')!.async('string')
    expect(taxonCsv).toContain('"taxonID"')
    expect(taxonCsv).toContain('"nomenclaturalCode"')
    expect(taxonCsv).toContain('"genericName"')

    const measurementCsv = await zip.file('measurementorfact.csv')!.async('string')
    expect(measurementCsv).toContain('"measurementID"')
    expect(measurementCsv).toContain('"verbatimMeasurementType"')
    expect(measurementCsv).not.toContain('"measurementRemarks"')

    const metaXml = await zip.file('meta.xml')!.async('string')
    expect(metaXml).toContain('<core')
    expect(metaXml).toContain('<extension')
  })

  it('rejects non-admin requests', async () => {
    const result = await request(app).get('/species/export/dwc-archive')
    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })
})
