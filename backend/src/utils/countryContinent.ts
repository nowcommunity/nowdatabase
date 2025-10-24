import fs from 'node:fs'
import path from 'node:path'

export type CountryContinentEntry = {
  country: string
  continent: string
}

type CountryContinentIndex = {
  continentToCountries: Map<string, string[]>
  countryToContinent: Map<string, string>
  continentDisplayNames: Map<string, string>
  countryDisplayNames: Map<string, string>
}

const DEFAULT_MAP_PATH = path.resolve(process.cwd(), 'data', 'countryContinentMap.json')

export const COUNTRY_CONTINENT_MAP_PATH = process.env.COUNTRY_CONTINENT_MAP_PATH ?? DEFAULT_MAP_PATH

let cachedIndex: CountryContinentIndex | null = null

const removeDiacritics = (value: string): string => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

const normaliseKey = (value: string): string => removeDiacritics(value).replace(/\s+/g, ' ').trim().toLowerCase()

const ensureIndex = (): CountryContinentIndex => {
  if (cachedIndex) {
    return cachedIndex
  }

  if (!fs.existsSync(COUNTRY_CONTINENT_MAP_PATH)) {
    throw new Error(`Country/continent mapping file not found at ${COUNTRY_CONTINENT_MAP_PATH}`)
  }

  const rawContent = fs.readFileSync(COUNTRY_CONTINENT_MAP_PATH, 'utf-8')

  let parsed: unknown
  try {
    parsed = JSON.parse(rawContent)
  } catch (error) {
    throw new Error(`Country/continent mapping file is not valid JSON: ${(error as Error).message}`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Country/continent mapping file must contain an array of entries')
  }

  const continentToCountries = new Map<string, Set<string>>()
  const countryToContinent = new Map<string, string>()
  const continentDisplayNames = new Map<string, string>()
  const countryDisplayNames = new Map<string, string>()

  for (const entry of parsed) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('Country/continent mapping entries must be objects')
    }

    const { country, continent } = entry as Partial<CountryContinentEntry>

    if (!country || typeof country !== 'string') {
      throw new Error('Country/continent mapping entries must include a country string')
    }

    if (!continent || typeof continent !== 'string') {
      throw new Error('Country/continent mapping entries must include a continent string')
    }

    const countryKey = normaliseKey(country)
    const continentKey = normaliseKey(continent)

    const existingContinent = countryToContinent.get(countryKey)
    if (existingContinent && existingContinent !== continent) {
      throw new Error(
        `Country '${country}' is mapped to multiple continents: '${existingContinent}' and '${continent}'`
      )
    }

    countryToContinent.set(countryKey, continent)
    countryDisplayNames.set(countryKey, country)

    if (!continentToCountries.has(continentKey)) {
      continentToCountries.set(continentKey, new Set<string>())
      continentDisplayNames.set(continentKey, continent)
    }

    continentToCountries.get(continentKey)!.add(country)
  }

  const normalisedContinentToCountries = new Map<string, string[]>()
  for (const [continentKey, countries] of continentToCountries.entries()) {
    const sortedCountries = Array.from(countries.values()).sort((a, b) => a.localeCompare(b))
    normalisedContinentToCountries.set(continentKey, sortedCountries)
  }

  cachedIndex = {
    continentToCountries: normalisedContinentToCountries,
    countryToContinent,
    continentDisplayNames,
    countryDisplayNames,
  }

  return cachedIndex
}

export const resetCountryContinentCache = (): void => {
  cachedIndex = null
}

export const getCountriesByContinent = (continent: string): string[] => {
  if (!continent.trim()) {
    return []
  }

  const index = ensureIndex()
  const continentKey = normaliseKey(continent)
  const countries = index.continentToCountries.get(continentKey)
  if (!countries) {
    return []
  }

  return [...countries]
}

export const getContinentByCountry = (country: string): string | null => {
  if (!country.trim()) {
    return null
  }

  const index = ensureIndex()
  const countryKey = normaliseKey(country)
  const continent = index.countryToContinent.get(countryKey)
  return continent ?? null
}

export const resolveCountries = (term: string): string[] => {
  if (!term.trim()) {
    return []
  }

  const index = ensureIndex()
  const normalisedTerm = normaliseKey(term)

  const continentMatches = index.continentToCountries.get(normalisedTerm)
  if (continentMatches) {
    return [...continentMatches]
  }

  const countryMatch = index.countryDisplayNames.get(normalisedTerm)
  if (countryMatch) {
    return [countryMatch]
  }

  return []
}

export const getSupportedContinents = (): string[] => {
  const index = ensureIndex()
  return Array.from(index.continentToCountries.keys())
    .map(continentKey => index.continentDisplayNames.get(continentKey) ?? continentKey)
    .sort((a, b) => a.localeCompare(b))
}

export const getSupportedCountries = (): string[] => {
  const index = ensureIndex()
  return Array.from(index.countryDisplayNames.values()).sort((a, b) => a.localeCompare(b))
}
