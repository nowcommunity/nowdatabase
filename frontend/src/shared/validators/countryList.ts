import countryContinentJson from '../data/countryContinentMap.json'

export type Continent = 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'South America'

export interface CountryContinentEntry {
  country: string
  continent: Continent
}

const CONTINENT_VALUES: readonly Continent[] = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
]

const isContinent = (value: string): value is Continent => (CONTINENT_VALUES as readonly string[]).includes(value)

const normalizeEntry = (entry: unknown, index: number): CountryContinentEntry => {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Invalid country-continent entry at index ${index}`)
  }

  const { country, continent } = entry as { country?: unknown; continent?: unknown }

  if (typeof country !== 'string' || country.trim().length === 0) {
    throw new Error(`country is missing for mapping entry at index ${index}`)
  }

  if (typeof continent !== 'string' || continent.trim().length === 0) {
    throw new Error(`continent is missing for mapping entry at index ${index}`)
  }

  if (!isContinent(continent)) {
    throw new Error(`Unknown continent "${continent}" on mapping entry at index ${index}`)
  }

  return { country, continent }
}

const countryContinentEntriesInternal = (countryContinentJson as unknown[]).map(normalizeEntry)

const countryToContinent = new Map<string, Continent>()
const continentToCountries = new Map<Continent, string[]>()

for (const entry of countryContinentEntriesInternal) {
  if (countryToContinent.has(entry.country)) {
    throw new Error(`Duplicate country entry detected: ${entry.country}`)
  }

  countryToContinent.set(entry.country, entry.continent)
  const countries = continentToCountries.get(entry.continent)

  if (countries) {
    countries.push(entry.country)
  } else {
    continentToCountries.set(entry.continent, [entry.country])
  }
}

export const countryContinentEntries: readonly CountryContinentEntry[] = countryContinentEntriesInternal

export const validCountries: readonly string[] = countryContinentEntries.map(entry => entry.country)

export const availableContinents: readonly Continent[] = CONTINENT_VALUES.filter(continent =>
  continentToCountries.has(continent)
)

export const getContinentForCountry = (country: string): Continent | undefined => countryToContinent.get(country)

export const getCountriesForContinent = (continent: Continent): string[] => [
  ...(continentToCountries.get(continent) ?? []),
]

export const isValidCountry = (value: string): boolean => countryToContinent.has(value)
