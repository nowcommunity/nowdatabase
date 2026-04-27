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
> & {
  now_time_unit_now_loc_bfa_maxTonow_time_unit: TimeUnitForLocalityExport | null
  now_time_unit_now_loc_bfa_minTonow_time_unit: TimeUnitForLocalityExport | null
  now_syn_loc: ReadonlyArray<{ synonym: string | null }>
  now_ss: ReadonlyArray<{ sed_struct: string }>
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
    locationRemarks: [toMaybeMeaningful(locality.loc_detail), toMaybeMeaningful(locality.age_comm)]
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
  return true
}

const concatMeaningful = (values: Array<string | null | undefined>): string => {
  const parts = values.map(toMaybeMeaningful).filter(Boolean)
  return parts.join('|')
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

const LOCALITY_MEASUREMENT_MAPPINGS: Array<{
  field: keyof LocalityForExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
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
    field: 'chron',
    measurementType: 'chron',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
]

export const mapLocalityToMeasurementRows = (locality: LocalityForExport): LocalityMeasurementCsvRow[] => {
  const taxonID = locationIdForLocality(locality.lid)
  const lid = locality.lid

  const ageParentId = buildLocalityMeasurementId(lid, 'age')
  const maxAgeId = buildLocalityMeasurementId(lid, 'max_age')
  const minAgeId = buildLocalityMeasurementId(lid, 'min_age')

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
    if (!isMeaningfulMeasurementValue(rawValue)) return []

    const measurementValue = toDwcString(rawValue).trim()
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

  const lithologyValue = concatMeaningful([locality.rock_type, locality.rt_adj, locality.lith_comm])
  if (lithologyValue) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'lithology'),
      parentMeasurementID: '',
      measurementType: 'lithology',
      verbatimMeasurementType: 'rock_type|rt_adj|lith_comm',
      measurementValue: lithologyValue,
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const depositionalContextValue = concatMeaningful([
    locality.depo_context1,
    locality.depo_context2,
    locality.depo_context3,
    locality.depo_context4,
    locality.depo_comm,
  ])
  if (depositionalContextValue) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'depositional_context'),
      parentMeasurementID: '',
      measurementType: 'depositional context',
      verbatimMeasurementType: 'depo_context1|depo_context2|depo_context3|depo_context4|depo_comm',
      measurementValue: depositionalContextValue,
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const sedimentaryEnvironmentValue = concatMeaningful([
    locality.sed_env_1,
    locality.sed_env_2,
    locality.event_circum,
    locality.se_comm,
  ])
  if (sedimentaryEnvironmentValue) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'sedimentary_environment'),
      parentMeasurementID: '',
      measurementType: 'sedimentary environment',
      verbatimMeasurementType: 'sed_env_1|sed_env_2|event_circum|se_comm',
      measurementValue: sedimentaryEnvironmentValue,
      measurementUnit: '',
      // TODO(#1150): Add field description.
      measurementMethod: '',
    })
  }

  const sedimentaryStructures = locality.now_ss
    .map(row => row.sed_struct)
    .filter(value => isMeaningfulString(value))
    .map(value => value.trim())

  const taphonomicDetailValue = concatMeaningful([
    locality.assem_fm,
    locality.transport,
    locality.trans_mod,
    locality.weath_trmp,
    locality.pt_conc,
    locality.size_type,
    locality.vert_pres,
    locality.plant_pres,
    locality.invert_pres,
    locality.time_rep,
    locality.taph_comm,
  ])

  const sedimentaryStructureAndTaphonomicDetailValue = [
    ...sedimentaryStructures,
    ...(taphonomicDetailValue ? [taphonomicDetailValue] : []),
  ].join('|')

  if (sedimentaryStructureAndTaphonomicDetailValue) {
    rows.push({
      taxonID,
      measurementID: buildLocalityMeasurementId(lid, 'sedimentary_structure_taphonomic_detail'),
      parentMeasurementID: '',
      measurementType: 'sedimentary structure & taphonomic detail',
      verbatimMeasurementType:
        'now_ss.sed_struct|assem_fm|transport|trans_mod|weath_trmp|pt_conc|size_type|vert_pres|plant_pres|invert_pres|time_rep|taph_comm',
      measurementValue: sedimentaryStructureAndTaphonomicDetailValue,
      measurementUnit: '',
      // TODO(#1150): Add field description.
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
    },
  })

  return await buildDwcLocalityArchiveZipBufferFromLocalities(localities as unknown as LocalityForExport[])
}
