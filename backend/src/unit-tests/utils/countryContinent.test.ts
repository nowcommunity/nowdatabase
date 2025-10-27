import { describe, expect, it } from '@jest/globals'
import {
  getAvailableContinents,
  getContinentForCountry,
  getCountriesForContinent,
  isValidCountry,
} from '../../utils/countryContinent'

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
