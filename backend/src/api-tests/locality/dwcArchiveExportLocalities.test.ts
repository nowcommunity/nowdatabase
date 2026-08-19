import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import JSZip from 'jszip'
import type { Response } from 'superagent'
import app from '../../app'
import { pool } from '../../utils/db'
import { noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import type InputFileFormat from 'jszip'

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

describe('DwC-A locality export (admin-only)', () => {
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
      .get('/locality/export/dwc-archive')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .buffer(true)
      .parse(parseBinary)

    expect(result.status).toEqual(200)
    expect(result.headers['content-type']).toMatch(/application\/zip/i)
    expect(result.headers['content-disposition']).toMatch(/attachment;\s*filename="now_dwc_localities_export_/i)

    const zip = await JSZip.loadAsync(result.body as Buffer<ArrayBufferLike>)
    expect(zip.file('location.csv')).toBeTruthy()
    expect(zip.file('geologicalcontext.csv')).toBeTruthy()
    expect(zip.file('measurementorfact.csv')).toBeTruthy()
    expect(zip.file('meta.xml')).toBeTruthy()
    expect(zip.file('eml.xml')).toBeTruthy()

    const measurementCsv = await zip.file('measurementorfact.csv')!.async('string')
    expect(measurementCsv).toContain('"measurementID"')
    expect(measurementCsv).toContain('"parentMeasurementID"')
    expect(measurementCsv).toContain('"verbatimMeasurementType"')
  })

  it('returns a filtered ZIP archive for POST requests', async () => {
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)

    const result = await request(app)
      .post('/locality/export/dwc-archive')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .send({ ids: [21050] })
      .buffer(true)
      .parse(parseBinary)

    expect(result.status).toEqual(200)
    expect(result.headers['content-type']).toMatch(/application\/zip/i)

    const zip = await JSZip.loadAsync(result.body as Buffer<ArrayBufferLike>)
    const locationCsv = await zip.file('location.csv')!.async('string')
    expect(locationCsv).toContain('NOW:LOC:21050')
    expect(locationCsv).not.toContain('NOW:LOC:24750')
  })

  it('returns 400 for invalid POST id payloads', async () => {
    const loginResult = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    expect(loginResult.status).toEqual(200)

    const result = await request(app)
      .post('/locality/export/dwc-archive')
      .set('authorization', `bearer ${loginResult.body.token}`)
      .send({ ids: ['21050.5'] })

    expect(result.status).toEqual(400)
    expect(result.body).toEqual({ error: 'ids must contain only integers.' })
  })

  it('rejects non-admin requests', async () => {
    const result = await request(app).get('/locality/export/dwc-archive')
    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })
})
