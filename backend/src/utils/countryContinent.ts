import { readFileSync } from 'fs'
import path from 'path'

export type Continent =
  | 'Africa'
  | 'Antarctica'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'Oceania'
  | 'South America'

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

const CSV_PATH = path.resolve(
  __dirname,
  '../../..',
  'data',
  'countryContinentMap.csv',
)

const isContinent = (value: string): value is Continent =>
  (CONTINENT_VALUES as readonly string[]).includes(value)

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

const parseCountryContinentCsv = (csv: string): CountryContinentEntry[] => {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length <= 1) {
    throw new Error('countryContinentMap.csv must include at least one row')
  }

  const [header, ...rows] = lines
  const [countryHeader, continentHeader] = parseCsvLine(header)

  if (
    countryHeader.toLowerCase() !== 'country' ||
    continentHeader.toLowerCase() !== 'continent'
  ) {
    throw new Error('countryContinentMap.csv must have "country" and "continent" headers')
  }

  return rows.map((line, rowIndex) => {
    const [country, continent] = parseCsvLine(line)

    if (!country) {
      throw new Error(`country is missing for CSV row ${rowIndex + 2}`)
    }

    if (!isContinent(continent)) {
      throw new Error(`Unknown continent "${continent}" on CSV row ${rowIndex + 2}`)
    }

    return { country, continent }
  })
}

const loadCountryContinentEntries = (): readonly CountryContinentEntry[] => {
  const csvContent = readFileSync(CSV_PATH, 'utf8')
  return parseCountryContinentCsv(csvContent)
}

const countryContinentEntries = loadCountryContinentEntries()

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

const availableContinentList: readonly Continent[] = CONTINENT_VALUES.filter(
  (continent) => continentToCountries.has(continent),
)

export const getCountryContinentEntries = (): readonly CountryContinentEntry[] =>
  countryContinentEntries

export const getContinentForCountry = (
  country: string,
): Continent | undefined => countryToContinent.get(country)

export const getCountriesForContinent = (
  continent: Continent,
): string[] => [...(continentToCountries.get(continent) ?? [])]

export const getAvailableContinents = (): readonly Continent[] =>
  availableContinentList

export const isValidCountry = (value: string): boolean =>
  countryToContinent.has(value)
