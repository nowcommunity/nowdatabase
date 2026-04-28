import Prisma from '../../prisma/generated/now_test_client'
import { format } from 'fast-csv'
import { Writable } from 'stream'
import JSZip from 'jszip'
import {
  GEOLOGICAL_CONTEXT_HEADERS,
  LOCATION_HEADERS,
  mapLocalityToGeologicalContextRow,
  mapLocalityToLocationRow,
} from './dwcArchiveExportLocalities'
import { MEASUREMENT_HEADERS, TAXON_HEADERS, mapSpeciesToTaxonRow, type MeasurementCsvRow } from './dwcArchiveExport'

const writeCsvString = async (headers: string[], rows: Array<Record<string, unknown>>): Promise<string> => {
  if (rows.length === 0) {
    return `${headers.map(header => `"${header.replace(/"/g, '""')}"`).join(',')}\n`
  }

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

const toDwcString = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'number') return Number.isFinite(value) ? value.toString() : ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') return value
  if (typeof value === 'object' && typeof (value as { toString?: unknown }).toString === 'function') {
    const asString = (value as { toString: () => string }).toString()
    return asString === '[object Object]' ? '' : asString
  }
  return ''
}

const toMaybeMeaningful = (value: string | null | undefined): string => (isMeaningfulString(value) ? value.trim() : '')

const occurrenceIdForRow = (lid: number, speciesId: number): string => `NOW:OCC:${lid}:${speciesId}`

const taxonIdForSpecies = (speciesId: number): string => `NOW:${speciesId}`

export const OCCURRENCE_HEADERS = [
  'occurrenceID',
  'locationID',
  'taxonID',
  'scientificName',
  'occurrenceStatus',
  'organismQuantity',
  'organismQuantityType',
  'identificationQualifier',
  'occurrenceRemarks',
] as const

export type OccurrenceCsvHeader = (typeof OCCURRENCE_HEADERS)[number]
export type OccurrenceCsvRow = Record<OccurrenceCsvHeader, string>

type LocalityForOccurrenceExport = Parameters<typeof mapLocalityToLocationRow>[0]
type SpeciesForOccurrenceExport = Parameters<typeof mapSpeciesToTaxonRow>[0]

type OccurrenceForExport = Pick<
  Prisma.now_ls,
  | 'lid'
  | 'species_id'
  | 'nis'
  | 'pct'
  | 'quad'
  | 'mni'
  | 'qua'
  | 'id_status'
  | 'orig_entry'
  | 'source_name'
  | 'body_mass'
  | 'mesowear'
  | 'mw_or_high'
  | 'mw_or_low'
  | 'mw_cs_sharp'
  | 'mw_cs_round'
  | 'mw_cs_blunt'
  | 'mw_scale_min'
  | 'mw_scale_max'
  | 'mw_value'
  | 'microwear'
  | 'dc13_mean'
  | 'dc13_n'
  | 'dc13_max'
  | 'dc13_min'
  | 'dc13_stdev'
  | 'do18_mean'
  | 'do18_n'
  | 'do18_max'
  | 'do18_min'
  | 'do18_stdev'
> & {
  now_loc: LocalityForOccurrenceExport
  com_species: SpeciesForOccurrenceExport
}

const scientificNameForOccurrence = (species: SpeciesForOccurrenceExport): string => {
  const nameParts = [
    toMaybeMeaningful(species.genus_name),
    toMaybeMeaningful(species.species_name),
    toMaybeMeaningful(species.unique_identifier),
  ].filter(Boolean)
  const authorship = toMaybeMeaningful(species.sp_author)
  return [nameParts.join(' '), authorship].filter(Boolean).join(' ').trim()
}

