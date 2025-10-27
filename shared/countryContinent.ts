export type Continent = 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'South America'

export interface CountryContinentEntry {
  country: string
  continent: Continent
}

export const CONTINENT_VALUES: readonly Continent[] = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
] as const

export const isContinent = (value: string): value is Continent =>
  (CONTINENT_VALUES as readonly string[]).includes(value)

export const normalizeCountryContinentEntry = (entry: unknown, index: number): CountryContinentEntry => {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Invalid country-continent entry at index ${index}`)
  }

  const { country, continent } = entry as {
    country?: unknown
    continent?: unknown
  }

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

export const normalizeCountryContinentData = (data: unknown): readonly CountryContinentEntry[] => {
  if (!Array.isArray(data)) {
    throw new Error('Country-continent mapping must be an array')
  }

  const entries = data.map((entry, index) => normalizeCountryContinentEntry(entry, index))

  return Object.freeze(entries.slice()) as readonly CountryContinentEntry[]
}

export interface CountryContinentLookup {
  readonly entries: readonly CountryContinentEntry[]
  readonly validCountries: readonly string[]
  readonly availableContinents: readonly Continent[]
  getContinentForCountry: (country: string) => Continent | undefined
  getCountriesForContinent: (continent: Continent) => readonly string[]
  isValidCountry: (value: string) => boolean
}

const EMPTY_COUNTRIES: readonly string[] = Object.freeze([] as const)

export const createCountryContinentLookup = (entries: readonly CountryContinentEntry[]): CountryContinentLookup => {
  const countryToContinent = new Map<string, Continent>()
  const continentToCountriesMutable = new Map<Continent, string[]>()

  entries.forEach(entry => {
    if (countryToContinent.has(entry.country)) {
      throw new Error(`Duplicate country entry detected: ${entry.country}`)
    }

    countryToContinent.set(entry.country, entry.continent)

    const countries = continentToCountriesMutable.get(entry.continent)

    if (countries) {
      countries.push(entry.country)
    } else {
      continentToCountriesMutable.set(entry.continent, [entry.country])
    }
  })

  const entriesList = Object.freeze([...entries]) as readonly CountryContinentEntry[]

  const continentToCountries = new Map<Continent, readonly string[]>()

  for (const [continent, countries] of continentToCountriesMutable) {
    continentToCountries.set(continent, Object.freeze([...countries]) as readonly string[])
  }

  const availableContinents = Object.freeze(
    CONTINENT_VALUES.filter(continent => continentToCountries.has(continent))
  ) as readonly Continent[]

  const validCountries = Object.freeze(entriesList.map(entry => entry.country)) as readonly string[]

  return {
    entries: entriesList,
    validCountries,
    availableContinents,
    getContinentForCountry: (country: string) => countryToContinent.get(country),
    getCountriesForContinent: (continent: Continent) => continentToCountries.get(continent) ?? EMPTY_COUNTRIES,
    isValidCountry: (value: string) => countryToContinent.has(value),
  }
}
