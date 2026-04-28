import type { now_loc, now_time_unit } from '../../prisma/generated/now_test_client'
import { format } from 'fast-csv'
import { Writable } from 'stream'
import JSZip from 'jszip'
import { getContinentByCountry } from '../../../frontend/src/shared/validators/countryContinents'

const isMeaningfulString = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed === '-') return false
  return true
}

const toDwcString = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'number') return Number.isFinite(value) ? value.toString() : ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (value instanceof Date) return value.toISOString()
    if (typeof (value as { toString?: unknown }).toString === 'function') {
      const asString = (value as { toString: () => string }).toString()
      if (asString && asString !== '[object Object]') return asString
    }
    try {
      return JSON.stringify(value) ?? ''
    } catch {
      return ''
    }
  }
  return ''
}

const writeCsvString = async (headers: string[], rows: Array<Record<string, unknown>>): Promise<string> => {
  return await new Promise((resolve, reject) => {
    let output = ''
    const csvStream = format({
      delimiter: ',',
      headers,
      quoteColumns: true,
      quoteHeaders: true,
      includeEndRowDelimiter: true,
    })

    const sink = new Writable({
      write(chunk: Buffer | string, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        if (typeof chunk === 'string') {
          output += chunk
        } else {
          output += chunk.toString('utf8')
        }
        callback()
      },
    })

    sink.on('finish', () => resolve(output))
    sink.on('error', reject)
    csvStream.on('error', reject)

    csvStream.pipe(sink)
    for (const row of rows) {
      csvStream.write(row)
    }
    csvStream.end()
  })
}

export const LOCATION_HEADERS = [
  'locationID',
  'locality',
  'continent',
  'country',
  'stateProvince',
  'county',
  'higherGeography',
  'decimalLatitude',
  'decimalLongitude',
  'verbatimLatitude',
  'verbatimLongitude',
  'verbatimElevation',
  'locationRemarks',
] as const

export type LocationCsvHeader = (typeof LOCATION_HEADERS)[number]
export type LocationCsvRow = Record<LocationCsvHeader, string>

export const GEOLOGICAL_CONTEXT_HEADERS = [
  'locationID',
  'geologicalContextID',
  'lithostratigraphicTerms',
  'group',
  'formation',
  'member',
  'bed',
  'earliestAgeOrLowestStage',
  'latestAgeOrHighestStage',
] as const

export type GeologicalContextCsvHeader = (typeof GEOLOGICAL_CONTEXT_HEADERS)[number]
export type GeologicalContextCsvRow = Record<GeologicalContextCsvHeader, string>

export const LOCALITY_MEASUREMENT_HEADERS = [
  'taxonID',
  'measurementID',
  'parentMeasurementID',
  'measurementType',
  'verbatimMeasurementType',
  'measurementValue',
  'measurementUnit',
  'measurementMethod',
] as const

export type LocalityMeasurementCsvHeader = (typeof LOCALITY_MEASUREMENT_HEADERS)[number]
export type LocalityMeasurementCsvRow = Record<LocalityMeasurementCsvHeader, string>

type TimeUnitForLocalityExport = Pick<now_time_unit, 'tu_name' | 'tu_display_name' | 'rank' | 'sequence'>

type LocalityForExport = Pick<
  now_loc,
  | 'lid'
  | 'loc_name'
  | 'basin'
  | 'subbasin'
  | 'country'
  | 'state'
  | 'county'
  | 'dec_lat'
  | 'dec_long'
  | 'dms_lat'
  | 'dms_long'
  | 'approx_coord'
  | 'altitude'
  | 'loc_detail'
  | 'chron'
  | 'lgroup'
  | 'formation'
  | 'member'
  | 'bed'
  | 'bfa_max'
  | 'bfa_min'
  | 'bfa_max_abs'
  | 'bfa_min_abs'
  | 'frac_max'
  | 'frac_min'
  | 'max_age'
  | 'min_age'
  | 'date_meth'
  | 'age_comm'
  | 'site_area'
  | 'gen_loc'
  | 'plate'
  | 'appr_num_spm'
  | 'num_spm'
  | 'true_quant'
  | 'complete'
  | 'num_quad'
  | 'rock_type'
  | 'rt_adj'
  | 'lith_comm'
  | 'depo_context1'
  | 'depo_context2'
  | 'depo_context3'
  | 'depo_context4'
  | 'depo_comm'
  | 'sed_env_1'
  | 'sed_env_2'
  | 'event_circum'
  | 'se_comm'
  | 'assem_fm'
  | 'transport'
  | 'trans_mod'
  | 'weath_trmp'
  | 'pt_conc'
  | 'size_type'
  | 'vert_pres'
  | 'plant_pres'
  | 'invert_pres'
  | 'time_rep'
  | 'taph_comm'
  | 'tax_comm'
  | 'datum_plane'
  | 'tos'
  | 'bos'
  | 'loc_status'
  | 'hominin_skeletal_remains'
  | 'climate_type'
  | 'biome'
  | 'v_ht'
  | 'v_struct'
  | 'v_envi_det'
  | 'disturb'
  | 'nutrients'
  | 'water'
  | 'seasonality'
  | 'seas_intens'
  | 'pri_prod'
  | 'moisture'
  | 'temperature'
  | 'estimate_precip'
  | 'estimate_temp'
  | 'estimate_npp'
  | 'pers_woody_cover'
  | 'pers_pollen_ap'
  | 'pers_pollen_nap'
  | 'pers_pollen_other'
  | 'stone_tool_cut_marks_on_bones'
  | 'bipedal_footprints'
  | 'stone_tool_technology'
  | 'technological_mode_1'
  | 'technological_mode_2'
  | 'technological_mode_3'
  | 'cultural_stage_1'
  | 'cultural_stage_2'
  | 'cultural_stage_3'
  | 'regional_culture_1'
  | 'regional_culture_2'
  | 'regional_culture_3'
