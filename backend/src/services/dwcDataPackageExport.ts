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
  type DwcOccurrenceKey,
  type OccurrenceCsvRow,
} from './dwcArchiveExportOccurrences'
import { buildDwcArchiveZipBuffer, resolveTaxonRank, type MeasurementCsvRow } from './dwcArchiveExport'
import { writeDwcCsvString } from './utils/dwcCsv'
import {
  DATASET_CREATOR,
  DATASET_DOI,
  DATASET_LICENSE_TITLE,
  DATASET_LICENSE_URL,
  DATASET_NAME,
  DATASET_TITLE,
  DATASET_VERSION,
  MISSING_VALUE,
} from './dwcMetadata'

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

const LOOKUP_EXPORT_CHUNK_SIZE = 1000

const chunk = <T>(values: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }
  return chunks
}

const sortOccurrenceKeys = (occurrenceKeys: DwcOccurrenceKey[]): DwcOccurrenceKey[] => {
  return [...occurrenceKeys].sort((a, b) => a.lid - b.lid || a.speciesId - b.speciesId)
}

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
  const subfamilyRaw = toMaybeMeaningful(occurrence.com_species.subfamily_name)
  const subfamily = subfamilyRaw && subfamilyRaw.toLowerCase().endsWith('inae') ? subfamilyRaw : ''
  const tribe = subfamilyRaw && subfamilyRaw.toLowerCase().endsWith('ini') ? subfamilyRaw : ''
  const subtribe = subfamilyRaw && subfamilyRaw.toLowerCase().endsWith('ina') ? subfamilyRaw : ''

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
    taxonRank: resolveTaxonRank({
      family: toMaybeMeaningful(occurrence.com_species.family_name),
      genus: toMaybeMeaningful(occurrence.com_species.genus_name),
      specificEpithet: toMaybeMeaningful(occurrence.com_species.species_name),
      uniqueIdentifier: toMaybeMeaningful(occurrence.com_species.unique_identifier) || null,
      subclassOrSuperorderName: occurrence.com_species.subclass_or_superorder_name,
      subfamily,
      tribe,
      subtribe,
    }),
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

