import countryContinentJson from '../../../../data/countryContinentMap.json'
import {
  Continent,
  CountryContinentEntry,
  createCountryContinentLookup,
  normalizeCountryContinentData,
} from '../../../../shared/countryContinent'

const entries = normalizeCountryContinentData(countryContinentJson)
const lookup = createCountryContinentLookup(entries)

export type { Continent, CountryContinentEntry }

export const countryContinentEntries: readonly CountryContinentEntry[] = lookup.entries

export const validCountries: readonly string[] = lookup.validCountries

export const availableContinents: readonly Continent[] = lookup.availableContinents

export const getContinentForCountry = (country: string): Continent | undefined => lookup.getContinentForCountry(country)

export const getCountriesForContinent = (continent: Continent): string[] =>
  lookup.getCountriesForContinent(continent)

export const isValidCountry = (value: string): boolean => lookup.isValidCountry(value)