> & {
  now_time_unit_now_loc_bfa_maxTonow_time_unit: TimeUnitForLocalityExport | null
  now_time_unit_now_loc_bfa_minTonow_time_unit: TimeUnitForLocalityExport | null
  now_syn_loc: ReadonlyArray<{ synonym: string | null }>
  now_ss: ReadonlyArray<{ sed_struct: string }>
  now_coll_meth: ReadonlyArray<{ coll_meth: string }>
  now_mus: ReadonlyArray<{
    museum: string
    com_mlist: {
      institution: string
      alt_int_name: string | null
      city: string | null
      state: string | null
      country: string | null
    }
  }>
  now_plr: ReadonlyArray<{
    now_proj: {
      proj_code: string | null
      proj_name: string | null
      proj_status: string | null
    }
  }>
  now_lau: ReadonlyArray<{
    lau_date: Date | null
    lau_comment: string | null
    com_people_now_lau_lau_coordinatorTocom_people: { full_name: string }
    com_people_now_lau_lau_authorizerTocom_people: { full_name: string }
  }>
  now_ls: ReadonlyArray<{
    com_species: {
      order_name: string
      tht: string | null
      genus_name: string | null
    }
  }>
}

const locationIdForLocality = (lid: number): string => `NOW:LOC:${lid}`

const toMaybeMeaningful = (value: string | null | undefined): string => (isMeaningfulString(value) ? value.trim() : '')

const toMaybeMeaningfulNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  if (!Number.isFinite(value)) return ''
  // In NOW, many numeric fields default to 0 for "unknown". Treat 0 as empty for export.
  if (value === 0) return ''
  return value.toString()
}

export const mapLocalityToLocationRow = (locality: LocalityForExport): LocationCsvRow => {
  const locationID = locationIdForLocality(locality.lid)
  const continent = getContinentByCountry(locality.country) ?? ''

  const higherGeography = [
    continent,
    toMaybeMeaningful(locality.country),
    toMaybeMeaningful(locality.state),
    toMaybeMeaningful(locality.county),
    toMaybeMeaningful(locality.basin),
    toMaybeMeaningful(locality.subbasin),
  ]
    .filter(Boolean)
    .join('|')

  return {
    locationID,
    locality: toMaybeMeaningful(locality.loc_name),
    continent,
    country: toMaybeMeaningful(locality.country),
    stateProvince: toMaybeMeaningful(locality.state),
    county: toMaybeMeaningful(locality.county),
    higherGeography,
    decimalLatitude: toMaybeMeaningfulNumber(locality.dec_lat),
    decimalLongitude: toMaybeMeaningfulNumber(locality.dec_long),
    verbatimLatitude: toMaybeMeaningful(locality.dms_lat),
    verbatimLongitude: toMaybeMeaningful(locality.dms_long),
    verbatimElevation: locality.altitude === null || locality.altitude === undefined ? '' : String(locality.altitude),
    locationRemarks: [
      toMaybeMeaningful(locality.loc_detail),
      toMaybeMeaningful(locality.age_comm),
      toMaybeMeaningful(locality.tax_comm),
    ]
      .filter(Boolean)
      .join(' | '),
  }
}

const timeUnitDisplayOrName = (timeUnit: TimeUnitForLocalityExport | null, fallbackName: string | null): string => {
  if (timeUnit) {
    return isMeaningfulString(timeUnit.tu_display_name) ? timeUnit.tu_display_name.trim() : timeUnit.tu_name.trim()
  }
  return isMeaningfulString(fallbackName) ? fallbackName.trim() : ''
}

export const mapLocalityToGeologicalContextRow = (locality: LocalityForExport): GeologicalContextCsvRow => {
  const locationID = locationIdForLocality(locality.lid)

  const lithostratigraphicTerms = [
    toMaybeMeaningful(locality.chron),
    toMaybeMeaningful(locality.lgroup),
    toMaybeMeaningful(locality.formation),
    toMaybeMeaningful(locality.member),
    toMaybeMeaningful(locality.bed),
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    locationID,
    geologicalContextID: `NOW:LOC:${locality.lid}:geology`,
    lithostratigraphicTerms,
    group: toMaybeMeaningful(locality.lgroup),
    formation: toMaybeMeaningful(locality.formation),
    member: toMaybeMeaningful(locality.member),
    bed: toMaybeMeaningful(locality.bed),
    earliestAgeOrLowestStage: timeUnitDisplayOrName(
      locality.now_time_unit_now_loc_bfa_maxTonow_time_unit,
      locality.bfa_max
    ),
    latestAgeOrHighestStage: timeUnitDisplayOrName(
      locality.now_time_unit_now_loc_bfa_minTonow_time_unit,
      locality.bfa_min
    ),
  }
}

const isMeaningfulMeasurementValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return isMeaningfulString(value)
  if (typeof value === 'number') return Number.isFinite(value) && value !== 0
  if (typeof value === 'boolean') return value
  return true
}

const buildLocalityMeasurementId = (lid: number, kind: string): string => `NOW:LOC:${lid}:${kind}`

const formatAgeRange = (locality: LocalityForExport): string => {
  const minAge = toMaybeMeaningfulNumber(locality.min_age)
  const maxAge = toMaybeMeaningfulNumber(locality.max_age)
  if (minAge && maxAge) return `${minAge}-${maxAge}`
  if (minAge) return minAge
  if (maxAge) return maxAge
  return ''
}

