import { format } from 'fast-csv'
import { Writable } from 'stream'
import JSZip from 'jszip'
import { getContinentByCountry } from '../../../frontend/src/shared/validators/countryContinents'
import {
  mapLocalityToGeologicalContextRow,
  mapLocalityToMeasurementRows,
  type LocalityMeasurementCsvRow,
} from './dwcArchiveExportLocalities'
import {
  mapOccurrenceToMeasurementRows,
  mapOccurrenceToOccurrenceRow,
  type OccurrenceCsvRow,
} from './dwcArchiveExportOccurrences'
import type { MeasurementCsvRow } from './dwcArchiveExport'

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
        output += typeof chunk === 'string' ? chunk : chunk.toString('utf8')
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

const isMeaningfulString = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed === '-') return false
  return true
}

const toMaybeMeaningful = (value: string | null | undefined): string => (isMeaningfulString(value) ? value.trim() : '')

const toMaybeMeaningfulNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  if (!Number.isFinite(value)) return ''
  if (value === 0) return ''
  return value.toString()
}

const eventIdForLocality = (lid: number): string => `NOW:EVENT:${lid}`
const locationIdForLocality = (lid: number): string => `NOW:LOC:${lid}`
const occurrenceIdForRow = (lid: number, speciesId: number): string => `NOW:OCC:${lid}:${speciesId}`

type LocalityForDwcDpExport = Parameters<typeof mapLocalityToMeasurementRows>[0]
type OccurrenceForDwcDpExport = Parameters<typeof mapOccurrenceToOccurrenceRow>[0]

export const DWC_DP_EVENT_HEADERS = [
  'eventID',
  'parentEventID',
  'eventType',
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
  'eventRemarks',
  'geologicalContextID',
] as const

type DwcDpEventHeader = (typeof DWC_DP_EVENT_HEADERS)[number]
type DwcDpEventRow = Record<DwcDpEventHeader, string>

export const DWC_DP_GEOLOGICAL_CONTEXT_HEADERS = [
  'geologicalContextID',
  'lithostratigraphicTerms',
  'group',
  'formation',
  'member',
  'bed',
  'earliestAgeOrLowestStage',
  'latestAgeOrHighestStage',
] as const

type DwcDpGeologicalContextHeader = (typeof DWC_DP_GEOLOGICAL_CONTEXT_HEADERS)[number]
type DwcDpGeologicalContextRow = Record<DwcDpGeologicalContextHeader, string>

export const DWC_DP_OCCURRENCE_HEADERS = [
  'occurrenceID',
  'eventID',
  'organismQuantity',
  'organismQuantityType',
  'occurrenceStatus',
  'occurrenceRemarks',
  'taxonID',
  'scientificName',
  'scientificNameAuthorship',
  'taxonRank',
  'identificationVerificationStatus',
] as const

type DwcDpOccurrenceHeader = (typeof DWC_DP_OCCURRENCE_HEADERS)[number]
type DwcDpOccurrenceRow = Record<DwcDpOccurrenceHeader, string>

const ASSERTION_HEADERS = [
  'assertionID',
  'verbatimAssertionType',
  'assertionType',
  'assertionTypeIRI',
  'assertionTypeSource',
  'assertionMadeDate',
  'assertionEffectiveDate',
  'assertionValue',
  'assertionValueIRI',
  'assertionValueSource',
  'assertionValueNumeric',
  'assertionUnit',
  'assertionUnitIRI',
  'assertionUnitSource',
  'assertionError',
  'assertionBy',
  'assertionByID',
  'assertionProtocols',
  'assertionProtocolID',
  'assertionReferences',
  'assertionRemarks',
] as const

const DWC_DP_EVENT_ASSERTION_HEADERS = ['eventID', ...ASSERTION_HEADERS] as const
const DWC_DP_OCCURRENCE_ASSERTION_HEADERS = ['occurrenceID', ...ASSERTION_HEADERS] as const

type AssertionHeader = (typeof ASSERTION_HEADERS)[number]
type AssertionColumns = Record<AssertionHeader, string>
type DwcDpEventAssertionHeader = (typeof DWC_DP_EVENT_ASSERTION_HEADERS)[number]
type DwcDpOccurrenceAssertionHeader = (typeof DWC_DP_OCCURRENCE_ASSERTION_HEADERS)[number]
type DwcDpEventAssertionRow = Record<DwcDpEventAssertionHeader, string>
type DwcDpOccurrenceAssertionRow = Record<DwcDpOccurrenceAssertionHeader, string>