const occurrenceQuantity = (
  occurrence: OccurrenceForExport
): Pick<OccurrenceCsvRow, 'organismQuantity' | 'organismQuantityType'> => {
  if (occurrence.mni !== null) {
    return { organismQuantity: occurrence.mni.toString(), organismQuantityType: 'minimum number of individuals' }
  }
  if (occurrence.nis !== null) {
    return { organismQuantity: occurrence.nis.toString(), organismQuantityType: 'number of identified specimens' }
  }
  if (occurrence.pct !== null) {
    return { organismQuantity: occurrence.pct.toString(), organismQuantityType: 'percentage' }
  }
  if (occurrence.quad !== null) {
    return { organismQuantity: occurrence.quad.toString(), organismQuantityType: 'quadrat count' }
  }
  return { organismQuantity: '', organismQuantityType: '' }
}

export const mapOccurrenceToOccurrenceRow = (occurrence: OccurrenceForExport): OccurrenceCsvRow => {
  const quantity = occurrenceQuantity(occurrence)
  const occurrenceRemarks = [
    toMaybeMeaningful(occurrence.orig_entry),
    toMaybeMeaningful(occurrence.source_name),
    toMaybeMeaningful(occurrence.qua),
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    occurrenceID: occurrenceIdForRow(occurrence.lid, occurrence.species_id),
    locationID: `NOW:LOC:${occurrence.lid}`,
    taxonID: taxonIdForSpecies(occurrence.species_id),
    scientificName: scientificNameForOccurrence(occurrence.com_species),
    occurrenceStatus: 'present',
    organismQuantity: quantity.organismQuantity,
    organismQuantityType: quantity.organismQuantityType,
    identificationQualifier: toMaybeMeaningful(occurrence.id_status),
    occurrenceRemarks,
  }
}

const NOW_LS_MEASUREMENT_MAPPINGS: Array<{
  field: keyof OccurrenceForExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
}> = [
  { field: 'nis', measurementType: 'number of identified specimens', measurementUnit: '', measurementMethod: '' },
  { field: 'pct', measurementType: 'percentage', measurementUnit: '%', measurementMethod: '' },
  { field: 'quad', measurementType: 'quadrat count', measurementUnit: '', measurementMethod: '' },
  { field: 'mni', measurementType: 'minimum number of individuals', measurementUnit: '', measurementMethod: '' },
  { field: 'body_mass', measurementType: 'occurrence body mass', measurementUnit: 'g', measurementMethod: '' },
  { field: 'mesowear', measurementType: 'occurrence mesowear', measurementUnit: '', measurementMethod: '' },
  {
    field: 'mw_or_high',
    measurementType: 'occurrence mesowear high occlusal relief',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'mw_or_low',
    measurementType: 'occurrence mesowear low occlusal relief',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'mw_cs_sharp',
    measurementType: 'occurrence mesowear sharp cusp shape',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'mw_cs_round',
    measurementType: 'occurrence mesowear round cusp shape',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'mw_cs_blunt',
    measurementType: 'occurrence mesowear blunt cusp shape',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'mw_scale_min',
    measurementType: 'occurrence mesowear scale minimum',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'mw_scale_max',
    measurementType: 'occurrence mesowear scale maximum',
    measurementUnit: '',
    measurementMethod: '',
  },
  { field: 'mw_value', measurementType: 'occurrence mesowear value', measurementUnit: '', measurementMethod: '' },
  { field: 'microwear', measurementType: 'occurrence microwear', measurementUnit: '', measurementMethod: '' },
  {
    field: 'dc13_mean',
    measurementType: 'occurrence delta C13 mean',
    measurementUnit: 'per mille',
    measurementMethod: '',
  },
  { field: 'dc13_n', measurementType: 'occurrence delta C13 sample count', measurementUnit: '', measurementMethod: '' },
  {
    field: 'dc13_max',
    measurementType: 'occurrence delta C13 maximum',
    measurementUnit: 'per mille',
    measurementMethod: '',
  },
  {
    field: 'dc13_min',
    measurementType: 'occurrence delta C13 minimum',
    measurementUnit: 'per mille',
    measurementMethod: '',
  },
  {
    field: 'dc13_stdev',
    measurementType: 'occurrence delta C13 standard deviation',
    measurementUnit: '',
    measurementMethod: '',
  },
  {
    field: 'do18_mean',
    measurementType: 'occurrence delta O18 mean',
    measurementUnit: 'per mille',
    measurementMethod: '',
  },
  { field: 'do18_n', measurementType: 'occurrence delta O18 sample count', measurementUnit: '', measurementMethod: '' },
  {
    field: 'do18_max',
    measurementType: 'occurrence delta O18 maximum',
    measurementUnit: 'per mille',
    measurementMethod: '',
  },
  {
    field: 'do18_min',
    measurementType: 'occurrence delta O18 minimum',
    measurementUnit: 'per mille',
    measurementMethod: '',
  },
  {
    field: 'do18_stdev',
    measurementType: 'occurrence delta O18 standard deviation',
    measurementUnit: '',
    measurementMethod: '',
  },
]

