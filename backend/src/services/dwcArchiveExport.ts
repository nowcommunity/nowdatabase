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
      write(chunk: Buffer, _encoding, callback) {
        output += chunk.toString('utf8')
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

export const TAXON_HEADERS = [
  'taxonID',
  'scientificName',
  'scientificNameAuthorship',
  'vernacularName',
  'taxonRank',
  'taxonomicStatus',
  'class',
  'order',
  'family',
  'genus',
  'specificEpithet',
  'infraspecificEpithet',
  'higherClassification',
  'taxonRemarks',
  'taxonConceptID',
] as const

export type TaxonCsvHeader = (typeof TAXON_HEADERS)[number]
export type TaxonCsvRow = Record<TaxonCsvHeader, string>

type SpeciesForTaxonExport = Pick<
  Prisma.com_species,
  | 'species_id'
  | 'class_name'
  | 'subclass_or_superorder_name'
  | 'order_name'
  | 'suborder_or_superfamily_name'
  | 'family_name'
  | 'subfamily_name'
  | 'genus_name'
  | 'species_name'
  | 'unique_identifier'
  | 'taxonomic_status'
  | 'common_name'
  | 'sp_author'
  | 'sp_comment'
>

export const mapSpeciesToTaxonRow = (species: SpeciesForTaxonExport): TaxonCsvRow => {
  const genusName = isMeaningfulString(species.genus_name) ? species.genus_name.trim() : ''
  const speciesName = isMeaningfulString(species.species_name) ? species.species_name.trim() : ''
  const authorship = isMeaningfulString(species.sp_author) ? species.sp_author.trim() : ''

  const baseScientificName = [genusName, speciesName].filter(Boolean).join(' ').trim()
  const scientificName = [baseScientificName, authorship].filter(Boolean).join(' ').trim()

  const higherClassification = [
    species.class_name,
    species.subclass_or_superorder_name,
    species.order_name,
    species.suborder_or_superfamily_name,
    species.family_name,
    species.subfamily_name,
  ]
    .map(value => (isMeaningfulString(value) ? value.trim() : null))
    .filter((value): value is string => Boolean(value))
    .join('|')

  const infraspecificEpithet = isMeaningfulString(species.unique_identifier) ? species.unique_identifier.trim() : ''

  const taxonomicStatus = isMeaningfulString(species.taxonomic_status) ? species.taxonomic_status.trim() : 'accepted'

  return {
    taxonID: species.species_id.toString(),
    scientificName,
    scientificNameAuthorship: authorship,
    vernacularName: isMeaningfulString(species.common_name) ? species.common_name.trim() : '',
    // TODO(#1150): Validate rank from taxonomic fields (indet./gen./sp. cases).
    taxonRank: 'species',
    taxonomicStatus,
    class: isMeaningfulString(species.class_name) ? species.class_name.trim() : '',
    order: isMeaningfulString(species.order_name) ? species.order_name.trim() : '',
    family: isMeaningfulString(species.family_name) ? species.family_name.trim() : '',
    genus: genusName,
    specificEpithet: speciesName,
    infraspecificEpithet,
    higherClassification,
    taxonRemarks: isMeaningfulString(species.sp_comment) ? species.sp_comment.trim() : '',
    // TODO(#1150): Decide if any existing field should populate this.
    taxonConceptID: '',
  }
}

export const MEASUREMENT_HEADERS = [
  'taxonID',
  'measurementID',
  'measurementType',
  'verbatimMeasurementType',
  'measurementValue',
  'measurementUnit',
  'measurementMethod',
  'measurementRemarks',
] as const

export type MeasurementCsvHeader = (typeof MEASUREMENT_HEADERS)[number]
export type MeasurementCsvRow = Record<MeasurementCsvHeader, string>

type SpeciesForMeasurementExport = Pick<
  Prisma.com_species,
  | 'species_id'
  | 'body_mass'
  | 'brain_mass'
  | 'diet1'
  | 'diet2'
  | 'diet3'
  | 'diet_description'
  | 'locomo1'
  | 'locomo2'
  | 'locomo3'
  | 'activity'
  | 'crowntype'
  | 'microwear'
  | 'mesowear'
  | 'mw_value'
>

const MEASUREMENT_FIELD_MAPPINGS: Array<{
  field: keyof SpeciesForMeasurementExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
}> = [
  {
    field: 'body_mass',
    measurementType: 'body mass',
    measurementUnit: 'g',
    measurementMethod:
      'The average adult body mass estimated for the species, in grams. Where there is sexual dimorphism in size, put the mean of the two sexes here and record the masses per sex, if known, in the Comment field. Confidence intervals, if known, can also be put there.',
  },
  {
    field: 'brain_mass',
    measurementType: 'brain mass',
    measurementUnit: 'g',
    measurementMethod:
      'The average adult brain mass estimated for the species, in grams. Where there is sexual dimorphism in size, put the mean of the two sexes here and record the masses per sex, if known, in the Comment field. Confidence intervals, if known, can also be put there.',
  },
  {
    field: 'diet1',
    measurementType: 'diet category 1',
    measurementUnit: '',
    measurementMethod:
      'The predominant food type in the diet of the species, at the coarsest level of resolution: Animal, Plant, Omnivore. See also Diet 3, Diet 2, Relative Fiber Content, Selectivity, Food Processing Mode, Digestion.',
  },
  {
    field: 'diet2',
    measurementType: 'diet category 2',
    measurementUnit: '',
    measurementMethod:
      'The predominant food type in the diet of the species, at an intermediate level of resolution. See also Diet 1, Diet 3, Relative Fiber Content, Selectivity, Food Processing Mode, Digestion.',
  },
  {
    field: 'diet3',
    measurementType: 'diet category 3',
    measurementUnit: '',
    measurementMethod:
      'The predominant, or most important or most characteristic, food type in the diet of the species, at a detailed level of resolution. At this scale, the diets of many species will not be clearly distinguishable from one another using only a single term for the most common dietary component. Nevertheless, highly variable food-type categories often delineate distinct ecological/adaptive/functional types (as in the case of mixed browsing/grazing ungulates). That is, calling something a "frugivore" may not explicitly describe other components of its diet, some of which may be of adaptive importance to the species; it does not allow one to distinguish among species within the frugivore category, either. But it does allow one to place the species between omnivores or insectivores, on the one hand, and browsers, on the other.',
  },
  {
    field: 'diet_description',
    measurementType: 'diet description',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'locomo1',
    measurementType: 'locomotion 1',
    measurementUnit: '',
    measurementMethod:
      'The general substrate upon which locomotion characteristically takes place. These categories are the same as those in Feeding Habitat 1 and Shelter Habitat 1.',
  },
  {
    field: 'locomo2',
    measurementType: 'locomotion 2',
    measurementUnit: '',
    measurementMethod:
      'For non-aquatic, non-aerial species the terrestrial substrate upon which locomotion characteristically takes place. "Arboreal" describes species that almost never come to the ground, or, if they do, it is almost always for the purpose of dispersing to another tree or trees. "Scansorial" is a broad category including those species that habitually use both trees and the ground in their movements. At the non-arboreal extreme, it includes species that rarely in practice use the trees, but are not morphologically prevented from doing so. [This category may eventually have to be split to distinguish species that exhibit some arboreal adaptations (e.g., squirrels), from those that could climb in a limited way if they had to (e.g., lions).] "Surficial" refers to those creatures who use only the ground surface in locomotion (e.g., sauropods, wildebeeste).',
  },
  {
    field: 'locomo3',
    measurementType: 'locomotion 3',
    measurementUnit: '',
    measurementMethod:
      'The predominant mode of locomotor activity. [These categories are not necessarily complete at this time.] The categorization of flight locomotion in Locomotion 2 and Locomotion 3 is based on Norberg (1985).',
  },
  {
    field: 'activity',
    measurementType: 'activity',
    measurementUnit: '',
    measurementMethod:
      'The primary time of day during which the species was active. Choices are Diurnal, Crepuscular, or Nocturnal.',
  },
  {
    field: 'crowntype',
    measurementType: 'crown type',
    measurementUnit: '',
    measurementMethod:
      'This field describes the morphology of mammalian molar crowns, and is complimentary to the Tooth Shape - Multicuspid field. The latter presents a traditional classification of molar crown types (and other multicusped teeth) for vertebrates. Molar Crown Type, in contrast, uses a more recently developed classification scheme that is currently restricted to mammals. The scheme is phylogenetically neutral and descriptive, allowing functional interpretations and interpretations of underlying developmental mechanisms (see Jernvall, 1995). Currently, the values for the field consist of five-letter alphanumeric codes, described in Jernvall, et al. (1996), and the reader is referred to that paper for further explanation.',
  },
  {
    field: 'microwear',
    measurementType: 'microwear',
    measurementUnit: '',
    measurementMethod:
      "This field describes the kind of microwear (in terms of striations or pits) revealed by microscopic examination of the wear facets of the tooth crowns of the species. A considerable literature exists concerning the ways to infer aspects of a species' diet from patterns of microwear.",
  },
  {
    field: 'mesowear',
    measurementType: 'mesowear',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_value',
    measurementType: 'mesowear value',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
]

export const mapSpeciesToMeasurementRows = (species: SpeciesForMeasurementExport): MeasurementCsvRow[] => {
  const taxonID = species.species_id.toString()

  return MEASUREMENT_FIELD_MAPPINGS.flatMap(mapping => {
    if (mapping.field === 'species_id') return []
    const rawValue = species[mapping.field]
    if (rawValue === null || rawValue === undefined) return []

    if (typeof rawValue === 'string' && !isMeaningfulString(rawValue)) return []

    const measurementValue = toDwcString(rawValue).trim()
    if (!measurementValue) return []

    return [
      {
        taxonID,
        measurementID: `NOW:${taxonID}:${mapping.field.toString()}`,
        measurementType: mapping.measurementType,
        verbatimMeasurementType: mapping.field.toString(),
        measurementValue,
        measurementUnit: mapping.measurementUnit,
        measurementMethod: mapping.measurementMethod,
        measurementRemarks: '',
      },
    ]
  })
}

const DWC_TERMS = {
  taxon: {
    rowType: 'http://rs.tdwg.org/dwc/terms/Taxon',
    taxonID: 'http://rs.tdwg.org/dwc/terms/taxonID',
    scientificName: 'http://rs.tdwg.org/dwc/terms/scientificName',
    scientificNameAuthorship: 'http://rs.tdwg.org/dwc/terms/scientificNameAuthorship',
    vernacularName: 'http://rs.tdwg.org/dwc/terms/vernacularName',
    taxonRank: 'http://rs.tdwg.org/dwc/terms/taxonRank',
    taxonomicStatus: 'http://rs.tdwg.org/dwc/terms/taxonomicStatus',
    class: 'http://rs.tdwg.org/dwc/terms/class',
    order: 'http://rs.tdwg.org/dwc/terms/order',
    family: 'http://rs.tdwg.org/dwc/terms/family',
    genus: 'http://rs.tdwg.org/dwc/terms/genus',
    specificEpithet: 'http://rs.tdwg.org/dwc/terms/specificEpithet',
    infraspecificEpithet: 'http://rs.tdwg.org/dwc/terms/infraspecificEpithet',
    higherClassification: 'http://rs.tdwg.org/dwc/terms/higherClassification',
    taxonRemarks: 'http://rs.tdwg.org/dwc/terms/taxonRemarks',
    taxonConceptID: 'http://rs.tdwg.org/dwc/terms/taxonConceptID',
  },
  measurement: {
    rowType: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    taxonID: 'http://rs.tdwg.org/dwc/terms/taxonID',
    measurementID: 'http://rs.tdwg.org/dwc/terms/measurementID',
    measurementType: 'http://rs.tdwg.org/dwc/terms/measurementType',
    verbatimMeasurementType: 'http://rs.tdwg.org/dwc/terms/verbatimMeasurementType',
    measurementValue: 'http://rs.tdwg.org/dwc/terms/measurementValue',
    measurementUnit: 'http://rs.tdwg.org/dwc/terms/measurementUnit',
    measurementMethod: 'http://rs.tdwg.org/dwc/terms/measurementMethod',
    measurementRemarks: 'http://rs.tdwg.org/dwc/terms/measurementRemarks',
  },
} as const

export const buildMetaXml = (): string => {
  const taxonFields = TAXON_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.taxon as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  const measurementFields = MEASUREMENT_HEADERS.map((header, index) => {
    const term = (DWC_TERMS.measurement as Record<string, string>)[header]
    return `      <field index="${index}" term="${term}" />`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<archive xmlns="http://rs.tdwg.org/dwc/text/" metadata="eml.xml">
  <core encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy="\\"" ignoreHeaderLines="1" rowType="${DWC_TERMS.taxon.rowType}">
    <files>
      <location>taxon.csv</location>
    </files>
    <id index="0" />
${taxonFields}
  </core>
  <extension encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy="\\"" ignoreHeaderLines="1" rowType="${DWC_TERMS.measurement.rowType}">
    <files>
      <location>measurementorfact.csv</location>
    </files>
    <coreid index="0" />
${measurementFields}
  </extension>
</archive>
`
}

export const buildEmlXml = (publicationDateIso: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eml:eml
  xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  packageId="nowdatabase-dwc-test-export"
  system="nowdatabase"
  xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 https://eml.ecoinformatics.org/eml-2.1.1/eml.xsd"
>
  <!-- TODO(#1150): Replace placeholder metadata with real dataset-level EML generation. -->
  <dataset>
    <title>NOW database Darwin Core test export</title>
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
      <para>Admin-only test Darwin Core Archive export from NOW database. Field mappings are intentionally limited for v1.</para>
    </abstract>
    <intellectualRights>
      <para>TODO(#1150): Add rights / license information.</para>
    </intellectualRights>
  </dataset>
</eml:eml>
`
}

export const buildDwcArchiveZipBufferFromSpecies = async (
  speciesRows: Array<SpeciesForTaxonExport & SpeciesForMeasurementExport>
): Promise<Buffer> => {
  const taxonRows = speciesRows.map(mapSpeciesToTaxonRow)
  const measurementRows = speciesRows.flatMap(mapSpeciesToMeasurementRows)

  const taxonCsv = await writeCsvString([...TAXON_HEADERS], taxonRows)
  const measurementCsv = await writeCsvString([...MEASUREMENT_HEADERS], measurementRows)
  const metaXml = buildMetaXml()
  const publicationDateIso = new Date().toISOString().slice(0, 10)
  const emlXml = buildEmlXml(publicationDateIso)

  const zip = new JSZip()
  zip.file('taxon.csv', taxonCsv)
  zip.file('measurementorfact.csv', measurementCsv)
  zip.file('meta.xml', metaXml)
  zip.file('eml.xml', emlXml)

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

export const fetchSpeciesForDwcExport = async (): Promise<
  Array<SpeciesForTaxonExport & SpeciesForMeasurementExport>
> => {
  const { nowDb } = await import('../utils/db')
  // NOTE: v1 intentionally exports only com_species rows as taxa.
  // TODO(#1150): Add synonym export from com_taxa_synonym.
  return await nowDb.com_species.findMany({
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
      body_mass: true,
      brain_mass: true,
      diet1: true,
      diet2: true,
      diet3: true,
      diet_description: true,
      locomo1: true,
      locomo2: true,
      locomo3: true,
      activity: true,
      crowntype: true,
      microwear: true,
      mesowear: true,
      mw_value: true,
    },
  })
}

export const buildDwcArchiveZipBuffer = async (): Promise<Buffer> => {
  const speciesRows = await fetchSpeciesForDwcExport()
  return await buildDwcArchiveZipBufferFromSpecies(speciesRows)
}
