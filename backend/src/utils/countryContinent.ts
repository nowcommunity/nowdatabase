import countryContinentJson from '../../../data/countryContinentMap.json'
import {
  Continent,
  CountryContinentEntry,
  createCountryContinentLookup,
  normalizeCountryContinentData,
} from '../../../shared/countryContinent'

const entries = normalizeCountryContinentData(countryContinentJson)
const lookup = createCountryContinentLookup(entries)

export type { Continent, CountryContinentEntry }

export const getCountryContinentEntries = (): readonly CountryContinentEntry[] => lookup.entries

export const getContinentForCountry = (country: string): Continent | undefined => lookup.getContinentForCountry(country)

export const getCountriesForContinent = (continent: Continent): string[] =>
  lookup.getCountriesForContinent(continent)

export const getAvailableContinents = (): readonly Continent[] => lookup.availableContinents

export const isValidCountry = (value: string): boolean => lookup.isValidCountry(value)
