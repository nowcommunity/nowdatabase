import { describe, expect, it } from '@jest/globals'
import { validCountries } from '../../shared/validators/countryList'
import {
  countryToContinentMap,
  getContinentByCountry,
  matchesCountryOrContinent,
} from '../../shared/validators/countryContinents'

describe('country continent mapping', () => {
  it('maps every valid country to a continent', () => {
    const missingCountries = validCountries.filter(country => !(country in countryToContinentMap))

    expect(missingCountries).toHaveLength(0)
  })

  it('resolves continents case-insensitively', () => {
    expect(getContinentByCountry('  canada ')).toBe('North America')
    expect(getContinentByCountry('BRAZIL')).toBe('South America')
    expect(getContinentByCountry('unknown')).toBeUndefined()
  })

  it('matches continent aliases and country names', () => {
    expect(matchesCountryOrContinent('Finland', 'Europe')).toBe(true)
    expect(matchesCountryOrContinent('Finland', 'eur')).toBe(true)
    expect(matchesCountryOrContinent('Finland', 'asia')).toBe(false)

    expect(matchesCountryOrContinent('Mexico', 'central america')).toBe(true)
    expect(matchesCountryOrContinent('Brazil', 'latin america')).toBe(true)
    expect(matchesCountryOrContinent('Canada', 'americas')).toBe(true)
    expect(matchesCountryOrContinent('Kenya', 'afr')).toBe(true)

    expect(matchesCountryOrContinent('Australia', 'oceania')).toBe(true)
    expect(matchesCountryOrContinent('Australia', 'pacific')).toBe(true)

    expect(matchesCountryOrContinent('Kenya', 'oceania')).toBe(false)
    expect(matchesCountryOrContinent(null, 'Europe')).toBe(false)
    expect(matchesCountryOrContinent('Kenya', '')).toBe(true)
  })
})