const FIELD_DESCRIPTIONS: Record<string, string> = {
  eventID: 'Stable NOW database event identifier for a paleontological locality.',
  parentEventID: 'Identifier for a containing event, reserved for future event hierarchies.',
  eventType: 'Type of event represented by the row; NOW localities are exported as paleontological locality events.',
  locationID: 'Stable NOW database location identifier for the locality.',
  locality: 'Locality name as curated in the NOW database.',
  continent: 'Continent inferred from the curated country value where possible.',
  country: 'Country or geographic area recorded for the locality.',
  stateProvince: 'State, province, or equivalent administrative subdivision.',
  county: 'County or equivalent lower administrative subdivision.',
  higherGeography: 'Pipe-delimited geographic hierarchy assembled from available NOW locality fields.',
  decimalLatitude:
    'Latitude in decimal degrees. Coordinates may be exact, generalized, rounded, or uncertain depending on source data.',
  decimalLongitude:
    'Longitude in decimal degrees. Coordinates may be exact, generalized, rounded, or uncertain depending on source data.',
  verbatimLatitude: 'Verbatim latitude expression when recorded.',
  verbatimLongitude: 'Verbatim longitude expression when recorded.',
  verbatimElevation: 'Verbatim or numeric elevation value from the curated locality record.',
  eventRemarks: 'Combined locality, age, and taxonomic remarks from curated NOW fields.',
  geologicalContextID: 'Stable identifier for the geological context associated with the locality event.',
  lithostratigraphicTerms:
    'Combined lithostratigraphic terminology from source-publication wording, standardized chronostratigraphic concepts, and NOW harmonization practices.',
  group: 'Lithostratigraphic group name where recorded.',
  formation: 'Lithostratigraphic formation name where recorded.',
  member: 'Lithostratigraphic member name where recorded.',
  bed: 'Lithostratigraphic bed name where recorded.',
  earliestAgeOrLowestStage: 'Earliest age or lowest chronostratigraphic stage associated with the locality.',
  latestAgeOrHighestStage: 'Latest age or highest chronostratigraphic stage associated with the locality.',
  occurrenceID: 'Stable NOW database occurrence identifier linking a locality event to a taxon record.',
  organismQuantity: 'Quantity or abundance value for the occurrence when recorded.',
  organismQuantityType: 'Type of quantity represented by organismQuantity.',
  occurrenceStatus: 'Presence or absence status for the occurrence.',
  occurrenceRemarks: 'Curated occurrence remarks from NOW locality-species data.',
  taxonID: 'Stable NOW taxon identifier; this joins to dwc-a-taxa/taxon.csv in the full export.',
  scientificName: 'Scientific name assembled from curated NOW taxonomic fields.',
  scientificNameAuthorship: 'Scientific name authorship where curated.',
  taxonRank: 'Taxonomic rank derived from curated NOW taxonomic fields when available.',
  identificationVerificationStatus: 'Curated identification status or qualifier.',
  assertionID: 'Stable assertion identifier derived from the source database field and owning event or occurrence.',
  verbatimAssertionType:
    'Original NOW database field name or curated source category that produced the assertion; approx_coord marks approximate coordinate information.',
  assertionType:
    'Human-readable assertion type. Future exports may add controlled predicate or ontology mappings without changing this column.',
  assertionTypeIRI: 'Placeholder for a future ontology IRI identifying the assertion type.',
  assertionTypeSource: 'Placeholder for the vocabulary or ontology source of assertionTypeIRI.',
  assertionMadeDate: 'Date the assertion was made when recorded; empty values mean not recorded.',
  assertionEffectiveDate:
    'Date or interval to which the assertion applies when recorded; empty values mean not recorded.',
  assertionValue: 'Curated or derived assertion value generated directly from NOW database fields.',
  assertionValueIRI: 'Placeholder for a future ontology IRI identifying the assertion value.',
  assertionValueSource: 'Placeholder for the vocabulary or ontology source of assertionValueIRI.',
  assertionValueNumeric: 'Numeric representation of assertionValue when the value can be parsed as a number.',
  assertionUnit: 'Unit associated with the assertion value when recorded.',
  assertionUnitIRI: 'Placeholder for a future ontology IRI identifying the assertion unit.',
  assertionUnitSource: 'Placeholder for the vocabulary or ontology source of assertionUnitIRI.',
  assertionError: 'Uncertainty or error associated with the assertion when recorded.',
  assertionBy: 'Agent responsible for the assertion when recorded; empty values mean not recorded.',
  assertionByID: 'Identifier for assertionBy, reserved for future agent-table interoperability.',
  assertionProtocols: 'Method, protocol, or source database mapping used to generate the assertion.',
  assertionProtocolID: 'Identifier for a protocol record, reserved for future protocol-table interoperability.',
  assertionReferences: 'Reference identifiers or citations supporting the assertion when recorded.',
  assertionRemarks: 'Additional assertion-level remarks when recorded.',
}