const calculateMeanHypsodontyForExport = (locality: Pick<LocalityForExport, 'now_ls'>): number => {
  const relevantOrderNames = [
    'Perissodactyla',
    'Artiodactyla',
    'Primates',
    'Proboscidea',
    'Hyracoidea',
    'Dinocerata',
    'Embrithopoda',
    'Notoungulata',
    'Astrapotheria',
    'Pyrotheria',
    'Litopterna',
    'Condylarthra',
    'Pantodonta',
  ]

  const thtToValue = {
    bra: 1.0,
    mes: 2.0,
    hyp: 3.0,
    hys: 3.0,
    none: 0.0,
  } as Record<string, number>

  const values = locality.now_ls
    .map(row => row.com_species)
    .filter(species => relevantOrderNames.includes(species.order_name))
    .map(species => thtToValue[species.tht ?? 'none'])

  const sum = values.reduce((acc, cur) => acc + cur, 0.0)
  const mean = values.length > 0 ? sum / values.length : 0.0
  return parseFloat((Math.floor(mean * 100) / 100).toFixed(2))
}

const hasHomininSkeletalRemainsForExport = (locality: Pick<LocalityForExport, 'now_ls'>): boolean => {
  const hominins = [
    'sahelanthropus',
    'orrorin',
    'ardipithecus',
    'kenyanthropus',
    'australopithecus',
    'paranthropus',
    'homo',
  ]

  return locality.now_ls.some(({ com_species }) => {
    const genusName = com_species.genus_name
    if (!genusName) return false
    return hominins.includes(genusName.toLowerCase())
  })
}

const isNumberMeaningful = (value: number | null | undefined, { allowZero }: { allowZero: boolean }): boolean => {
  if (value === null || value === undefined) return false
  if (!Number.isFinite(value)) return false
  if (!allowZero && value === 0) return false
  return true
}

const toMaybeMeaningfulNumberWithZeroOption = (
  value: number | null | undefined,
  { allowZero }: { allowZero: boolean }
): string => {
  if (!isNumberMeaningful(value, { allowZero })) return ''
  return value!.toString()
}

