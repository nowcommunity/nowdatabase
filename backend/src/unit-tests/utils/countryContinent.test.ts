import { describe, expect, it } from '@jest/globals'
import {
  getAvailableContinents,
  getContinentForCountry,
  getCountriesForContinent,
  isValidCountry,
} from '../../utils/countryContinent'
import { createCountryContinentLookup, normalizeCountryContinentData } from '../../../../shared/countryContinent'
import type { Continent } from '../../../../shared/countryContinent'

describe('country/continent mapping utility', () => {
  it('resolves continent for a known country', () => {
    expect(getContinentForCountry('Finland')).toBe('Europe')
    expect(getContinentForCountry('Kenya')).toBe('Africa')
  })

  it('lists all countries for a continent', () => {
    const europeanCountries = getCountriesForContinent('Europe')
    expect(europeanCountries).toContain('Finland')
    expect(europeanCountries).toContain('Spain')
    const oceaniaCountries = getCountriesForContinent('Oceania')
    expect(oceaniaCountries).toContain('Australia')
    expect(oceaniaCountries).toContain('New Zealand')
  })

  it('handles unknown values gracefully', () => {
    expect(getContinentForCountry('Atlantis')).toBeUndefined()
    expect(getCountriesForContinent('North America')).not.toContain('Atlantis')
    expect(isValidCountry('Atlantis')).toBe(false)
  })

  it('exposes available continents', () => {
    const continents = getAvailableContinents()
    expect(continents).toEqual(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'])
  })
})

describe('country/continent mapping normalization', () => {
  it('rejects payloads that are not arrays', () => {
    expect(() => normalizeCountryContinentData('not-an-array' as unknown)).toThrow(
      'Country-continent mapping must be an array'
    )
  })

  it('rejects entries with unknown continents', () => {
    expect(() =>
      normalizeCountryContinentData([
        {
          country: 'Atlantis',
          continent: 'Moon' as unknown as Continent,
        },
      ])
    ).toThrow('Unknown continent "Moon" on mapping entry at index 0')
  })

  it('rejects duplicate country entries when building the lookup', () => {
    const normalized = normalizeCountryContinentData([
      { country: 'Exampleland', continent: 'Europe' },
      { country: 'Exampleland', continent: 'Asia' },
    ])

    expect(() => createCountryContinentLookup(normalized)).toThrow('Duplicate country entry detected: Exampleland')
  })
})