const DWC_TERM_IRIS: Record<string, string> = {
  eventID: 'http://rs.tdwg.org/dwc/terms/eventID',
  parentEventID: 'http://rs.tdwg.org/dwc/terms/parentEventID',
  eventType: 'http://rs.tdwg.org/dwc/terms/eventType',
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
  eventRemarks: 'http://rs.tdwg.org/dwc/terms/eventRemarks',
  geologicalContextID: 'http://rs.tdwg.org/dwc/terms/geologicalContextID',
  lithostratigraphicTerms: 'http://rs.tdwg.org/dwc/terms/lithostratigraphicTerms',
  group: 'http://rs.tdwg.org/dwc/terms/group',
  formation: 'http://rs.tdwg.org/dwc/terms/formation',
  member: 'http://rs.tdwg.org/dwc/terms/member',
  bed: 'http://rs.tdwg.org/dwc/terms/bed',
  earliestAgeOrLowestStage: 'http://rs.tdwg.org/dwc/terms/earliestAgeOrLowestStage',
  latestAgeOrHighestStage: 'http://rs.tdwg.org/dwc/terms/latestAgeOrHighestStage',
  occurrenceID: 'http://rs.tdwg.org/dwc/terms/occurrenceID',
  organismQuantity: 'http://rs.tdwg.org/dwc/terms/organismQuantity',
  organismQuantityType: 'http://rs.tdwg.org/dwc/terms/organismQuantityType',
  occurrenceStatus: 'http://rs.tdwg.org/dwc/terms/occurrenceStatus',
  occurrenceRemarks: 'http://rs.tdwg.org/dwc/terms/occurrenceRemarks',
  taxonID: 'http://rs.tdwg.org/dwc/terms/taxonID',
  scientificName: 'http://rs.tdwg.org/dwc/terms/scientificName',
  scientificNameAuthorship: 'http://rs.tdwg.org/dwc/terms/scientificNameAuthorship',
  taxonRank: 'http://rs.tdwg.org/dwc/terms/taxonRank',
  identificationVerificationStatus: 'http://rs.tdwg.org/dwc/terms/identificationVerificationStatus',
}

const fieldTitle = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, first => first.toUpperCase())

const field = (name: string, type = 'string') => ({
  name,
  title: fieldTitle(name),
  description: FIELD_DESCRIPTIONS[name] ?? `Curated NOW database value for ${name}.`,
  type,
  format: 'default',
  ...(DWC_TERM_IRIS[name] ? { 'dcterms:isVersionOf': DWC_TERM_IRIS[name] } : {}),
})

const schemaFor = ({
  headers,
  primaryKey,
  foreignKeys = [],
}: {
  headers: readonly string[]
  primaryKey: string | string[]
  foreignKeys?: Array<{
    fields: string
    predicate?: string
    reference: { resource: string; fields: string }
  }>
}) => ({
  fields: headers.map(header => field(header, header.endsWith('Numeric') ? 'number' : 'string')),
  primaryKey,
  missingValues: [MISSING_VALUE],
  foreignKeys,
})