const LOCALITY_MEASUREMENT_MAPPINGS: Array<{
  field: keyof LocalityForExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
  allowZero?: boolean
}> = [
  {
    field: 'bfa_max',
    measurementType: 'Basis for age (Time Unit)',
    measurementUnit: '',
    // TODO(#1150): Add authoritative definition for NOW locality basis-for-age fields.
    measurementMethod: '',
  },
  {
    field: 'bfa_min',
    measurementType: 'Basis for age (Time Unit)',
    measurementUnit: '',
    // TODO(#1150): Add authoritative definition for NOW locality basis-for-age fields.
    measurementMethod: '',
  },
  {
    field: 'bfa_max_abs',
    measurementType: 'Basis for age (Absolute)',
    measurementUnit: '',
    // TODO(#1150): Add authoritative definition for NOW locality basis-for-age fields.
    measurementMethod: '',
  },
  {
    field: 'bfa_min_abs',
    measurementType: 'Basis for age (Absolute)',
    measurementUnit: '',
    // TODO(#1150): Add authoritative definition for NOW locality basis-for-age fields.
    measurementMethod: '',
  },
  {
    field: 'frac_max',
    measurementType: 'Basis for age (Fraction)',
    measurementUnit: '',
    // TODO(#1150): Add authoritative definition for NOW locality basis-for-age fields.
    measurementMethod: '',
  },
  {
    field: 'frac_min',
    measurementType: 'Basis for age (Fraction)',
    measurementUnit: '',
    // TODO(#1150): Add authoritative definition for NOW locality basis-for-age fields.
    measurementMethod: '',
  },
  {
    field: 'site_area',
    measurementType: 'site area',
    measurementUnit: '',
    // TODO(#1150): Add unit and definition for NOW locality site_area.
    measurementMethod: '',
  },
  {
    field: 'approx_coord',
    measurementType: 'approximate coordinates',
    measurementUnit: '',
    // TODO(#1150): Add definition (what qualifies as approximate).
    measurementMethod: '',
  },
  {
    field: 'gen_loc',
    measurementType: 'general locality',
    measurementUnit: '',
    // TODO(#1150): Add controlled vocabulary / definition.
    measurementMethod: '',
  },
  {
    field: 'plate',
    measurementType: 'tectonic plate',
    measurementUnit: '',
    // TODO(#1150): Add controlled vocabulary / definition.
    measurementMethod: '',
  },
  {
    field: 'appr_num_spm',
    measurementType: 'approximate number of specimens',
    measurementUnit: '',
    // TODO(#1150): Confirm whether this is a sample-unit or locality-level count.
    measurementMethod: '',
  },
  {
    field: 'num_spm',
    measurementType: 'number of specimens',
    measurementUnit: '',
    // TODO(#1150): Confirm whether this is a sample-unit or locality-level count.
    measurementMethod: '',
  },
  {
    field: 'true_quant',
    measurementType: 'true quantification',
    measurementUnit: '',
    // TODO(#1150): Add controlled vocabulary for NOW locality true_quant.
    measurementMethod: '',
  },
  {
    field: 'complete',
    measurementType: 'complete sampling',
    measurementUnit: '',
    // TODO(#1150): Add controlled vocabulary for NOW locality complete.
    measurementMethod: '',
  },
  {
    field: 'num_quad',
    measurementType: 'number of quadrats',
    measurementUnit: '',
    // TODO(#1150): Add definition for NOW locality num_quad.
    measurementMethod: '',
  },
  {
    field: 'date_meth',
    measurementType: 'dating method',
    measurementUnit: '',
    // TODO(#1150): Add controlled vocabulary / description.
    measurementMethod: '',
  },
  {
    field: 'rock_type',
    measurementType: 'rock type',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'rt_adj',
    measurementType: 'rock type adjective',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'lith_comm',
    measurementType: 'lithology comment',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'sed_env_1',
    measurementType: 'sedimentary environment 1',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'sed_env_2',
    measurementType: 'sedimentary environment 2',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'event_circum',
    measurementType: 'event circumstances',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'se_comm',
    measurementType: 'sedimentary environment comment',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'depo_context1',
    measurementType: 'depositional context 1',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'depo_context2',
    measurementType: 'depositional context 2',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'depo_context3',
    measurementType: 'depositional context 3',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'depo_context4',
    measurementType: 'depositional context 4',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'depo_comm',
    measurementType: 'depositional context comment',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'chron',
    measurementType: 'chron',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'loc_status',
    measurementType: 'locality status',
    measurementUnit: '',
    // TODO(#1150): Add definition.
    measurementMethod: '',
  },
  {
    field: 'hominin_skeletal_remains',
    measurementType: 'Hominin skeletal remains (field)',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'assem_fm',
    measurementType: 'Assemblage Formation',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'transport',
    measurementType: 'Transport',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'trans_mod',
    measurementType: 'Abrasion',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'weath_trmp',
    measurementType: 'Weathering / Trampling',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'pt_conc',
    measurementType: 'Part Concentration',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'size_type',
    measurementType: 'Assemblage Component Size',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'time_rep',
    measurementType: 'Time Represented (years)',
    measurementUnit: '',
    // TODO(#1150): Add unit and definition (years bins).
    measurementMethod: '',
  },
  {
    field: 'vert_pres',
    measurementType: 'Vertebrate Preservation',
    measurementUnit: '',
    // TODO(#1150): Add controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'taph_comm',
    measurementType: 'Taphonomy comment',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'climate_type',
    measurementType: 'Climate Type',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'temperature',
    measurementType: 'Temperature',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'moisture',
    measurementType: 'Moisture',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'disturb',
    measurementType: 'Agent(s) of Disturbance',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'v_envi_det',
    measurementType: 'Environment & Vegetation Detail',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'seasonality',
    measurementType: 'Seasonality',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'seas_intens',
    measurementType: 'Seasonality Intensity',
    measurementUnit: '',
    // TODO(#1150): Add unit and definition.
    measurementMethod: '',
  },
  {
    field: 'biome',
    measurementType: 'Biome',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'v_ht',
    measurementType: 'Vegetation Height',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'v_struct',
    measurementType: 'Vegetation Structure',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'pri_prod',
    measurementType: 'Primary Productivity Level',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'nutrients',
    measurementType: 'Nutrient Availability',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'water',
    measurementType: 'Water Availability',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'pers_pollen_ap',
    measurementType: 'Arboreal pollen (AP%)',
    measurementUnit: '%',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'pers_pollen_nap',
    measurementType: 'Non-arboreal pollen (NAP%)',
    measurementUnit: '%',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'pers_pollen_other',
    measurementType: 'Other pollen (OP%)',
    measurementUnit: '%',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'estimate_precip',
    measurementType: 'Estimate of annual precipitation (mm)',
    measurementUnit: 'mm',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'estimate_temp',
    measurementType: 'Estimate of mean annual temperature (°C)',
    measurementUnit: '°C',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'estimate_npp',
    measurementType: 'Estimate of net primary productivity (g/m2/yr)',
    measurementUnit: 'g/m2/yr',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'pers_woody_cover',
    measurementType: 'Woody cover percentage',
    measurementUnit: '%',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'stone_tool_cut_marks_on_bones',
    measurementType: 'Stone tool cut marks on bones',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'bipedal_footprints',
    measurementType: 'Bipedal footprints',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'stone_tool_technology',
    measurementType: 'Stone tool technology',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'technological_mode_1',
    measurementType: 'Technological mode 1',
    measurementUnit: '',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'technological_mode_2',
    measurementType: 'Technological mode 2',
    measurementUnit: '',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'technological_mode_3',
    measurementType: 'Technological mode 3',
    measurementUnit: '',
    measurementMethod: '',
    allowZero: true,
  },
  {
    field: 'cultural_stage_1',
    measurementType: 'Cultural stage 1',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'cultural_stage_2',
    measurementType: 'Cultural stage 2',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'cultural_stage_3',
    measurementType: 'Cultural stage 3',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'regional_culture_1',
    measurementType: 'Regional culture 1',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'regional_culture_2',
    measurementType: 'Regional culture 2',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'regional_culture_3',
    measurementType: 'Regional culture 3',
    measurementUnit: '',
    measurementMethod: '',
  },
]

