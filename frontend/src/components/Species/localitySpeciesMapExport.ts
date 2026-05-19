import type { Locality, LocalityDetailsType, LocalitySpecies, SpeciesLocality } from '@/shared/types'

type SpeciesSource = {
  species_id?: number | null
  genus_name?: string | null
  species_name?: string | null
  unique_identifier?: string | null
}

export type MapExportLocality = Locality & {
  species?: string[]
}

type MapExportLocalitySource = {
  lid?: unknown
  loc_name?: unknown
  country?: unknown
  dms_lat?: unknown
  dms_long?: unknown
  dec_lat?: unknown
  dec_long?: unknown
  max_age?: unknown
  min_age?: unknown
  bfa_max?: unknown
  bfa_min?: unknown
  altitude?: unknown
  appr_num_spm?: unknown
  species?: string[]
}

const toFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const asNumber = Number(value)
  return Number.isFinite(asNumber) ? asNumber : null
}

const toStringValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return `${value}`
  return ''
}

const toNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return `${value}`
  return null
}

const formatSpeciesName = (species: SpeciesSource): string | null => {
  const genusSpecies = [species.genus_name, species.species_name].filter(Boolean).join(' ').trim()
  const uniqueIdentifier = species.unique_identifier?.trim()
  const name =
    uniqueIdentifier && uniqueIdentifier !== '-' ? `${genusSpecies} ${uniqueIdentifier}`.trim() : genusSpecies

  if (name) return name
  return species.species_id === null || species.species_id === undefined ? null : `species_id ${species.species_id}`
}

const addSpecies = (locality: MapExportLocality, species: SpeciesSource | null) => {
  const speciesName = species ? formatSpeciesName(species) : null
  if (!speciesName) return

  locality.species ??= []
  if (!locality.species.includes(speciesName)) {
    locality.species.push(speciesName)
  }
}

export const toMapExportLocality = (locality: MapExportLocalitySource | null | undefined): MapExportLocality | null => {
  if (!locality) return null

  const decLat = toFiniteNumber(locality.dec_lat)
  const decLong = toFiniteNumber(locality.dec_long)
  if (decLat === null || decLong === null) return null

  return {
    ...locality,
    lid: Number(locality.lid),
    loc_name: toStringValue(locality.loc_name),
    country: toStringValue(locality.country),
    dms_lat: toStringValue(locality.dms_lat),
    dms_long: toStringValue(locality.dms_long),
    dec_lat: decLat,
    dec_long: decLong,
    bfa_max: toNullableString(locality.bfa_max),
    bfa_min: toNullableString(locality.bfa_min),
    max_age: toFiniteNumber(locality.max_age) ?? 0,
    min_age: toFiniteNumber(locality.min_age) ?? 0,
    altitude: toFiniteNumber(locality.altitude) ?? 0,
    appr_num_spm: toFiniteNumber(locality.appr_num_spm) ?? 0,
  } as unknown as MapExportLocality
}

export const getUniqueSpeciesLocalityMapExportLocalities = (rows: SpeciesLocality[]): MapExportLocality[] => {
  const localitiesById = new Map<number, MapExportLocality>()

  rows.forEach(row => {
    const locality = toMapExportLocality({ ...row.now_loc, lid: row.now_loc?.lid ?? row.lid })
    if (locality) {
      const exportLocality = localitiesById.get(locality.lid) ?? locality
      addSpecies(exportLocality, row)
      localitiesById.set(locality.lid, exportLocality)
    }
  })

  return [...localitiesById.values()]
}

export const getUniqueOccurrenceMapExportLocalities = (
  locality: LocalityDetailsType,
  rows: LocalitySpecies[]
): MapExportLocality[] => {
  const exportLocality = toMapExportLocality(locality)
  if (!exportLocality) return []

  rows.forEach(row => {
    addSpecies(exportLocality, row.com_species)
  })

  return [exportLocality]
}