export const mapOccurrenceToMeasurementRows = (occurrence: OccurrenceForExport): MeasurementCsvRow[] => {
  const occurrenceID = occurrenceIdForRow(occurrence.lid, occurrence.species_id)

  return NOW_LS_MEASUREMENT_MAPPINGS.flatMap(mapping => {
    const rawValue = occurrence[mapping.field]
    if (rawValue === null || rawValue === undefined) return []
    if (typeof rawValue === 'string' && !isMeaningfulString(rawValue)) return []

    const measurementValue = toDwcString(rawValue).trim()
    if (!measurementValue) return []

    const verbatimMeasurementType = `now_ls.${mapping.field.toString()}`
    return [
      {
        taxonID: occurrenceID,
        measurementID: `${occurrenceID}:${verbatimMeasurementType}`,
        parentMeasurementID: '',
        measurementType: mapping.measurementType,
        verbatimMeasurementType,
        measurementValue,
        measurementUnit: mapping.measurementUnit,
        measurementMethod: mapping.measurementMethod,
      },
    ]
  })
}

const uniqueBy = <T>(rows: T[], keyFn: (row: T) => string): T[] => {
  const byKey = new Map<string, T>()
  for (const row of rows) {
    const key = keyFn(row)
    if (!byKey.has(key)) byKey.set(key, row)
  }
  return [...byKey.values()]
}

const DWC_TERMS = {
  occurrence: {
    rowType: 'http://rs.tdwg.org/dwc/terms/Occurrence',
    occurrenceID: 'http://rs.tdwg.org/dwc/terms/occurrenceID',
    locationID: 'http://rs.tdwg.org/dwc/terms/locationID',
    taxonID: 'http://rs.tdwg.org/dwc/terms/taxonID',
    scientificName: 'http://rs.tdwg.org/dwc/terms/scientificName',
    occurrenceStatus: 'http://rs.tdwg.org/dwc/terms/occurrenceStatus',
    organismQuantity: 'http://rs.tdwg.org/dwc/terms/organismQuantity',
    organismQuantityType: 'http://rs.tdwg.org/dwc/terms/organismQuantityType',
    identificationQualifier: 'http://rs.tdwg.org/dwc/terms/identificationQualifier',
    occurrenceRemarks: 'http://rs.tdwg.org/dwc/terms/occurrenceRemarks',
  },
  measurement: {
    rowType: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    taxonID: 'http://rs.tdwg.org/dwc/terms/occurrenceID',
    measurementID: 'http://rs.tdwg.org/dwc/terms/measurementID',
    parentMeasurementID: 'http://rs.tdwg.org/dwc/terms/parentMeasurementID',
    measurementType: 'http://rs.tdwg.org/dwc/terms/measurementType',
    verbatimMeasurementType: 'http://rs.tdwg.org/dwc/terms/verbatimMeasurementType',
    measurementValue: 'http://rs.tdwg.org/dwc/terms/measurementValue',
    measurementUnit: 'http://rs.tdwg.org/dwc/terms/measurementUnit',
    measurementMethod: 'http://rs.tdwg.org/dwc/terms/measurementMethod',
  },
} as const