export const buildDwcDataPackageJson = (publicationDateIso: string): string => {
  const dataPackage = {
    profile: 'http://rs.tdwg.org/dwc-dp/1.0/dwc-dp-profile.json',
    name: DATASET_NAME,
    id: DATASET_DOI,
    title: DATASET_TITLE,
    version: DATASET_VERSION,
    created: publicationDateIso,
    homepage: 'https://nowdatabase.org/',
    contributors: [
      { title: DATASET_CREATOR, role: 'creator' },
      { title: DATASET_CREATOR, role: 'publisher' },
      { title: DATASET_CREATOR, role: 'rightsHolder' },
    ],
    licenses: [
      {
        name: 'CC-BY-4.0',
        title: DATASET_LICENSE_TITLE,
        path: DATASET_LICENSE_URL,
      },
    ],
    keywords: [
      'Darwin Core',
      'Darwin Core Data Package',
      'Darwin Core Archive',
      'NOW database',
      'paleobiology',
      'paleontology',
      'fossil mammals',
      'Cenozoic',
      'occurrence data',
      'taxon traits',
    ],
    citation: `${DATASET_CREATOR}. ${DATASET_TITLE}, version ${DATASET_VERSION}. ${DATASET_DOI}. The DOI describes the NOW database generally rather than a single frozen export version; include the export date when citing a downloaded archive.`,
    description:
      'Production Darwin Core Data Package export from the NOW database for relational event, occurrence, geological context, and assertion data. The NOW database is a continuously curated, globally scoped fossil mammal database with Cenozoic emphasis, spanning approximately the last 66 million years.',
    missingValues: [MISSING_VALUE],
    resources: [
      {
        name: 'event',
        path: DWC_DP_TABLES.event,
        profile: 'tabular-data-resource',
        format: 'csv',
        mediatype: 'text/csv',
        description:
          'Paleontological locality events derived from curated NOW locality records. Event identifiers are stable database IDs and are referenced by occurrence rows.',
        schema: schemaFor({
          headers: DWC_DP_EVENT_HEADERS,
          primaryKey: 'eventID',
          foreignKeys: [
            {
              fields: 'geologicalContextID',
              predicate: 'has geological context',
              reference: { resource: 'geological-context', fields: 'geologicalContextID' },
            },
          ],
        }),
      },
      {
        name: 'geological-context',
        path: DWC_DP_TABLES.geologicalContext,
        profile: 'tabular-data-resource',
        format: 'csv',
        mediatype: 'text/csv',
        description:
          'Geological and chronostratigraphic context for NOW locality events, reflecting source-publication terminology, standardized chronostratigraphic concepts, and NOW harmonization practices.',
        schema: schemaFor({
          headers: DWC_DP_GEOLOGICAL_CONTEXT_HEADERS,
          primaryKey: 'geologicalContextID',
        }),
      },
      {
        name: 'occurrence',
        path: DWC_DP_TABLES.occurrence,
        profile: 'tabular-data-resource',
        format: 'csv',
        mediatype: 'text/csv',
        description:
          'Fossil mammal occurrence rows derived from curated NOW locality-species associations. occurrenceID is stable within the export and taxonID joins to the DwC-A taxon archive in the full bundle.',
        schema: schemaFor({
          headers: DWC_DP_OCCURRENCE_HEADERS,
          primaryKey: 'occurrenceID',
          foreignKeys: [
            {
              fields: 'eventID',
              predicate: 'happened during',
              reference: { resource: 'event', fields: 'eventID' },
            },
          ],
        }),
      },
      {
        name: 'event-assertion',
        path: DWC_DP_TABLES.eventAssertion,
        profile: 'tabular-data-resource',
        format: 'csv',
        mediatype: 'text/csv',
        description:
          'Provenance-aware curated or derived statements associated with locality events. Assertion values are generated directly from curated NOW database fields whose content originates from expert-curated literature data or opinions; empty provenance fields should be read as not recorded.',
        schema: schemaFor({
          headers: DWC_DP_EVENT_ASSERTION_HEADERS,
          primaryKey: 'assertionID',
          foreignKeys: [
            {
              fields: 'eventID',
              predicate: 'asserts about',
              reference: { resource: 'event', fields: 'eventID' },
            },
          ],
        }),
      },
      {
        name: 'occurrence-assertion',
        path: DWC_DP_TABLES.occurrenceAssertion,
        profile: 'tabular-data-resource',
        format: 'csv',
        mediatype: 'text/csv',
        description:
          'Provenance-aware curated or derived statements associated with occurrences. Assertion columns include placeholders for future semantic predicates, ontology IRIs, agents, protocols, and richer provenance structures.',
        schema: schemaFor({
          headers: DWC_DP_OCCURRENCE_ASSERTION_HEADERS,
          primaryKey: 'assertionID',
          foreignKeys: [
            {
              fields: 'occurrenceID',
              predicate: 'asserts about',
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
  packageId="${DATASET_NAME}-dwc-dp-${DATASET_VERSION}"
  system="nowdatabase"
  xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 https://eml.ecoinformatics.org/eml-2.1.1/eml.xsd"
>
  <dataset>
    <title>${DATASET_TITLE}</title>
    <creator>
      <organizationName>${DATASET_CREATOR}</organizationName>
      <onlineUrl>https://nowdatabase.org/</onlineUrl>
    </creator>
    <metadataProvider>
      <organizationName>${DATASET_CREATOR}</organizationName>
      <onlineUrl>https://nowdatabase.org/</onlineUrl>
    </metadataProvider>
    <associatedParty>
      <organizationName>${DATASET_CREATOR}</organizationName>
      <role>publisher</role>
      <onlineUrl>https://nowdatabase.org/</onlineUrl>
    </associatedParty>
    <pubDate>${publicationDateIso}</pubDate>
    <language>eng</language>
    <series>NOW database Darwin Core export</series>
    <abstract>
      <para>The NOW database Darwin Core export is a production-quality Darwin Core Data Package for relational event, occurrence, geological context, and assertion data from the New and Old Worlds Database of Fossil Mammals. The NOW database is a continuously curated global fossil mammal database supporting large-scale paleobiological and paleontological research.</para>
      <para>The data are expert curated from literature and community expertise. The database spans approximately the last 66 million years, Cenozoic, while maintaining global coverage. This export is intended primarily for researchers downloading and analyzing data.</para>
    </abstract>
    <keywordSet>
      <keyword>Darwin Core Data Package</keyword>
      <keyword>Darwin Core Archive</keyword>
      <keyword>fossil mammals</keyword>
      <keyword>Cenozoic</keyword>
      <keyword>paleobiology</keyword>
      <keyword>paleontology</keyword>
      <keyword>occurrence data</keyword>
      <keyword>assertions</keyword>
      <keyword>taxon traits</keyword>
      <keywordThesaurus>NOW database export keywords</keywordThesaurus>
    </keywordSet>
    <additionalInfo>
      <para>Recommended citation: ${DATASET_CREATOR}. ${DATASET_TITLE}, version ${DATASET_VERSION}. ${DATASET_DOI}. The DOI describes the NOW database generally rather than a single frozen dataset export version; include the export date (${publicationDateIso}) when citing a downloaded archive.</para>
      <para>Missing values in CSV files are serialized as ${MISSING_VALUE}. Coordinate uncertainty is partially represented through assertions where verbatimAssertionType equals approx_coord.</para>
      <para>Future exports may populate ontology IRI, semantic predicate, agent, protocol, and richer provenance fields while preserving the current relational model and column names wherever possible.</para>
    </additionalInfo>
    <intellectualRights>
      <para>Copyright ${DATASET_CREATOR}. This export is licensed under ${DATASET_LICENSE_TITLE} (${DATASET_LICENSE_URL}). Users may share and adapt the data with appropriate attribution.</para>
    </intellectualRights>
    <distribution>
      <online>
        <url function="information">https://nowdatabase.org/</url>
      </online>
    </distribution>
    <coverage>
      <geographicCoverage>
        <geographicDescription>Global. Locality coordinates may be exact, generalized, rounded, or uncertain, depending on the source publication and curation history.</geographicDescription>
        <boundingCoordinates>
          <westBoundingCoordinate>-180</westBoundingCoordinate>
          <eastBoundingCoordinate>180</eastBoundingCoordinate>
          <northBoundingCoordinate>90</northBoundingCoordinate>
          <southBoundingCoordinate>-90</southBoundingCoordinate>
        </boundingCoordinates>
      </geographicCoverage>
      <temporalCoverage>
        <singleDateTime>
          <alternativeTimeScale>
            <timeScaleName>Geologic time</timeScaleName>
            <timeScaleAgeEstimate>Cenozoic, approximately the last 66 million years</timeScaleAgeEstimate>
            <timeScaleAgeUncertainty>Chronological ranges vary by locality and source publication.</timeScaleAgeUncertainty>
            <timeScaleAgeExplanation>NOW locality ages combine source-publication terminology, standardized chronostratigraphic concepts, and NOW harmonization practices.</timeScaleAgeExplanation>
          </alternativeTimeScale>
        </singleDateTime>
      </temporalCoverage>
      <taxonomicCoverage>
        <generalTaxonomicCoverage>Global fossil mammal occurrences, with associated taxonomic names and selected synthesized taxon-level traits in the companion DwC-A taxon archive.</generalTaxonomicCoverage>
        <taxonomicClassification>
          <taxonRankName>class</taxonRankName>
          <taxonRankValue>Mammalia</taxonRankValue>
          <commonName>mammals</commonName>
        </taxonomicClassification>
      </taxonomicCoverage>
    </coverage>
    <maintenance>
      <description>
        <para>The NOW database is continuously curated. This export represents a production snapshot generated from the live curated database rather than a frozen version-specific dataset associated with the DOI.</para>
      </description>
      <maintenanceUpdateFrequency>continual</maintenanceUpdateFrequency>
    </maintenance>
    <contact>
      <organizationName>${DATASET_CREATOR}</organizationName>
      <onlineUrl>https://nowdatabase.org/</onlineUrl>
    </contact>
    <methods>
      <methodStep>
        <description>
          <para>Locality records are exported as Darwin Core event rows, associated geological context rows, and event-level assertions. Locality-species associations are exported as Darwin Core occurrence rows and occurrence-level assertions.</para>
        </description>
      </methodStep>
      <methodStep>
        <description>
          <para>Assertion tables are aligned with the emerging DwC-DP assertion model. Assertions are provenance-aware curated or derived statements associated with events or occurrences. They are generated directly from curated NOW database fields whose content originates from expert-curated literature data or opinions. When assertion provenance fields are empty, they should primarily be interpreted as not recorded.</para>
        </description>
      </methodStep>
      <methodStep>
        <description>
          <para>Geological and chronostratigraphic terminology uses mixed conventions: source-publication terminology, standardized chronostratigraphic concepts, and NOW harmonization practices.</para>
        </description>
      </methodStep>
      <qualityControl>
        <description>
          <para>NOW data are expert curated from the literature and continuously updated. Stable identifiers in this export are derived from NOW database identifiers and are intended for repeatable joins across the files in the downloaded archive.</para>
        </description>
      </qualityControl>
    </methods>
    <project>
      <title>New and Old Worlds Database of Fossil Mammals</title>
      <personnel>
        <organizationName>${DATASET_CREATOR}</organizationName>
        <role>data curator</role>
      </personnel>
      <abstract>
        <para>The NOW database supports research on Cenozoic mammal evolution, biogeography, environments, and fossil occurrence patterns at global scale.</para>
      </abstract>
    </project>
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
  zip.file(DWC_DP_TABLES.event, writeDwcCsvString(DWC_DP_EVENT_HEADERS, eventRows))
  zip.file(DWC_DP_TABLES.geologicalContext, writeDwcCsvString(DWC_DP_GEOLOGICAL_CONTEXT_HEADERS, geologicalContextRows))
  zip.file(DWC_DP_TABLES.occurrence, writeDwcCsvString(DWC_DP_OCCURRENCE_HEADERS, occurrenceRows))
  zip.file(DWC_DP_TABLES.eventAssertion, writeDwcCsvString(DWC_DP_EVENT_ASSERTION_HEADERS, eventAssertionRows))
  zip.file(
    DWC_DP_TABLES.occurrenceAssertion,
    writeDwcCsvString(DWC_DP_OCCURRENCE_ASSERTION_HEADERS, occurrenceAssertionRows)
  )
  zip.file(DWC_DP_TABLES.dataPackage, buildDwcDataPackageJson(publicationDateIso))
  zip.file(DWC_DP_TABLES.eml, buildDwcDataPackageEmlXml(publicationDateIso))

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

const fetchOccurrencesForDwcDataPackageExport = async (
  occurrenceKeys?: DwcOccurrenceKey[]
): Promise<OccurrenceForDwcDpExport[]> => {
  if (occurrenceKeys && occurrenceKeys.length === 0) return []
  const { nowDb } = await import('../utils/db')

  if (occurrenceKeys) {
    const occurrences: OccurrenceForDwcDpExport[] = []
    for (const keys of chunk(sortOccurrenceKeys(occurrenceKeys), LOOKUP_EXPORT_CHUNK_SIZE)) {
      const chunkOccurrences = await nowDb.now_ls.findMany({
        where: {
          OR: keys.map(key => ({
            lid: key.lid,
            species_id: key.speciesId,
          })),
        },
        orderBy: [{ lid: 'asc' }, { species_id: 'asc' }],
        select: occurrenceSelect,
      })
      occurrences.push(...(chunkOccurrences as unknown as OccurrenceForDwcDpExport[]))
    }
    return occurrences
  }

  const occurrences = await nowDb.now_ls.findMany({
    orderBy: [{ lid: 'asc' }, { species_id: 'asc' }],
    select: occurrenceSelect,
  })

  return occurrences as unknown as OccurrenceForDwcDpExport[]
}

export const buildDwcDataPackageZipBuffer = async (occurrenceKeys?: DwcOccurrenceKey[]): Promise<Buffer> => {
  const occurrences = await fetchOccurrencesForDwcDataPackageExport(occurrenceKeys)
  return await buildDwcDataPackageZipBufferFromOccurrences(occurrences, Boolean(occurrenceKeys))
}

const buildDwcDataPackageZipBufferFromOccurrences = async (
  occurrences: OccurrenceForDwcDpExport[],
  isFilteredExport: boolean
): Promise<Buffer> => {
  const { nowDb } = await import('../utils/db')
  const localityIds = isFilteredExport ? [...new Set(occurrences.map(occurrence => occurrence.lid))] : undefined
  const localities = (await nowDb.now_loc.findMany({
    where: isFilteredExport ? { lid: { in: localityIds } } : undefined,
    orderBy: { lid: 'asc' },
    select: localitySelect,
  })) as unknown as LocalityForDwcDpExport[]

  return await buildDwcDataPackageZipBufferFromRows({
    localities,
    occurrences,
  })
}

const addZipEntriesUnderPrefix = async ({
  sourceZipBuffer,
  targetZip,
  prefix,
}: {
  sourceZipBuffer: Buffer
  targetZip: JSZip
  prefix: string
}): Promise<void> => {
  const sourceZip = await JSZip.loadAsync(sourceZipBuffer)
  const files = Object.values(sourceZip.files).filter(file => !file.dir)

  await Promise.all(
    files.map(async file => {
      targetZip.file(`${prefix}/${file.name}`, await file.async('nodebuffer'))
    })
  )
}

const buildFullDarwinCoreReadme = (): string => `${DATASET_TITLE}
Version: ${DATASET_VERSION}
Package name: ${DATASET_NAME}
Creator / publisher / rights holder: ${DATASET_CREATOR}
License: ${DATASET_LICENSE_TITLE} (${DATASET_LICENSE_URL})
Identifier: ${DATASET_DOI}

This production export contains two separate standards-based Darwin Core
artifacts from the NOW database (New and Old Worlds Database of Fossil Mammals).
The outer ZIP is a convenience bundle, not a single DwC-DP or DwC-A artifact.
Each subdirectory should be treated as its own standards-based export.

Directory tree

.
|-- README.txt
|-- dwc-dp/
|   |-- datapackage.json
|   |-- eml.xml
|   |-- event.csv
|   |-- geological-context.csv
|   |-- occurrence.csv
|   |-- event-assertion.csv
|   \`-- occurrence-assertion.csv
\`-- dwc-a-taxa/
    |-- meta.xml
    |-- eml.xml
    |-- taxon.csv
    \`-- measurementorfact.csv

Scientific scope

The NOW database is a continuously curated global fossil mammal database. The
export is paleobiological and paleontological in scope, is expert curated from
literature and community expertise, and supports large-scale research on fossil
mammal occurrences, taxonomy, traits, environments, and geological context. The
database spans approximately the last 66 million years, Cenozoic, while
maintaining global coverage.

Relationship between DwC-DP and DwC-A

dwc-dp/ is a Darwin Core Data Package for relational event, occurrence,
geological context, and assertion data. It preserves the locality-to-occurrence
relationships in a table structure that is easier to analyze than a single
DwC-A star schema for this part of the database.

dwc-a-taxa/ is a Darwin Core Archive for taxonomic records and synthesized
taxon-level traits. Taxon-level traits remain in DwC-A Taxon +
MeasurementOrFact form because these values are generated directly from curated
taxon fields and are not currently linked to individual specimen, material
sample, event, or occurrence source entities. Keeping these traits in the
taxon-centered DwC-A preserves compatibility with existing DwC-A tooling and
existing consumers of the taxon trait export.

Join keys

- dwc-dp/event.csv eventID joins to dwc-dp/occurrence.csv eventID.
- dwc-dp/event.csv geologicalContextID joins to
  dwc-dp/geological-context.csv geologicalContextID.
- dwc-dp/event.csv eventID joins to dwc-dp/event-assertion.csv eventID.
- dwc-dp/occurrence.csv occurrenceID joins to
  dwc-dp/occurrence-assertion.csv occurrenceID.
- dwc-dp/occurrence.csv taxonID joins to dwc-a-taxa/taxon.csv taxonID.
- dwc-a-taxa/taxon.csv taxonID joins to
  dwc-a-taxa/measurementorfact.csv taxonID.

Identifier stability

Identifiers are stable database IDs derived from NOW database identifiers. They
are intended to support repeatable joins within and across downloaded exports.
They should not be interpreted as globally minted persistent identifiers unless
explicitly documented as such in future releases.

Assertions

Assertion tables are aligned with the emerging DwC-DP assertion model. They
represent provenance-aware curated or derived statements associated with events
or occurrences. Assertions are generated directly from curated database fields
whose content originates from expert-curated literature data or opinions. Empty
assertion provenance fields should primarily be interpreted as not recorded.

Geological context and coordinates

Geological and chronostratigraphic terminology uses mixed conventions:
source-publication terminology, standardized chronostratigraphic concepts, and
NOW harmonization practices. Coordinates may be exact, generalized, rounded, or
uncertain. Coordinate uncertainty is partially represented using assertions
where verbatimAssertionType is approx_coord.

Missing values

Missing values in CSV files are serialized as ${MISSING_VALUE}. Data Package
metadata also declares ${MISSING_VALUE} as the missing value marker. Treat empty
assertion provenance fields and other missing fields as not recorded unless a
field-specific description states otherwise.

Citation guidance

Recommended citation:
${DATASET_CREATOR}. ${DATASET_TITLE}, version ${DATASET_VERSION}. ${DATASET_DOI}.
Include the export download or generation date when citing a specific downloaded
archive.

The DOI ${DATASET_DOI} describes the NOW database generally rather than a single
frozen dataset export version.

Future interoperability

Several assertion columns are reserved for ontology IRIs, semantic predicates,
agent identifiers, protocol identifiers, and richer provenance structures. These
placeholders are included to support future semantic interoperability while
preserving the current CSV schemas, identifiers, and relational structure.
`

export const buildFullDarwinCoreExportZipBufferFromArchives = async ({
  dwcDataPackageZipBuffer,
  dwcTaxonArchiveZipBuffer,
}: {
  dwcDataPackageZipBuffer: Buffer
  dwcTaxonArchiveZipBuffer: Buffer
}): Promise<Buffer> => {
  const zip = new JSZip()
  zip.file('README.txt', buildFullDarwinCoreReadme())
  await addZipEntriesUnderPrefix({
    sourceZipBuffer: dwcDataPackageZipBuffer,
    targetZip: zip,
    prefix: 'dwc-dp',
  })
  await addZipEntriesUnderPrefix({
    sourceZipBuffer: dwcTaxonArchiveZipBuffer,
    targetZip: zip,
    prefix: 'dwc-a-taxa',
  })

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

export const buildFullDarwinCoreExportZipBuffer = async (occurrenceKeys?: DwcOccurrenceKey[]): Promise<Buffer> => {
  const occurrences = occurrenceKeys ? await fetchOccurrencesForDwcDataPackageExport(occurrenceKeys) : undefined
  const speciesIds = occurrences ? [...new Set(occurrences.map(occurrence => occurrence.species_id))] : undefined
  const [dwcDataPackageZipBuffer, dwcTaxonArchiveZipBuffer] = await Promise.all([
    occurrences ? buildDwcDataPackageZipBufferFromOccurrences(occurrences, true) : buildDwcDataPackageZipBuffer(),
    buildDwcArchiveZipBuffer(speciesIds),
  ])

  return await buildFullDarwinCoreExportZipBufferFromArchives({
    dwcDataPackageZipBuffer,
    dwcTaxonArchiveZipBuffer,
  })
}

export type DwcDpLocalityFixture = LocalityForDwcDpExport
export type DwcDpOccurrenceFixture = OccurrenceForDwcDpExport
