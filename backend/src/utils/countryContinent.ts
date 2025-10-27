export type Continent = 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'South America'

export interface CountryContinentEntry {
  country: string
  continent: Continent
}

type CountryContinentJsonEntry = {
  country: string
  continent: string
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

// eslint-disable-next-line @typescript-eslint/no-var-requires -- JSON import via require for CommonJS compatibility
const countryContinentJson = require('../../../data/countryContinentMap.json') as CountryContinentJsonEntry[]

const countryContinentEntries: readonly CountryContinentEntry[] = countryContinentJson.map((entry, index) => {
  const { country, continent } = entry

  if (!country || typeof country !== 'string') {
    throw new Error(`country is missing for mapping row ${index + 1}`)
  }

  if (!continent || typeof continent !== 'string') {
    throw new Error(`continent is missing for mapping row ${index + 1}`)
  }

  if (!isContinent(continent)) {
    throw new Error(`Unknown continent "${continent}" on mapping row ${index + 1}`)
  }

  return { country, continent }
})

const countryToContinent = new Map<string, Continent>()
const continentToCountries = new Map<Continent, string[]>()

for (const entry of countryContinentEntries) {
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

const availableContinentList: readonly Continent[] = CONTINENT_VALUES.filter(continent =>
  continentToCountries.has(continent)
)

export const getCountryContinentEntries = (): readonly CountryContinentEntry[] => countryContinentEntries

export const getContinentForCountry = (country: string): Continent | undefined => countryToContinent.get(country)

export const getCountriesForContinent = (continent: Continent): string[] => [
  ...(continentToCountries.get(continent) ?? []),
]

export const getAvailableContinents = (): readonly Continent[] => availableContinentList

export const isValidCountry = (value: string): boolean => countryToContinent.has(value)