export const mapLocalityToMeasurementRows = (locality: LocalityForExport): LocalityMeasurementCsvRow[] => {
  const taxonID = locationIdForLocality(locality.lid)
  const lid = locality.lid

  const ageParentId = buildLocalityMeasurementId(lid, 'age')
  const maxAgeId = buildLocalityMeasurementId(lid, 'max_age')
  const minAgeId = buildLocalityMeasurementId(lid, 'min_age')

  const stratigraphyParentId = buildLocalityMeasurementId(lid, 'stratigraphy')
  const tosId = buildLocalityMeasurementId(lid, 'tos')
  const bosId = buildLocalityMeasurementId(lid, 'bos')
  const datumPlaneId = buildLocalityMeasurementId(lid, 'datum_plane')

  const lastUpdateParentId = buildLocalityMeasurementId(lid, 'last_update')

  const hasMaxAgeGroup =
    isMeaningfulMeasurementValue(locality.max_age) ||
    isMeaningfulMeasurementValue(locality.bfa_max) ||
    isMeaningfulMeasurementValue(locality.bfa_max_abs) ||
    isMeaningfulMeasurementValue(locality.frac_max)

  const hasMinAgeGroup =
    isMeaningfulMeasurementValue(locality.min_age) ||
    isMeaningfulMeasurementValue(locality.bfa_min) ||
    isMeaningfulMeasurementValue(locality.bfa_min_abs) ||
    isMeaningfulMeasurementValue(locality.frac_min)

  const hasAnyAgeBasis = hasMaxAgeGroup || hasMinAgeGroup

  const rows: LocalityMeasurementCsvRow[] = []

  const hasAnyStratigraphy =
    isMeaningfulMeasurementValue(locality.datum_plane) ||
    isMeaningfulMeasurementValue(locality.tos) ||
    isMeaningfulMeasurementValue(locality.bos)

  if (hasAnyStratigraphy) {
    rows.push({
      taxonID,
      measurementID: stratigraphyParentId,
      parentMeasurementID: '',
      measurementType: 'stratigraphic section',
      verbatimMeasurementType: 'stratigraphy',
      measurementValue: '',
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  if (isMeaningfulMeasurementValue(locality.datum_plane)) {
    rows.push({
      taxonID,
      measurementID: datumPlaneId,
      parentMeasurementID: hasAnyStratigraphy ? stratigraphyParentId : '',
      measurementType: 'datum plane',
      verbatimMeasurementType: 'datum_plane',
      measurementValue: toMaybeMeaningful(locality.datum_plane),
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  if (typeof locality.tos === 'number') {
    const value = toMaybeMeaningfulNumberWithZeroOption(locality.tos, { allowZero: true })
    if (value) {
      rows.push({
        taxonID,
        measurementID: tosId,
        parentMeasurementID: hasAnyStratigraphy ? stratigraphyParentId : '',
        measurementType: 'top of section',
        verbatimMeasurementType: 'tos',
        measurementValue: value,
        measurementUnit: '',
        // TODO(#1150): Add unit and definition.
        measurementMethod: '',
      })
    }
  }

  if (typeof locality.bos === 'number') {
    const value = toMaybeMeaningfulNumberWithZeroOption(locality.bos, { allowZero: true })
    if (value) {
      rows.push({
        taxonID,
        measurementID: bosId,
        parentMeasurementID: hasAnyStratigraphy ? stratigraphyParentId : '',
        measurementType: 'bottom of section',
        verbatimMeasurementType: 'bos',
        measurementValue: value,
        measurementUnit: '',
        // TODO(#1150): Add unit and definition.
        measurementMethod: '',
      })
    }
  }

  const lastUpdate = locality.now_lau[0]
  if (lastUpdate) {
    rows.push({
      taxonID,
      measurementID: lastUpdateParentId,
      parentMeasurementID: '',
      measurementType: 'last update',
      verbatimMeasurementType: 'now_lau',
      measurementValue: '',
      measurementUnit: '',
      measurementMethod: '',
    })

    if (lastUpdate.lau_date) {
      rows.push({
        taxonID,
        measurementID: buildLocalityMeasurementId(lid, 'last_update_date'),
        parentMeasurementID: lastUpdateParentId,
        measurementType: 'last update date',
        verbatimMeasurementType: 'now_lau.lau_date',
        measurementValue: lastUpdate.lau_date.toISOString().slice(0, 10),
        measurementUnit: '',
        measurementMethod: '',
      })
    }

    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'last_update_coordinator'),
      parentMeasurementID: lastUpdateParentId,
      measurementType: 'last update coordinator',
      verbatimMeasurementType: 'now_lau.lau_coordinator',
      measurementValue: toMaybeMeaningful(lastUpdate.com_people_now_lau_lau_coordinatorTocom_people.full_name),
      measurementUnit: '',
      measurementMethod: '',
    })

    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'last_update_authorizer'),
      parentMeasurementID: lastUpdateParentId,
      measurementType: 'last update authorizer',
      verbatimMeasurementType: 'now_lau.lau_authorizer',
      measurementValue: toMaybeMeaningful(lastUpdate.com_people_now_lau_lau_authorizerTocom_people.full_name),
      measurementUnit: '',
      measurementMethod: '',
    })

    if (isMeaningfulString(lastUpdate.lau_comment)) {
      rows.push({
        taxonID,
        measurementID: buildLocalityMeasurementId(lid, 'last_update_comment'),
        parentMeasurementID: lastUpdateParentId,
        measurementType: 'last update comment',
        verbatimMeasurementType: 'now_lau.lau_comment',
        measurementValue: lastUpdate.lau_comment.trim(),
        measurementUnit: '',
        measurementMethod: '',
      })
    }
  }

  if (hasAnyAgeBasis) {
    rows.push({
      taxonID,
      measurementID: ageParentId,
      parentMeasurementID: '',
      measurementType: 'age range',
      verbatimMeasurementType: 'age_range',
      measurementValue: formatAgeRange(locality),
      measurementUnit: 'Ma',
      // TODO(#1150): Add authoritative definition for NOW locality age range semantics.
      measurementMethod: '',
    })
  }

  if (hasMaxAgeGroup) {
    rows.push({
      taxonID,
      measurementID: maxAgeId,
      parentMeasurementID: hasAnyAgeBasis ? ageParentId : '',
      measurementType: 'maximum age',
      verbatimMeasurementType: 'max_age',
      measurementValue: toMaybeMeaningfulNumber(locality.max_age),
      measurementUnit: 'Ma',
      // TODO(#1150): Add authoritative definition for NOW locality max_age semantics.
      measurementMethod: '',
    })
  }

  if (hasMinAgeGroup) {
    rows.push({
      taxonID,
      measurementID: minAgeId,
      parentMeasurementID: hasAnyAgeBasis ? ageParentId : '',
      measurementType: 'minimum age',
      verbatimMeasurementType: 'min_age',
      measurementValue: toMaybeMeaningfulNumber(locality.min_age),
      measurementUnit: 'Ma',
      // TODO(#1150): Add authoritative definition for NOW locality min_age semantics.
      measurementMethod: '',
    })
  }

  const coreRows = LOCALITY_MEASUREMENT_MAPPINGS.flatMap(mapping => {
    const rawValue = locality[mapping.field]

    const measurementValue = (() => {
      if (typeof rawValue === 'number') {
        return toMaybeMeaningfulNumberWithZeroOption(rawValue, { allowZero: mapping.allowZero ?? false })
      }
      if (!isMeaningfulMeasurementValue(rawValue)) return ''
      return toDwcString(rawValue).trim()
    })()

    if (!measurementValue) return []

    const verbatimMeasurementType = mapping.field.toString()

    const parentMeasurementID = (() => {
      if (verbatimMeasurementType === 'bfa_max') return hasMaxAgeGroup ? maxAgeId : ''
      if (verbatimMeasurementType === 'bfa_max_abs') return hasMaxAgeGroup ? maxAgeId : ''
      if (verbatimMeasurementType === 'frac_max') return hasMaxAgeGroup ? maxAgeId : ''

      if (verbatimMeasurementType === 'bfa_min') return hasMinAgeGroup ? minAgeId : ''
      if (verbatimMeasurementType === 'bfa_min_abs') return hasMinAgeGroup ? minAgeId : ''
      if (verbatimMeasurementType === 'frac_min') return hasMinAgeGroup ? minAgeId : ''

      return ''
    })()

    const measurementID = buildLocalityMeasurementId(lid, verbatimMeasurementType)

    return [
      {
        taxonID,
        measurementID,
        parentMeasurementID,
        measurementType: mapping.measurementType,
        verbatimMeasurementType,
        measurementValue,
        measurementUnit: mapping.measurementUnit,
        measurementMethod: mapping.measurementMethod,
      },
    ]
  })

  rows.push(...coreRows)

  const museums = locality.now_mus
    .map(row => {
      const institution = row.com_mlist.alt_int_name ?? row.com_mlist.institution
      const locationBits = [
        toMaybeMeaningful(row.com_mlist.city),
        toMaybeMeaningful(row.com_mlist.state),
        toMaybeMeaningful(row.com_mlist.country),
      ]
        .filter(Boolean)
        .join(', ')
      return [row.museum, institution, locationBits ? `(${locationBits})` : ''].filter(Boolean).join(' ')
    })
    .filter(isMeaningfulString)
    .map(value => value.trim())

  if (museums.length) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'museums'),
      parentMeasurementID: '',
      measurementType: 'Museums',
      verbatimMeasurementType: 'now_mus.museum',
      measurementValue: museums.join('|'),
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const projects = locality.now_plr
    .map(row => row.now_proj)
    .map(project =>
      [
        toMaybeMeaningful(project.proj_code),
        toMaybeMeaningful(project.proj_name),
        toMaybeMeaningful(project.proj_status),
      ]
        .filter(Boolean)
        .join(' - ')
    )
    .filter(isMeaningfulString)
    .map(value => value.trim())

  if (projects.length) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'projects'),
      parentMeasurementID: '',
      measurementType: 'Projects',
      verbatimMeasurementType: 'now_plr.pid',
      measurementValue: projects.join('|'),
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const collectingMethods = locality.now_coll_meth
    .map(method => method.coll_meth)
    .filter(value => isMeaningfulString(value))
    .map(value => value.trim())

  if (collectingMethods.length) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'collecting_methods'),
      parentMeasurementID: '',
      measurementType: 'Collecting Methods',
      verbatimMeasurementType: 'now_coll_meth.coll_meth',
      measurementValue: collectingMethods.join('|'),
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const meanHypsodonty = calculateMeanHypsodontyForExport(locality)
  if (isNumberMeaningful(meanHypsodonty, { allowZero: true })) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'mean_hypsodonty'),
      parentMeasurementID: '',
      measurementType: 'Mean hypsodonty',
      verbatimMeasurementType: 'calculated_mean_hypsodonty',
      measurementValue: meanHypsodonty.toString(),
      measurementUnit: '',
      // TODO(#1150): Document calculation provenance (see frontend shared calculations).
      measurementMethod: '',
    })
  }

  const homininSkeletalRemains = hasHomininSkeletalRemainsForExport(locality)
  if (homininSkeletalRemains) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'hominin_skeletal_remains'),
      parentMeasurementID: '',
      measurementType: 'Hominin skeletal remains',
      verbatimMeasurementType: 'calculated_hominin_skeletal_remains',
      measurementValue: 'true',
      measurementUnit: '',
      // TODO(#1150): Document calculation provenance (see frontend shared calculations).
      measurementMethod: '',
    })
  }

  const localitySynonyms = locality.now_syn_loc
    .map(row => row.synonym)
    .filter((syn): syn is string => isMeaningfulString(syn))
    .map(syn => syn.trim())

  if (localitySynonyms.length) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'synonyms'),
      parentMeasurementID: '',
      measurementType: 'synonyms',
      verbatimMeasurementType: 'synonym',
      measurementValue: localitySynonyms.join('|'),
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const sedimentaryStructures = locality.now_ss
    .map(row => row.sed_struct)
    .filter(value => isMeaningfulString(value))
    .map(value => value.trim())

  if (sedimentaryStructures.length) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'sedimentary_structures'),
      parentMeasurementID: '',
      measurementType: 'Sedimentary structures',
      verbatimMeasurementType: 'now_ss.sed_struct',
      measurementValue: sedimentaryStructures.join('|'),
      measurementUnit: '',
      // TODO(#1150): Add field description / controlled vocabulary.
      measurementMethod: '',
    })
  }

  return rows
}

