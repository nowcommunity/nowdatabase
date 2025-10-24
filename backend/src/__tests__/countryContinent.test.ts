import { describe, expect, it, beforeEach } from '@jest/globals'
import {
  getCountriesByContinent,
  getContinentByCountry,
  getSupportedContinents,
  resolveCountries,
  resetCountryContinentCache,
} from '../utils/countryContinent'

describe('countryContinent utility', () => {
  beforeEach(() => {
    resetCountryContinentCache()
  })

  it('returns a direct match when searching by country name', () => {
    expect(resolveCountries('Finland')).toEqual(['Finland'])
  })

  it('returns countries for a continent query regardless of casing or spacing', () => {
    const matches = resolveCountries('  eurOPe  ')

    expect(matches).toEqual(expect.arrayContaining(['Finland', 'France', 'Germany']))
    expect(matches.length).toBeGreaterThan(10)
  })

  it('returns the continent for a given country', () => {
    expect(getContinentByCountry('brazil')).toBe('South America')
  })

  it('returns matching countries when searching by continent helper', () => {
    const oceania = getCountriesByContinent('Oceania')

    expect(oceania).toEqual(expect.arrayContaining(['Australia', 'New Zealand']))
  })

  it('returns an empty array when no match is found', () => {
    expect(resolveCountries('Atlantis')).toEqual([])
    expect(getCountriesByContinent('Unknown Continent')).toEqual([])
  })

  it('lists supported continents in alphabetical order', () => {
    const continents = getSupportedContinents()

    expect(continents[0]).toBe('Africa')
    expect(continents).toContain('Europe')
  })
})