export const buildOccurrenceMetaXml = (): string => {
  const occurrenceFields = OCCURRENCE_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.occurrence as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  const measurementFields = MEASUREMENT_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.measurement as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<archive xmlns="http://rs.tdwg.org/dwc/text/" metadata="eml.xml">
  <core encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy='"' ignoreHeaderLines="1" rowType="${DWC_TERMS.occurrence.rowType}">
    <files>
      <location>occurrence.csv</location>
    </files>
    <id index="0" />
${occurrenceFields}
  </core>
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

export const buildOccurrenceEmlXml = (publicationDateIso: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eml:eml
  xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  packageId="nowdatabase-dwc-occurrence-test-export"
  system="nowdatabase"
  xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 https://eml.ecoinformatics.org/eml-2.1.1/eml.xsd"
>
  <!-- TODO(#1150): Replace placeholder metadata with real dataset-level EML generation. -->
  <dataset>
    <title>NOW database Darwin Core test export (occurrences)</title>
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
      <para>Admin-only test Darwin Core Archive export for occurrence records from now_ls. Location and taxon lookup files are included with the same structures as the locality and taxon exports.</para>
    </abstract>
    <intellectualRights>
      <para>TODO(#1150): Add rights / license information.</para>
    </intellectualRights>
  </dataset>
</eml:eml>
`
}

export const buildDwcOccurrenceArchiveZipBufferFromOccurrences = async (
  occurrences: OccurrenceForExport[]
): Promise<Buffer> => {
  const localities = uniqueBy(
    occurrences.map(occurrence => occurrence.now_loc),
    locality => locality.lid.toString()
  )
  const speciesRows = uniqueBy(
    occurrences.map(occurrence => occurrence.com_species),
    species => species.species_id.toString()
  )

  const locationCsv = await writeCsvString([...LOCATION_HEADERS], localities.map(mapLocalityToLocationRow))
  const geologicalContextCsv = await writeCsvString(
    [...GEOLOGICAL_CONTEXT_HEADERS],
    localities.map(mapLocalityToGeologicalContextRow)
  )
  const taxonCsv = await writeCsvString([...TAXON_HEADERS], speciesRows.map(mapSpeciesToTaxonRow))
  const occurrenceCsv = await writeCsvString([...OCCURRENCE_HEADERS], occurrences.map(mapOccurrenceToOccurrenceRow))
  const measurementCsv = await writeCsvString(
    [...MEASUREMENT_HEADERS],
    occurrences.flatMap(mapOccurrenceToMeasurementRows)
  )
  const metaXml = buildOccurrenceMetaXml()
  const emlXml = buildOccurrenceEmlXml(new Date().toISOString().slice(0, 10))

  const zip = new JSZip()
  zip.file('location.csv', locationCsv)
  zip.file('geologicalcontext.csv', geologicalContextCsv)
  zip.file('taxon.csv', taxonCsv)
  zip.file('occurrence.csv', occurrenceCsv)
  zip.file('measurementorfact.csv', measurementCsv)
  zip.file('meta.xml', metaXml)
  zip.file('eml.xml', emlXml)

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

export const buildDwcOccurrenceArchiveZipBuffer = async (): Promise<Buffer> => {
  const { nowDb } = await import('../utils/db')
  const occurrences = await nowDb.now_ls.findMany({
    select: {
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
      now_loc: {
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
          now_syn_loc: { select: { synonym: true } },
          now_ss: { select: { sed_struct: true } },
          now_coll_meth: { select: { coll_meth: true } },
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
        },
      },
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
    },
  })

  return await buildDwcOccurrenceArchiveZipBufferFromOccurrences(occurrences as unknown as OccurrenceForExport[])
}
