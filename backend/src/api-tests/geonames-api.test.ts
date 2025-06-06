import { afterAll, describe, it, expect } from '@jest/globals'
import type { ParsedGeoname } from '../../../frontend/src/shared/types'
import { send } from './utils'
import { pool } from '../utils/db'

describe('Getting data from Geonames-API', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('with correct data returns all items', async () => {
    const result = await send<{ locations: ParsedGeoname[] }>('geonames-api', 'POST', {
      locationName: 'Kumpula',
    })
    expect(result.status).toEqual(200)
    expect(result.body.locations.length).toEqual(5)
  })

  it('with correct data and specific enough location returns less than 5 items', async () => {
    const result = await send<{ locations: ParsedGeoname[] }>('geonames-api', 'POST', {
      locationName: 'Tursola',
    })
    expect(result.status).toEqual(200)
    expect(result.body.locations.length).toEqual(2)
  })

  it("with missing location doesn't query the API", async () => {
    const result = await send<{ locations: ParsedGeoname[] }>('geonames-api', 'POST', {})
    expect(result.status).toEqual(400)
    expect(result.body.locations).toEqual(undefined)
  })
})