const DWC_TERMS = {
  location: {
    rowType: 'http://rs.tdwg.org/dwc/terms/Location',
    locationID: 'http://rs.tdwg.org/dwc/terms/locationID',
    locality: 'http://rs.tdwg.org/dwc/terms/locality',
    continent: 'http://rs.tdwg.org/dwc/terms/continent',
    country: 'http://rs.tdwg.org/dwc/terms/country',
    stateProvince: 'http://rs.tdwg.org/dwc/terms/stateProvince',
    county: 'http://rs.tdwg.org/dwc/terms/county',
    higherGeography: 'http://rs.tdwg.org/dwc/terms/higherGeography',
    decimalLatitude: 'http://rs.tdwg.org/dwc/terms/decimalLatitude',
    decimalLongitude: 'http://rs.tdwg.org/dwc/terms/decimalLongitude',
    verbatimLatitude: 'http://rs.tdwg.org/dwc/terms/verbatimLatitude',
    verbatimLongitude: 'http://rs.tdwg.org/dwc/terms/verbatimLongitude',
    verbatimElevation: 'http://rs.tdwg.org/dwc/terms/verbatimElevation',
    locationRemarks: 'http://rs.tdwg.org/dwc/terms/locationRemarks',
  },
  geologicalContext: {
    rowType: 'http://rs.tdwg.org/dwc/terms/GeologicalContext',
    locationID: 'http://rs.tdwg.org/dwc/terms/locationID',
    geologicalContextID: 'http://rs.tdwg.org/dwc/terms/geologicalContextID',
    lithostratigraphicTerms: 'http://rs.tdwg.org/dwc/terms/lithostratigraphicTerms',
    group: 'http://rs.tdwg.org/dwc/terms/group',
    formation: 'http://rs.tdwg.org/dwc/terms/formation',
    member: 'http://rs.tdwg.org/dwc/terms/member',
    bed: 'http://rs.tdwg.org/dwc/terms/bed',
    earliestAgeOrLowestStage: 'http://rs.tdwg.org/dwc/terms/earliestAgeOrLowestStage',
    latestAgeOrHighestStage: 'http://rs.tdwg.org/dwc/terms/latestAgeOrHighestStage',
  },
  measurement: {
    rowType: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    taxonID: 'http://rs.tdwg.org/dwc/terms/locationID',
    measurementID: 'http://rs.tdwg.org/dwc/terms/measurementID',
    parentMeasurementID: 'http://rs.tdwg.org/dwc/terms/parentMeasurementID',
    measurementType: 'http://rs.tdwg.org/dwc/terms/measurementType',
    verbatimMeasurementType: 'http://rs.tdwg.org/dwc/terms/verbatimMeasurementType',
    measurementValue: 'http://rs.tdwg.org/dwc/terms/measurementValue',
    measurementUnit: 'http://rs.tdwg.org/dwc/terms/measurementUnit',
    measurementMethod: 'http://rs.tdwg.org/dwc/terms/measurementMethod',
  },
} as const

