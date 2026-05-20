import type { CrossSearch, Locality, LocalityDetailsType, LocalitySpecies, SpeciesLocality } from '@/shared/types'
import { generateKml } from '@/util/kml'
import { currentDateAsString } from '@/shared/currentDateAsString'
import type { MRT_RowData, MRT_TableInstance } from 'material-react-table'

type SpeciesSource = {
  species_id?: number | null
  genus_name?: string | null
  species_name?: string | null
  unique_identifier?: string | null
}

export type MapExportLocality = Locality & {
  species?: string[]
}

type OccurrenceMapExportRow = {
  locality: MapExportLocalitySource | null | undefined
  species: SpeciesSource | null
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

const getUniqueOccurrenceMapExportLocalities = (rows: OccurrenceMapExportRow[]): MapExportLocality[] => {
  const localitiesById = new Map<number, MapExportLocality>()

  rows.forEach(row => {
    const locality = toMapExportLocality(row.locality)
    if (!locality) return

    const exportLocality = localitiesById.get(locality.lid) ?? locality
    addSpecies(exportLocality, row.species)
    localitiesById.set(locality.lid, exportLocality)
  })

  return [...localitiesById.values()]
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

export const getUniqueSpeciesLocalityMapExportLocalities = (
  species: SpeciesSource,
  rows: SpeciesLocality[]
): MapExportLocality[] =>
  getUniqueOccurrenceMapExportLocalities(
    rows.map(row => ({
      locality: { ...row.now_loc, lid: row.now_loc?.lid ?? row.lid },
      species,
    }))
  )

export const getUniqueLocalityOccurrenceMapExportLocalities = (
  locality: LocalityDetailsType,
  rows: LocalitySpecies[]
): MapExportLocality[] =>
  getUniqueOccurrenceMapExportLocalities(rows.map(row => ({ locality, species: row.com_species })))

export const getUniqueCrossSearchMapExportLocalities = (rows: CrossSearch[]): MapExportLocality[] =>
  getUniqueOccurrenceMapExportLocalities(
    rows.map(row => ({
      locality: {
        lid: row.lid_now_loc,
        loc_name: row.loc_name,
        country: row.country,
        dms_lat: row.dms_lat,
        dms_long: row.dms_long,
        dec_lat: row.dec_lat,
        dec_long: row.dec_long,
        bfa_max: row.bfa_max,
        bfa_min: row.bfa_min,
        max_age: row.max_age,
        min_age: row.min_age,
        altitude: row.altitude,
        appr_num_spm: row.appr_num_spm,
      },
      species: {
        species_id: row.species_id_com_species,
        genus_name: row.genus_name,
        species_name: row.species_name,
        unique_identifier: row.unique_identifier,
      },
    }))
  )

const downloadTextFile = (dataString: string, type: string, filename: string) => {
  const blob = new Blob([dataString], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export const exportOccurrenceMapKml = <T extends MRT_RowData>(
  table: MRT_TableInstance<T>,
  filenamePrefix: string,
  getLocalities: (table: MRT_TableInstance<T>) => MapExportLocality[]
) => {
  downloadTextFile(generateKml(getLocalities(table)), 'text/kml', `${filenamePrefix}-${currentDateAsString()}.kml`)
}

export const exportOccurrenceMapSvg = async <T extends MRT_RowData>(
  table: MRT_TableInstance<T>,
  filenamePrefix: string,
  getLocalities: (table: MRT_TableInstance<T>) => MapExportLocality[]
) => {
  const { generateSvg } = await import('@/components/Map/generateSvg')
  downloadTextFile(generateSvg(getLocalities(table)), 'image/svg+xml', `${filenamePrefix}-${currentDateAsString()}.svg`)
}
