import type { Locality, SpeciesLocality } from '@/shared/types'

const toFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const asNumber = Number(value)
  return Number.isFinite(asNumber) ? asNumber : null
}

export const toMapExportLocality = (row: SpeciesLocality): Locality | null => {
  const locality = row.now_loc
  if (!locality) return null

  const decLat = toFiniteNumber(locality.dec_lat)
  const decLong = toFiniteNumber(locality.dec_long)
  if (decLat === null || decLong === null) return null

  return {
    ...locality,
    lid: Number(locality.lid ?? row.lid),
    loc_name: locality.loc_name ?? '',
    country: locality.country ?? '',
    dms_lat: locality.dms_lat ?? '',
    dms_long: locality.dms_long ?? '',
    dec_lat: decLat,
    dec_long: decLong,
    max_age: toFiniteNumber(locality.max_age) ?? 0,
    min_age: toFiniteNumber(locality.min_age) ?? 0,
    altitude: toFiniteNumber(locality.altitude) ?? 0,
    appr_num_spm: toFiniteNumber(locality.appr_num_spm) ?? 0,
  } as unknown as Locality
}

export const getUniqueMapExportLocalities = (rows: SpeciesLocality[]): Locality[] => {
  const localitiesById = new Map<number, Locality>()

  rows.forEach(row => {
    const locality = toMapExportLocality(row)
    if (locality && !localitiesById.has(locality.lid)) {
      localitiesById.set(locality.lid, locality)
    }
  })

  return [...localitiesById.values()]
}