export const buildLocalityMetaXml = (): string => {
  const locationFields = LOCATION_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.location as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  const geologyFields = GEOLOGICAL_CONTEXT_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.geologicalContext as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  const measurementFields = LOCALITY_MEASUREMENT_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.measurement as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<archive xmlns="http://rs.tdwg.org/dwc/text/" metadata="eml.xml">
  <core encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy='"' ignoreHeaderLines="1" rowType="${DWC_TERMS.location.rowType}">
    <files>
      <location>location.csv</location>
    </files>
    <id index="0" />
${locationFields}
  </core>
  <extension encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy='"' ignoreHeaderLines="1" rowType="${DWC_TERMS.geologicalContext.rowType}">
    <files>
      <location>geologicalcontext.csv</location>
    </files>
    <coreid index="0" />
${geologyFields}
  </extension>
  <extension encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy='"' ignoreHeaderLines="1" rowType="${DWC_TERMS.measurement.rowType}">
    <files>
      <location>measurementorfact.csv</location>
    </files>
    <coreid index="0" />
${measurementFields}
  </extension>
</archive>
`
}

export const buildLocalityEmlXml = (publicationDateIso: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eml:eml
  xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  packageId="nowdatabase-dwc-locality-test-export"
  system="nowdatabase"
  xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 https://eml.ecoinformatics.org/eml-2.1.1/eml.xsd"
>
  <!-- TODO(#1150): Replace placeholder metadata with real dataset-level EML generation. -->
  <dataset>
    <title>NOW database Darwin Core test export (localities)</title>
    <creator>
      <individualName>
        <surName>NOW database</surName>
      </individualName>
    </creator>
    <contact>
      <individualName>
        <surName>NOW database</surName>
      </individualName>
    </contact>
    <pubDate>${publicationDateIso}</pubDate>
    <abstract>
      <para>Admin-only test Darwin Core Archive export for localities, mapping Location + GeologicalContext + MeasurementOrFact terms. Field mappings are intentionally limited for v1.</para>
    </abstract>
    <intellectualRights>
      <para>TODO(#1150): Add rights / license information.</para>
    </intellectualRights>
  </dataset>
</eml:eml>
`
}

