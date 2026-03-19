import { afterAll, beforeEach, describe, it, expect, jest } from '@jest/globals'
import type { GeonamesJSON, ParsedGeoname } from '../../../frontend/src/shared/types'
import { send } from './utils'
import { pool } from '../utils/db'

const buildGeonamesResponse = (names: string[]): GeonamesJSON => ({
  totalResultsCount: names.length,
  geonames: names.map((name, index) => ({
    adminCode1: 'test-admin',
    lng: `${24.9 + index}`,
    geonameId: 1000 + index,
    toponymName: name,
    countryId: '1',
    fcl: 'P',
    population: 1,
    countryCode: 'FI',
    name,
    fclName: 'city, village,...',
    adminCodes1: {
      ISO3166_2: 'FI-18',
    },
    countryName: 'Finland',
    fcodeName: 'populated place',
    adminName1: 'Uusimaa',
    lat: `${60.1 + index}`,
    fcode: 'PPL',
  })),
})

const getRequestUrl = (input: string | URL | Request) => {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  return input.url
}

describe('Getting data from Geonames-API', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((input: string | URL | Request) => {
      const url = getRequestUrl(input)

      if (url.includes('Kumpula')) {
        return Promise.resolve({
          json: () =>
            buildGeonamesResponse(['Kumpula', 'Kumpulantie', 'Kumpulanlaakso', 'Kumpulanmaki', 'Kumpula park']),
        } as Response)
      }

      if (url.includes('Tursola')) {
        return Promise.resolve({
          json: () => buildGeonamesResponse(['Tursola', 'Tursola village']),
        } as Response)
      }

      return Promise.resolve({
        json: () => buildGeonamesResponse([]),
      } as Response)
    })
  })

  afterAll(async () => {
    jest.restoreAllMocks()
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