export const DWC_DP_TABLES = {
  event: 'event.csv',
  geologicalContext: 'geological-context.csv',
  occurrence: 'occurrence.csv',
  eventAssertion: 'event-assertion.csv',
  occurrenceAssertion: 'occurrence-assertion.csv',
  dataPackage: 'datapackage.json',
  eml: 'eml.xml',
} as const

const numericValue = (value: string): string => {
  if (!value.trim()) return ''
  const parsed = Number(value)
  return Number.isFinite(parsed) ? value : ''
}

const assertionColumnsFromMeasurement = ({
  measurementID,
  verbatimMeasurementType,
  measurementType,
  measurementValue,
  measurementUnit,
  measurementMethod,
}: Pick<
  MeasurementCsvRow | LocalityMeasurementCsvRow,
  | 'measurementID'
  | 'verbatimMeasurementType'
  | 'measurementType'
  | 'measurementValue'
  | 'measurementUnit'
  | 'measurementMethod'
>): AssertionColumns => ({
  assertionID: measurementID,
  verbatimAssertionType: verbatimMeasurementType,
  assertionType: measurementType,
  assertionTypeIRI: '',
  assertionTypeSource: '',
  assertionMadeDate: '',
  assertionEffectiveDate: '',
  assertionValue: measurementValue,
  assertionValueIRI: '',
  assertionValueSource: '',
  assertionValueNumeric: numericValue(measurementValue),
  assertionUnit: measurementUnit,
  assertionUnitIRI: '',
  assertionUnitSource: '',
  assertionError: '',
  assertionBy: '',
  assertionByID: '',
  assertionProtocols: measurementMethod,
  assertionProtocolID: '',
  assertionReferences: '',
  assertionRemarks: '',
})

export const mapLocalityToDwcDpEventRow = (locality: LocalityForDwcDpExport): DwcDpEventRow => {
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
    eventID: eventIdForLocality(locality.lid),
    parentEventID: '',
    eventType: 'paleontological locality',
    locationID: locationIdForLocality(locality.lid),
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
    eventRemarks: [
      toMaybeMeaningful(locality.loc_detail),
      toMaybeMeaningful(locality.age_comm),
      toMaybeMeaningful(locality.tax_comm),
    ]
      .filter(Boolean)
      .join(' | '),
    geologicalContextID: `NOW:GEO:${locality.lid}`,
  }
}

export const mapLocalityToDwcDpGeologicalContextRow = (locality: LocalityForDwcDpExport): DwcDpGeologicalContextRow => {
  const geologicalContextRow = mapLocalityToGeologicalContextRow(locality)

  return {
    geologicalContextID: `NOW:GEO:${locality.lid}`,
    lithostratigraphicTerms: geologicalContextRow.lithostratigraphicTerms,
    group: geologicalContextRow.group,
    formation: geologicalContextRow.formation,
    member: geologicalContextRow.member,
    bed: geologicalContextRow.bed,
    earliestAgeOrLowestStage: geologicalContextRow.earliestAgeOrLowestStage,
    latestAgeOrHighestStage: geologicalContextRow.latestAgeOrHighestStage,
  }
}

export const mapOccurrenceToDwcDpOccurrenceRow = (occurrence: OccurrenceForDwcDpExport): DwcDpOccurrenceRow => {
  const occurrenceRow: OccurrenceCsvRow = mapOccurrenceToOccurrenceRow(occurrence)

  return {
    occurrenceID: occurrenceRow.occurrenceID,
    eventID: eventIdForLocality(occurrence.lid),
    organismQuantity: occurrenceRow.organismQuantity,
    organismQuantityType: occurrenceRow.organismQuantityType,
    occurrenceStatus: occurrenceRow.occurrenceStatus,
    occurrenceRemarks: occurrenceRow.occurrenceRemarks,
    taxonID: occurrenceRow.taxonID,
    scientificName: occurrenceRow.scientificName,
    scientificNameAuthorship: toMaybeMeaningful(occurrence.com_species.sp_author),
    taxonRank: '',
    identificationVerificationStatus: occurrenceRow.identificationQualifier,
  }
}