export const buildDwcLocalityArchiveZipBufferFromLocalities = async (
  localities: LocalityForExport[]
): Promise<Buffer> => {
  const locationRows = localities.map(mapLocalityToLocationRow)
  const geologicalContextRows = localities.map(mapLocalityToGeologicalContextRow)
  const measurementRows = localities.flatMap(mapLocalityToMeasurementRows)

  const locationCsv = await writeCsvString([...LOCATION_HEADERS], locationRows)
  const geologyCsv = await writeCsvString([...GEOLOGICAL_CONTEXT_HEADERS], geologicalContextRows)
  const measurementCsv = await writeCsvString([...LOCALITY_MEASUREMENT_HEADERS], measurementRows)
  const metaXml = buildLocalityMetaXml()

  const publicationDateIso = new Date().toISOString().slice(0, 10)
  const emlXml = buildLocalityEmlXml(publicationDateIso)

  const zip = new JSZip()
  zip.file('location.csv', locationCsv)
  zip.file('geologicalcontext.csv', geologyCsv)
  zip.file('measurementorfact.csv', measurementCsv)
  zip.file('meta.xml', metaXml)
  zip.file('eml.xml', emlXml)

  return await zip.generateAsync({ type: 'nodebuffer' })
}

export const buildDwcLocalityArchiveZipBuffer = async (): Promise<Buffer> => {
  const { nowDb } = await import('../utils/db')
  const localities = await nowDb.now_loc.findMany({
    select: {
      lid: true,
      loc_name: true,
      basin: true,
      subbasin: true,
      country: true,
      state: true,
      county: true,
      dec_lat: true,
      dec_long: true,
      dms_lat: true,
      dms_long: true,
      approx_coord: true,
      altitude: true,
      loc_detail: true,
      chron: true,
      lgroup: true,
      formation: true,
      member: true,
      bed: true,
      bfa_max: true,
      bfa_min: true,
      bfa_max_abs: true,
      bfa_min_abs: true,
      frac_max: true,
      frac_min: true,
      max_age: true,
      min_age: true,
      date_meth: true,
      age_comm: true,
      site_area: true,
      gen_loc: true,
      plate: true,
      appr_num_spm: true,
      num_spm: true,
      true_quant: true,
      complete: true,
      num_quad: true,
      rock_type: true,
      rt_adj: true,
      lith_comm: true,
      depo_context1: true,
      depo_context2: true,
      depo_context3: true,
      depo_context4: true,
      depo_comm: true,
      sed_env_1: true,
      sed_env_2: true,
      event_circum: true,
      se_comm: true,
      assem_fm: true,
      transport: true,
      trans_mod: true,
      weath_trmp: true,
      pt_conc: true,
      size_type: true,
      vert_pres: true,
      plant_pres: true,
      invert_pres: true,
      time_rep: true,
      taph_comm: true,
      tax_comm: true,
      datum_plane: true,
      tos: true,
      bos: true,
      loc_status: true,
      hominin_skeletal_remains: true,
      climate_type: true,
      biome: true,
      v_ht: true,
      v_struct: true,
      v_envi_det: true,
      disturb: true,
      nutrients: true,
      water: true,
      seasonality: true,
      seas_intens: true,
      pri_prod: true,
      moisture: true,
      temperature: true,
      estimate_precip: true,
      estimate_temp: true,
      estimate_npp: true,
      pers_woody_cover: true,
      pers_pollen_ap: true,
      pers_pollen_nap: true,
      pers_pollen_other: true,
      stone_tool_cut_marks_on_bones: true,
      bipedal_footprints: true,
      stone_tool_technology: true,
      technological_mode_1: true,
      technological_mode_2: true,
      technological_mode_3: true,
      cultural_stage_1: true,
      cultural_stage_2: true,
      cultural_stage_3: true,
      regional_culture_1: true,
      regional_culture_2: true,
      regional_culture_3: true,
      now_time_unit_now_loc_bfa_maxTonow_time_unit: {
        select: { tu_name: true, tu_display_name: true, rank: true, sequence: true },
      },
      now_time_unit_now_loc_bfa_minTonow_time_unit: {
        select: { tu_name: true, tu_display_name: true, rank: true, sequence: true },
      },
      now_syn_loc: {
        select: { synonym: true },
      },
      now_ss: {
        select: { sed_struct: true },
      },
      now_coll_meth: {
        select: { coll_meth: true },
      },
      now_mus: {
        select: {
          museum: true,
          com_mlist: { select: { institution: true, alt_int_name: true, city: true, state: true, country: true } },
        },
      },
      now_plr: {
        select: {
          now_proj: { select: { proj_code: true, proj_name: true, proj_status: true } },
        },
      },
      now_lau: {
        take: 1,
        orderBy: { lau_date: 'desc' },
        select: {
          lau_date: true,
          lau_comment: true,
          com_people_now_lau_lau_coordinatorTocom_people: { select: { full_name: true } },
          com_people_now_lau_lau_authorizerTocom_people: { select: { full_name: true } },
        },
      },
      now_ls: {
        select: {
          com_species: {
            select: { order_name: true, tht: true, genus_name: true },
          },
        },
      },
    },
  })

  return await buildDwcLocalityArchiveZipBufferFromLocalities(localities as unknown as LocalityForExport[])
}
