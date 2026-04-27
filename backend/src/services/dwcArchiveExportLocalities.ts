import Prisma from '../../prisma/generated/now_test_client'
import { format } from 'fast-csv'
import { Writable } from 'stream'
import JSZip from 'jszip'

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
  'country',
  'stateProvince',
  'county',
  'decimalLatitude',
  'decimalLongitude',
  'verbatimLatitude',
  'verbatimLongitude',
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
  'locationID',
  'measurementID',
  'measurementType',
  'verbatimMeasurementType',
  'measurementValue',
  'measurementUnit',
  'measurementMethod',
  'measurementRemarks',
] as const

export type LocalityMeasurementCsvHeader = (typeof LOCALITY_MEASUREMENT_HEADERS)[number]
export type LocalityMeasurementCsvRow = Record<LocalityMeasurementCsvHeader, string>

type TimeUnitForLocalityExport = Pick<Prisma.now_time_unit, 'tu_name' | 'tu_display_name' | 'rank' | 'sequence'>

type LocalityForExport = Pick<
  Prisma.now_loc,
  | 'lid'
  | 'loc_name'
  | 'country'
  | 'state'
  | 'county'
  | 'dec_lat'
  | 'dec_long'
  | 'dms_lat'
  | 'dms_long'
  | 'loc_detail'
  | 'chron'
  | 'lgroup'
  | 'formation'
  | 'member'
  | 'bed'
  | 'bfa_max'
  | 'bfa_min'
  | 'max_age'
  | 'min_age'
  | 'date_meth'
  | 'age_comm'
> & {
  now_time_unit_now_loc_bfa_maxTonow_time_unit: TimeUnitForLocalityExport | null
  now_time_unit_now_loc_bfa_minTonow_time_unit: TimeUnitForLocalityExport | null
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

  return {
    locationID,
    locality: toMaybeMeaningful(locality.loc_name),
    country: toMaybeMeaningful(locality.country),
    stateProvince: toMaybeMeaningful(locality.state),
    county: toMaybeMeaningful(locality.county),
    decimalLatitude: toMaybeMeaningfulNumber(locality.dec_lat),
    decimalLongitude: toMaybeMeaningfulNumber(locality.dec_long),
    verbatimLatitude: toMaybeMeaningful(locality.dms_lat),
    verbatimLongitude: toMaybeMeaningful(locality.dms_long),
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

const LOCALITY_MEASUREMENT_MAPPINGS: Array<{
  field: keyof LocalityForExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
}> = [
  {
    field: 'max_age',
    measurementType: 'maximum age',
    measurementUnit: 'Ma',
    // TODO(#1150): Add authoritative definition for NOW locality max_age/min_age semantics.
    measurementMethod: '',
  },
  {
    field: 'min_age',
    measurementType: 'minimum age',
    measurementUnit: 'Ma',
    // TODO(#1150): Add authoritative definition for NOW locality max_age/min_age semantics.
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
  {
    field: 'bfa_max',
    measurementType: 'BFA max',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
  {
    field: 'bfa_min',
    measurementType: 'BFA min',
    measurementUnit: '',
    // TODO(#1150): Add field description.
    measurementMethod: '',
  },
]

export const mapLocalityToMeasurementRows = (locality: LocalityForExport): LocalityMeasurementCsvRow[] => {
  const locationID = locationIdForLocality(locality.lid)

  return LOCALITY_MEASUREMENT_MAPPINGS.flatMap(mapping => {
    const rawValue = locality[mapping.field]
    if (!isMeaningfulMeasurementValue(rawValue)) return []

    const measurementValue = toDwcString(rawValue).trim()
    if (!measurementValue) return []

    return [
      {
        locationID,
        measurementID: `NOW:LOC:${locality.lid}:${mapping.field.toString()}`,
        measurementType: mapping.measurementType,
        verbatimMeasurementType: mapping.field.toString(),
        measurementValue,
        measurementUnit: mapping.measurementUnit,
        measurementMethod: mapping.measurementMethod,
        // TODO(#1150): Decide whether any locality measurementRemarks should be emitted and from which columns.
        measurementRemarks: '',
      },
    ]
  })
}

const DWC_TERMS = {
  location: {
    rowType: 'http://rs.tdwg.org/dwc/terms/Location',
    locationID: 'http://rs.tdwg.org/dwc/terms/locationID',
    locality: 'http://rs.tdwg.org/dwc/terms/locality',
    country: 'http://rs.tdwg.org/dwc/terms/country',
    stateProvince: 'http://rs.tdwg.org/dwc/terms/stateProvince',
    county: 'http://rs.tdwg.org/dwc/terms/county',
    decimalLatitude: 'http://rs.tdwg.org/dwc/terms/decimalLatitude',
    decimalLongitude: 'http://rs.tdwg.org/dwc/terms/decimalLongitude',
    verbatimLatitude: 'http://rs.tdwg.org/dwc/terms/verbatimLatitude',
    verbatimLongitude: 'http://rs.tdwg.org/dwc/terms/verbatimLongitude',
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
    locationID: 'http://rs.tdwg.org/dwc/terms/locationID',
    measurementID: 'http://rs.tdwg.org/dwc/terms/measurementID',
    measurementType: 'http://rs.tdwg.org/dwc/terms/measurementType',
    verbatimMeasurementType: 'http://rs.tdwg.org/dwc/terms/verbatimMeasurementType',
    measurementValue: 'http://rs.tdwg.org/dwc/terms/measurementValue',
    measurementUnit: 'http://rs.tdwg.org/dwc/terms/measurementUnit',
    measurementMethod: 'http://rs.tdwg.org/dwc/terms/measurementMethod',
    measurementRemarks: 'http://rs.tdwg.org/dwc/terms/measurementRemarks',
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
  const prisma = new Prisma.PrismaClient()
  try {
    const localities = await prisma.now_loc.findMany({
      select: {
        lid: true,
        loc_name: true,
        country: true,
        state: true,
        county: true,
        dec_lat: true,
        dec_long: true,
        dms_lat: true,
        dms_long: true,
        loc_detail: true,
        chron: true,
        lgroup: true,
        formation: true,
        member: true,
        bed: true,
        bfa_max: true,
        bfa_min: true,
        max_age: true,
        min_age: true,
        date_meth: true,
        age_comm: true,
        now_time_unit_now_loc_bfa_maxTonow_time_unit: {
          select: { tu_name: true, tu_display_name: true, rank: true, sequence: true },
        },
        now_time_unit_now_loc_bfa_minTonow_time_unit: {
          select: { tu_name: true, tu_display_name: true, rank: true, sequence: true },
        },
      },
    })

    return await buildDwcLocalityArchiveZipBufferFromLocalities(localities as unknown as LocalityForExport[])
  } finally {
    await prisma.$disconnect()
  }
}