export const mapLocalityToDwcDpEventAssertionRows = (locality: LocalityForDwcDpExport): DwcDpEventAssertionRow[] => {
  const eventID = eventIdForLocality(locality.lid)

  return mapLocalityToMeasurementRows(locality).map(row => ({
    eventID,
    ...assertionColumnsFromMeasurement({
      ...row,
      measurementID: row.measurementID.replace(locationIdForLocality(locality.lid), eventID),
    }),
  }))
}

export const mapOccurrenceToDwcDpOccurrenceAssertionRows = (
  occurrence: OccurrenceForDwcDpExport
): DwcDpOccurrenceAssertionRow[] => {
  const occurrenceID = occurrenceIdForRow(occurrence.lid, occurrence.species_id)

  return mapOccurrenceToMeasurementRows(occurrence).map(row => ({
    occurrenceID,
    ...assertionColumnsFromMeasurement(row),
  }))
}

const field = (name: string, type = 'string') => ({ name, type })

const schemaFor = ({
  headers,
  primaryKey,
  foreignKeys = [],
}: {
  headers: readonly string[]
  primaryKey: string | string[]
  foreignKeys?: Array<{
    fields: string
    reference: { resource: string; fields: string }
  }>
}) => ({
  fields: headers.map(header => field(header, header.endsWith('Numeric') ? 'number' : 'string')),
  primaryKey,
  foreignKeys,
})

export const buildDwcDataPackageJson = (publicationDateIso: string): string => {
  const dataPackage = {
    profile: 'data-package',
    name: 'now-dwc-dp-test-export',
    title: 'NOW database Darwin Core Data Package test export',
    created: publicationDateIso,
    homepage: 'https://nowdatabase.org/',
    description:
      'Admin-only test Darwin Core Data Package export for NOW localities as events and NOW locality-species rows as occurrences.',
    resources: [
      {
        name: 'event',
        path: DWC_DP_TABLES.event,
        profile: 'tabular-data-resource',
        schema: schemaFor({
          headers: DWC_DP_EVENT_HEADERS,
          primaryKey: 'eventID',
          foreignKeys: [
            {
              fields: 'geologicalContextID',
              reference: { resource: 'geological-context', fields: 'geologicalContextID' },
            },
          ],
        }),
      },
      {
        name: 'geological-context',
        path: DWC_DP_TABLES.geologicalContext,
        profile: 'tabular-data-resource',
        schema: schemaFor({
          headers: DWC_DP_GEOLOGICAL_CONTEXT_HEADERS,
          primaryKey: 'geologicalContextID',
        }),
      },
      {
        name: 'occurrence',
        path: DWC_DP_TABLES.occurrence,
        profile: 'tabular-data-resource',
        schema: schemaFor({
          headers: DWC_DP_OCCURRENCE_HEADERS,
          primaryKey: 'occurrenceID',
          foreignKeys: [
            {
              fields: 'eventID',
              reference: { resource: 'event', fields: 'eventID' },
            },
          ],
        }),
      },
      {
        name: 'event-assertion',
        path: DWC_DP_TABLES.eventAssertion,
        profile: 'tabular-data-resource',
        schema: schemaFor({
          headers: DWC_DP_EVENT_ASSERTION_HEADERS,
          primaryKey: 'assertionID',
          foreignKeys: [
            {
              fields: 'eventID',
              reference: { resource: 'event', fields: 'eventID' },
            },
          ],
        }),
      },
      {
        name: 'occurrence-assertion',
        path: DWC_DP_TABLES.occurrenceAssertion,
        profile: 'tabular-data-resource',
        schema: schemaFor({
          headers: DWC_DP_OCCURRENCE_ASSERTION_HEADERS,
          primaryKey: 'assertionID',
          foreignKeys: [
            {
              fields: 'occurrenceID',
              reference: { resource: 'occurrence', fields: 'occurrenceID' },
            },
          ],
        }),
      },
    ],
  }

  return `${JSON.stringify(dataPackage, null, 2)}\n`
}

export const buildDwcDataPackageEmlXml = (publicationDateIso: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eml:eml
  xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  packageId="nowdatabase-dwc-dp-test-export"
  system="nowdatabase"
  xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 https://eml.ecoinformatics.org/eml-2.1.1/eml.xsd"
>
  <!-- TODO(#1150): Replace placeholder metadata with real dataset-level EML generation. -->
  <dataset>
    <title>NOW database Darwin Core Data Package test export</title>
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
      <para>Admin-only test Darwin Core Data Package export. Localities are modeled as events, locality geological fields are modeled as geological contexts, locality-species rows are modeled as occurrences, and non-core facts are modeled as event or occurrence assertions.</para>
    </abstract>
    <intellectualRights>
      <para>TODO(#1150): Add rights / license information.</para>
    </intellectualRights>
  </dataset>
</eml:eml>
`
}

const localitySelect = {
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
  now_ls: {
    select: {
      com_species: {
        select: { order_name: true, tht: true, genus_name: true },
      },
    },
  },
} as const

const occurrenceSelect = {
  lid: true,
  species_id: true,
  nis: true,
  pct: true,
  quad: true,
  mni: true,
  qua: true,
  id_status: true,
  orig_entry: true,
  source_name: true,
  body_mass: true,
  mesowear: true,
  mw_or_high: true,
  mw_or_low: true,
  mw_cs_sharp: true,
  mw_cs_round: true,
  mw_cs_blunt: true,
  mw_scale_min: true,
  mw_scale_max: true,
  mw_value: true,
  microwear: true,
  dc13_mean: true,
  dc13_n: true,
  dc13_max: true,
  dc13_min: true,
  dc13_stdev: true,
  do18_mean: true,
  do18_n: true,
  do18_max: true,
  do18_min: true,
  do18_stdev: true,
  com_species: {
    select: {
      species_id: true,
      class_name: true,
      subclass_or_superorder_name: true,
      order_name: true,
      suborder_or_superfamily_name: true,
      family_name: true,
      subfamily_name: true,
      genus_name: true,
      species_name: true,
      unique_identifier: true,
      taxonomic_status: true,
      common_name: true,
      sp_author: true,
      sp_comment: true,
    },
  },
} as const

export const buildDwcDataPackageZipBufferFromRows = async ({
  localities,
  occurrences,
  publicationDateIso = new Date().toISOString().slice(0, 10),
}: {
  localities: LocalityForDwcDpExport[]
  occurrences: OccurrenceForDwcDpExport[]
  publicationDateIso?: string
}): Promise<Buffer> => {
  const eventRows = localities.map(mapLocalityToDwcDpEventRow)
  const geologicalContextRows = localities.map(mapLocalityToDwcDpGeologicalContextRow)
  const occurrenceRows = occurrences.map(mapOccurrenceToDwcDpOccurrenceRow)
  const eventAssertionRows = localities.flatMap(mapLocalityToDwcDpEventAssertionRows)
  const occurrenceAssertionRows = occurrences.flatMap(mapOccurrenceToDwcDpOccurrenceAssertionRows)

  const zip = new JSZip()
  zip.file(DWC_DP_TABLES.event, await writeCsvString([...DWC_DP_EVENT_HEADERS], eventRows))
  zip.file(
    DWC_DP_TABLES.geologicalContext,
    await writeCsvString([...DWC_DP_GEOLOGICAL_CONTEXT_HEADERS], geologicalContextRows)
  )
  zip.file(DWC_DP_TABLES.occurrence, await writeCsvString([...DWC_DP_OCCURRENCE_HEADERS], occurrenceRows))
  zip.file(DWC_DP_TABLES.eventAssertion, await writeCsvString([...DWC_DP_EVENT_ASSERTION_HEADERS], eventAssertionRows))
  zip.file(
    DWC_DP_TABLES.occurrenceAssertion,
    await writeCsvString([...DWC_DP_OCCURRENCE_ASSERTION_HEADERS], occurrenceAssertionRows)
  )
  zip.file(DWC_DP_TABLES.dataPackage, buildDwcDataPackageJson(publicationDateIso))
  zip.file(DWC_DP_TABLES.eml, buildDwcDataPackageEmlXml(publicationDateIso))

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

export const buildDwcDataPackageZipBuffer = async (): Promise<Buffer> => {
  const { nowDb } = await import('../utils/db')
  const localities = (await nowDb.now_loc.findMany({
    orderBy: { lid: 'asc' },
    select: localitySelect,
  })) as unknown as LocalityForDwcDpExport[]

  const occurrences = (await nowDb.now_ls.findMany({
    orderBy: [{ lid: 'asc' }, { species_id: 'asc' }],
    select: occurrenceSelect,
  })) as unknown as OccurrenceForDwcDpExport[]

  return await buildDwcDataPackageZipBufferFromRows({
    localities,
    occurrences,
  })
}

export type DwcDpLocalityFixture = LocalityForDwcDpExport
export type DwcDpOccurrenceFixture = OccurrenceForDwcDpExport
