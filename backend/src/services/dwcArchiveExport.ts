import Prisma from '../../prisma/generated/now_test_client'
import JSZip from 'jszip'
import { toDwcCsvString, writeDwcCsvString } from './utils/dwcCsv'
import { getFieldInfoText } from '../../../frontend/src/shared/fieldInfo'

const DATASET_TITLE = 'NOW database Darwin Core export'
const DATASET_NAME = 'now-darwincore-export'
const DATASET_VERSION = '1.0.0'
const DATASET_DOI = 'https://doi.org/10.5281/zenodo.4268068'
const DATASET_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/'
const DATASET_LICENSE_TITLE = 'Creative Commons Attribution 4.0 International'
const DATASET_CREATOR = 'The NOW Community'
const MISSING_VALUE = '\\N'

const isMeaningfulString = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed === '-') return false
  return true
}

const toDwcString = toDwcCsvString

export const TAXON_HEADERS = [
  'taxonID',
  'nomenclaturalCode',
  'scientificName',
  'genericName',
  'scientificNameAuthorship',
  'vernacularName',
  'taxonRank',
  'taxonomicStatus',
  'kingdom',
  'phylum',
  'class',
  'order',
  'superfamily',
  'family',
  'subfamily',
  'tribe',
  'subtribe',
  'genus',
  'specificEpithet',
  'infraspecificEpithet',
  'higherClassification',
  'taxonRemarks',
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

const endsWithSuffix = (value: string | null, suffix: string): boolean => {
  if (!isMeaningfulString(value)) return false
  return value.trim().toLowerCase().endsWith(suffix.toLowerCase())
}

const isMeaningfulTaxonName = (value: string | null): boolean => {
  if (!isMeaningfulString(value)) return false
  const trimmed = value.trim()
  if (trimmed.includes(' ')) return false
  if (trimmed.includes('.')) return false
  return true
}

const isSingleLowercaseWord = (value: string | null): boolean => {
  if (!isMeaningfulString(value)) return false
  const trimmed = value.trim()
  return /^[a-z]+$/.test(trimmed)
}

const isSinglePropercaseWord = (value: string | null): boolean => {
  if (!isMeaningfulString(value)) return false
  const trimmed = value.trim()
  return /^[A-Z][a-z]+$/.test(trimmed)
}

const isSpeciesSp = (value: string): boolean => /^sp\.?$/i.test(value.trim())

const includesIndet = (value: string): boolean => value.toLowerCase().includes('indet.')

export const resolveTaxonRank = ({
  family,
  genus,
  specificEpithet,
  uniqueIdentifier,
  subclassOrSuperorderName,
  subfamily,
  tribe,
  subtribe,
}: {
  family: string
  genus: string
  specificEpithet: string
  uniqueIdentifier: string | null
  subclassOrSuperorderName: string | null
  subfamily: string
  tribe: string
  subtribe: string
}): string => {
  const genusIsPropercaseWord = isSinglePropercaseWord(genus)
  const specificEpithetIsLowercaseWord = isSingleLowercaseWord(specificEpithet)
  const uniqueIdentifierIsSingleLowercaseWord = isSingleLowercaseWord(uniqueIdentifier)

  // IMPORTANT: Rule order matters; implement in the exact execution order requested.
  if (uniqueIdentifierIsSingleLowercaseWord && specificEpithetIsLowercaseWord && genusIsPropercaseWord) {
    return 'subspecies'
  }

  if (isSpeciesSp(specificEpithet) && genusIsPropercaseWord) return 'species'

  if (uniqueIdentifier === '-' && specificEpithetIsLowercaseWord && genusIsPropercaseWord) return 'species'

  if (uniqueIdentifier !== null && specificEpithetIsLowercaseWord && genusIsPropercaseWord) return 'species'

  if (includesIndet(specificEpithet) && genusIsPropercaseWord) return 'genus'

  if (includesIndet(genus)) {
    if (subtribe) return 'subtribe'
    if (tribe) return 'tribe'
    if (subfamily) return 'subfamily'

    const familyTrimmed = family.trim()
    const isIncertaeSedis = familyTrimmed.toLowerCase() === 'incertae sedis'
    const endsWithIdae = endsWithSuffix(familyTrimmed, 'idae')
    if (!isMeaningfulString(subclassOrSuperorderName) && (endsWithIdae || isIncertaeSedis)) return 'family'
  }

  if (includesIndet(family)) return 'order'

  return 'species'
}

export const mapSpeciesToTaxonRow = (species: SpeciesForTaxonExport): TaxonCsvRow => {
  const genusName = isMeaningfulString(species.genus_name) ? species.genus_name.trim() : ''
  const speciesName = isMeaningfulString(species.species_name) ? species.species_name.trim() : ''
  const authorship = isMeaningfulString(species.sp_author) ? species.sp_author.trim() : ''

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

  const superfamily = endsWithSuffix(species.subclass_or_superorder_name, 'oidea')
    ? species.subclass_or_superorder_name!.trim()
    : ''

  const subfamilyRaw = isMeaningfulString(species.subfamily_name) ? species.subfamily_name.trim() : ''
  const subfamily = subfamilyRaw && subfamilyRaw.toLowerCase().endsWith('inae') ? subfamilyRaw : ''
  const tribe = subfamilyRaw && subfamilyRaw.toLowerCase().endsWith('ini') ? subfamilyRaw : ''
  const subtribe = subfamilyRaw && subfamilyRaw.toLowerCase().endsWith('ina') ? subfamilyRaw : ''

  const genericName = isMeaningfulTaxonName(speciesName) ? genusName : ''

  const taxonRank = resolveTaxonRank({
    family: isMeaningfulString(species.family_name) ? species.family_name.trim() : '',
    genus: genusName,
    specificEpithet: speciesName,
    uniqueIdentifier: isMeaningfulString(species.unique_identifier) ? species.unique_identifier.trim() : null,
    subfamily,
    tribe,
    subtribe,
    subclassOrSuperorderName: species.subclass_or_superorder_name,
  })

  const scientificName = (() => {
    const familyName = isMeaningfulString(species.family_name) ? species.family_name.trim() : ''
    const orderName = isMeaningfulString(species.order_name) ? species.order_name.trim() : ''
    const className = isMeaningfulString(species.class_name) ? species.class_name.trim() : ''

    switch (taxonRank) {
      case 'subspecies':
        return [genusName, speciesName, infraspecificEpithet, authorship].filter(Boolean).join(' ').trim()
      case 'species':
        return [genusName, speciesName, authorship].filter(Boolean).join(' ').trim()
      case 'genus':
        return [genusName, authorship].filter(Boolean).join(' ').trim()
      case 'family':
        return familyName
      case 'superfamily':
        return superfamily
      case 'subfamily':
        return subfamily
      case 'tribe':
        return tribe
      case 'subtribe':
        return subtribe
      case 'order':
        return orderName
      case 'class':
        return className
      default:
        return [genusName, speciesName, authorship].filter(Boolean).join(' ').trim()
    }
  })()

  return {
    taxonID: `NOW:${species.species_id}`,
    nomenclaturalCode: 'ICZN',
    scientificName,
    genericName,
    scientificNameAuthorship: authorship,
    vernacularName: isMeaningfulString(species.common_name) ? species.common_name.trim() : '',
    taxonRank,
    taxonomicStatus,
    kingdom: 'Animalia',
    phylum: 'Chordata',
    class: isMeaningfulString(species.class_name) ? species.class_name.trim() : '',
    order: isMeaningfulString(species.order_name) ? species.order_name.trim() : '',
    superfamily,
    family: isMeaningfulString(species.family_name) ? species.family_name.trim() : '',
    subfamily,
    tribe,
    subtribe,
    genus: genusName,
    specificEpithet: speciesName,
    infraspecificEpithet,
    higherClassification,
    taxonRemarks: isMeaningfulString(species.sp_comment) ? species.sp_comment.trim() : '',
  }
}

export const MEASUREMENT_HEADERS = [
  'taxonID',
  'measurementID',
  'parentMeasurementID',
  'measurementType',
  'verbatimMeasurementType',
  'measurementValue',
  'measurementUnit',
  'measurementMethod',
] as const

export type MeasurementCsvHeader = (typeof MEASUREMENT_HEADERS)[number]
export type MeasurementCsvRow = Record<MeasurementCsvHeader, string>

type SpeciesForMeasurementExport = Pick<
  Prisma.com_species,
  | 'species_id'
  | 'strain'
  | 'gene'
  | 'taxon_status'
  | 'body_mass'
  | 'brain_mass'
  | 'sv_length'
  | 'sd_size'
  | 'sd_display'
  | 'tshm'
  | 'symph_mob'
  | 'relative_blade_length'
  | 'tht'
  | 'diet1'
  | 'diet2'
  | 'diet3'
  | 'diet_description'
  | 'rel_fib'
  | 'selectivity'
  | 'digestion'
  | 'feedinghab1'
  | 'feedinghab2'
  | 'shelterhab1'
  | 'shelterhab2'
  | 'locomo1'
  | 'locomo2'
  | 'locomo3'
  | 'hunt_forage'
  | 'activity'
  | 'crowntype'
  | 'microwear'
  | 'horizodonty'
  | 'cusp_shape'
  | 'cusp_count_buccal'
  | 'cusp_count_lingual'
  | 'loph_count_lon'
  | 'loph_count_trs'
  | 'fct_al'
  | 'fct_ol'
  | 'fct_sf'
  | 'fct_ot'
  | 'fct_cm'
  | 'mesowear'
  | 'mw_or_high'
  | 'mw_or_low'
  | 'mw_cs_sharp'
  | 'mw_cs_round'
  | 'mw_cs_blunt'
  | 'mw_scale_min'
  | 'mw_scale_max'
  | 'mw_value'
  | 'pop_struc'
  | 'sp_status'
>

const isMeaningfulMeasurementValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') {
    return isMeaningfulString(value)
  }
  return true
}

const buildCrownTypeMeasurementId = (speciesId: number, kind: 'developmental_crown_type' | 'functional_crown_type') =>
  `NOW:${speciesId}:${kind}`

type CrownSegment = string | number | null | undefined

const mapCrownSegment = (segment: CrownSegment): string => {
  if (segment === null || segment === undefined || segment === '') {
    return '-'
  }

  return String(segment)
}

const formatDevelopmentalCrownType = (source: SpeciesForMeasurementExport): string => {
  return [
    source.cusp_shape,
    source.cusp_count_buccal,
    source.cusp_count_lingual,
    source.loph_count_lon,
    source.loph_count_trs,
  ]
    .map(mapCrownSegment)
    .join('')
}

const formatFunctionalCrownType = (source: SpeciesForMeasurementExport): string => {
  return [source.fct_al, source.fct_ol, source.fct_sf, source.fct_ot, source.fct_cm].map(mapCrownSegment).join('')
}

const getMeasurementMethod = (field: keyof SpeciesForMeasurementExport): string => getFieldInfoText(String(field)) ?? ''

const MEASUREMENT_FIELD_MAPPINGS: Array<{
  field: keyof SpeciesForMeasurementExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
  parentKind?: 'developmental_crown_type' | 'functional_crown_type'
}> = [
  // NOTE: In v1, measurementMethod is populated from the Pantheria VSP manual where available:
  // https://www.pantherion.com/dbmanual97/VSP.html
  {
    field: 'strain',
    measurementType: 'strain',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'gene',
    measurementType: 'gene',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'taxon_status',
    measurementType: 'taxon status',
    measurementUnit: '',
    // TODO(#1150): Add field description / controlled vocabulary.
    measurementMethod: '',
  },
  {
    field: 'body_mass',
    measurementType: 'body mass',
    measurementUnit: 'g',
    measurementMethod: getMeasurementMethod('body_mass'),
  },
  {
    field: 'brain_mass',
    measurementType: 'brain mass',
    measurementUnit: 'g',
    measurementMethod: getMeasurementMethod('brain_mass'),
  },
  {
    field: 'sv_length',
    measurementType: 'snout-vent length',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('sv_length'),
  },
  {
    field: 'sd_size',
    measurementType: 'sexual dimorphism - size',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('sd_size'),
  },
  {
    field: 'sd_display',
    measurementType: 'sexual dimorphism - display',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('sd_display'),
  },
  {
    field: 'tshm',
    measurementType: 'tooth shape -- multicuspid',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('tshm'),
  },
  {
    field: 'symph_mob',
    measurementType: 'symphyseal mobility',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('symph_mob'),
  },
  {
    field: 'relative_blade_length',
    measurementType: 'relative blade length',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'tht',
    measurementType: 'tooth height',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('tht'),
  },
  {
    field: 'diet1',
    measurementType: 'diet category 1',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('diet1'),
  },
  {
    field: 'diet2',
    measurementType: 'diet category 2',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('diet2'),
  },
  {
    field: 'diet3',
    measurementType: 'diet category 3',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('diet3'),
  },
  {
    field: 'diet_description',
    measurementType: 'diet description',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'rel_fib',
    measurementType: 'relative fiber content',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('rel_fib'),
  },
  {
    field: 'selectivity',
    measurementType: 'selectivity',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('selectivity'),
  },
  {
    field: 'digestion',
    measurementType: 'digestion',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('digestion'),
  },
  {
    field: 'feedinghab1',
    measurementType: 'feeding habitat 1',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('feedinghab1'),
  },
  {
    field: 'feedinghab2',
    measurementType: 'feeding habitat 2',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('feedinghab2'),
  },
  {
    field: 'shelterhab1',
    measurementType: 'shelter habitat 1',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('shelterhab1'),
  },
  {
    field: 'shelterhab2',
    measurementType: 'shelter habitat 2',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('shelterhab2'),
  },
  {
    field: 'locomo1',
    measurementType: 'locomotion 1',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('locomo1'),
  },
  {
    field: 'locomo2',
    measurementType: 'locomotion 2',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('locomo2'),
  },
  {
    field: 'locomo3',
    measurementType: 'locomotion 3',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('locomo3'),
  },
  {
    field: 'hunt_forage',
    measurementType: 'hunt/forage',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('hunt_forage'),
  },
  {
    field: 'activity',
    measurementType: 'activity',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('activity'),
  },
  {
    field: 'crowntype',
    measurementType: 'crown type',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('crowntype'),
  },
  {
    field: 'microwear',
    measurementType: 'microwear',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('microwear'),
  },
  {
    field: 'horizodonty',
    measurementType: 'horizodonty',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'cusp_shape',
    measurementType: 'cusp shape',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'developmental_crown_type',
  },
  {
    field: 'cusp_count_buccal',
    measurementType: 'cusp count (buccal)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'developmental_crown_type',
  },
  {
    field: 'cusp_count_lingual',
    measurementType: 'cusp count (lingual)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'developmental_crown_type',
  },
  {
    field: 'loph_count_lon',
    measurementType: 'loph count (longitudinal)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'developmental_crown_type',
  },
  {
    field: 'loph_count_trs',
    measurementType: 'loph count (transverse)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'developmental_crown_type',
  },
  {
    field: 'fct_al',
    measurementType: 'functional crown type (AL)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'functional_crown_type',
  },
  {
    field: 'fct_ol',
    measurementType: 'functional crown type (OL)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'functional_crown_type',
  },
  {
    field: 'fct_sf',
    measurementType: 'functional crown type (SF)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'functional_crown_type',
  },
  {
    field: 'fct_ot',
    measurementType: 'functional crown type (OT)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'functional_crown_type',
  },
  {
    field: 'fct_cm',
    measurementType: 'functional crown type (CM)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
    parentKind: 'functional_crown_type',
  },
  {
    field: 'mesowear',
    measurementType: 'mesowear',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_or_high',
    measurementType: 'cusp relief high (OR%)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_or_low',
    measurementType: 'cusp relief low (OR%)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_cs_sharp',
    measurementType: 'cusp shape sharp (CS%)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_cs_round',
    measurementType: 'cusp shape round (CS%)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_cs_blunt',
    measurementType: 'cusp shape blunt (CS%)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_scale_min',
    measurementType: 'mesowear scale min',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'mw_scale_max',
    measurementType: 'mesowear scale max',
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
  {
    field: 'pop_struc',
    measurementType: 'population structure',
    measurementUnit: '',
    measurementMethod: getMeasurementMethod('pop_struc'),
  },
  {
    field: 'sp_status',
    measurementType: 'species status',
    measurementUnit: '',
    // TODO(#1150): Add field description / meaning for NOW database usage.
    measurementMethod: '',
  },
]

export const mapSpeciesToMeasurementRows = (species: SpeciesForMeasurementExport): MeasurementCsvRow[] => {
  const taxonID = `NOW:${species.species_id}`
  const speciesId = species.species_id

  const developmentalSegments = [
    species.cusp_shape,
    species.cusp_count_buccal,
    species.cusp_count_lingual,
    species.loph_count_lon,
    species.loph_count_trs,
  ]
  const functionalSegments = [species.fct_al, species.fct_ol, species.fct_sf, species.fct_ot, species.fct_cm]

  const hasDevelopmentalCrownType = developmentalSegments.some(isMeaningfulMeasurementValue)
  const hasFunctionalCrownType = functionalSegments.some(isMeaningfulMeasurementValue)

  const parentIds = {
    developmental_crown_type: hasDevelopmentalCrownType
      ? buildCrownTypeMeasurementId(speciesId, 'developmental_crown_type')
      : '',
    functional_crown_type: hasFunctionalCrownType
      ? buildCrownTypeMeasurementId(speciesId, 'functional_crown_type')
      : '',
  } as const

  const calculatedRows: MeasurementCsvRow[] = []

  if (hasDevelopmentalCrownType) {
    calculatedRows.push({
      taxonID,
      measurementID: parentIds.developmental_crown_type,
      parentMeasurementID: '',
      measurementType: 'developmental crown type',
      verbatimMeasurementType: 'developmental_crown_type',
      measurementValue: formatDevelopmentalCrownType(species),
      measurementUnit: '',
      // TODO(#1150): Add field description / controlled vocabulary.
      measurementMethod: '',
    })
  }

  if (hasFunctionalCrownType) {
    calculatedRows.push({
      taxonID,
      measurementID: parentIds.functional_crown_type,
      parentMeasurementID: '',
      measurementType: 'functional crown type',
      verbatimMeasurementType: 'functional_crown_type',
      measurementValue: formatFunctionalCrownType(species),
      measurementUnit: '',
      // TODO(#1150): Add field description / controlled vocabulary.
      measurementMethod: '',
    })
  }

  const fieldRows = MEASUREMENT_FIELD_MAPPINGS.flatMap(mapping => {
    if (mapping.field === 'species_id') return []
    const rawValue = species[mapping.field]
    if (rawValue === null || rawValue === undefined) return []

    if (typeof rawValue === 'string' && !isMeaningfulString(rawValue)) return []

    const measurementValue = toDwcString(rawValue).trim()
    if (!measurementValue) return []

    return [
      {
        taxonID,
        measurementID: `NOW:${species.species_id}:${mapping.field.toString()}`,
        parentMeasurementID: mapping.parentKind ? parentIds[mapping.parentKind] : '',
        measurementType: mapping.measurementType,
        verbatimMeasurementType: mapping.field.toString(),
        measurementValue,
        measurementUnit: mapping.measurementUnit,
        measurementMethod: mapping.measurementMethod,
      },
    ]
  })

  return [...calculatedRows, ...fieldRows]
}

const DWC_TERMS = {
  taxon: {
    rowType: 'http://rs.tdwg.org/dwc/terms/Taxon',
    taxonID: 'http://rs.tdwg.org/dwc/terms/taxonID',
    nomenclaturalCode: 'http://rs.tdwg.org/dwc/terms/nomenclaturalCode',
    scientificName: 'http://rs.tdwg.org/dwc/terms/scientificName',
    genericName: 'http://rs.tdwg.org/dwc/terms/genericName',
    scientificNameAuthorship: 'http://rs.tdwg.org/dwc/terms/scientificNameAuthorship',
    vernacularName: 'http://rs.tdwg.org/dwc/terms/vernacularName',
    taxonRank: 'http://rs.tdwg.org/dwc/terms/taxonRank',
    taxonomicStatus: 'http://rs.tdwg.org/dwc/terms/taxonomicStatus',
    kingdom: 'http://rs.tdwg.org/dwc/terms/kingdom',
    phylum: 'http://rs.tdwg.org/dwc/terms/phylum',
    class: 'http://rs.tdwg.org/dwc/terms/class',
    order: 'http://rs.tdwg.org/dwc/terms/order',
    superfamily: 'http://rs.tdwg.org/dwc/terms/superfamily',
    family: 'http://rs.tdwg.org/dwc/terms/family',
    subfamily: 'http://rs.tdwg.org/dwc/terms/subfamily',
    tribe: 'http://rs.tdwg.org/dwc/terms/tribe',
    subtribe: 'http://rs.tdwg.org/dwc/terms/subtribe',
    genus: 'http://rs.tdwg.org/dwc/terms/genus',
    specificEpithet: 'http://rs.tdwg.org/dwc/terms/specificEpithet',
    infraspecificEpithet: 'http://rs.tdwg.org/dwc/terms/infraspecificEpithet',
    higherClassification: 'http://rs.tdwg.org/dwc/terms/higherClassification',
    taxonRemarks: 'http://rs.tdwg.org/dwc/terms/taxonRemarks',
  },
  measurement: {
    rowType: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    taxonID: 'http://rs.tdwg.org/dwc/terms/taxonID',
    measurementID: 'http://rs.tdwg.org/dwc/terms/measurementID',
    parentMeasurementID: 'http://rs.tdwg.org/dwc/terms/parentMeasurementID',
    measurementType: 'http://rs.tdwg.org/dwc/terms/measurementType',
    verbatimMeasurementType: 'http://rs.tdwg.org/dwc/terms/verbatimMeasurementType',
    measurementValue: 'http://rs.tdwg.org/dwc/terms/measurementValue',
    measurementUnit: 'http://rs.tdwg.org/dwc/terms/measurementUnit',
    measurementMethod: 'http://rs.tdwg.org/dwc/terms/measurementMethod',
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
  <core encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy='"' ignoreHeaderLines="1" rowType="${DWC_TERMS.taxon.rowType}">
    <files>
      <location>taxon.csv</location>
    </files>
    <id index="0" />
${taxonFields}
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

export const buildEmlXml = (publicationDateIso: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eml:eml
  xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  packageId="${DATASET_NAME}-dwc-a-taxa-${DATASET_VERSION}"
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
      <para>This Darwin Core Archive is the taxon and synthesized taxon-level trait component of the production NOW database Darwin Core export. It contains taxonomic records and MeasurementOrFact rows generated directly from curated NOW taxon fields.</para>
      <para>The NOW database is a continuously curated global fossil mammal database supporting large-scale paleobiological and paleontological research. The database spans approximately the last 66 million years, Cenozoic, while maintaining global coverage.</para>
    </abstract>
    <keywordSet>
      <keyword>Darwin Core Archive</keyword>
      <keyword>MeasurementOrFact</keyword>
      <keyword>taxon traits</keyword>
      <keyword>fossil mammals</keyword>
      <keyword>Cenozoic</keyword>
      <keyword>paleobiology</keyword>
      <keyword>paleontology</keyword>
      <keywordThesaurus>NOW database export keywords</keywordThesaurus>
    </keywordSet>
    <additionalInfo>
      <para>Recommended citation: ${DATASET_CREATOR}. ${DATASET_TITLE}, version ${DATASET_VERSION}. ${DATASET_DOI}. The DOI describes the NOW database generally rather than a single frozen dataset export version; include the export date (${publicationDateIso}) when citing a downloaded archive.</para>
      <para>Missing values in CSV files are serialized as ${MISSING_VALUE}. The taxonID values in this archive join to dwc-dp/occurrence.csv taxonID in the full export bundle.</para>
      <para>Future exports may add richer semantic mappings, ontology IRIs, agent identifiers, protocol identifiers, and provenance structures while preserving existing CSV columns wherever possible.</para>
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
        <geographicDescription>Global, reflecting the geographic scope of the NOW database fossil mammal occurrence records that support the taxon and trait synthesis.</geographicDescription>
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
            <timeScaleAgeUncertainty>Temporal coverage varies by taxon and associated occurrence evidence.</timeScaleAgeUncertainty>
            <timeScaleAgeExplanation>Taxon and trait records are synthesized from NOW database curation linked to fossil mammal occurrences and literature sources.</timeScaleAgeExplanation>
          </alternativeTimeScale>
        </singleDateTime>
      </temporalCoverage>
      <taxonomicCoverage>
        <generalTaxonomicCoverage>Fossil mammal taxa and selected curated or synthesized taxon-level traits.</generalTaxonomicCoverage>
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
          <para>Taxon rows are generated from curated NOW species records. Stable taxon identifiers are derived from NOW database species identifiers and are used as the core identifiers for the archive.</para>
        </description>
      </methodStep>
      <methodStep>
        <description>
          <para>Taxon-level traits in measurementorfact.csv are generated directly from curated database fields. They remain in DwC-A MeasurementOrFact because these synthesized values are associated with taxa rather than with individual specimen, material sample, event, or occurrence source entities.</para>
        </description>
      </methodStep>
      <qualityControl>
        <description>
          <para>NOW data are expert curated from literature and community expertise. Trait values should be interpreted in the context of the field descriptions, source curation practices, and the companion relational DwC-DP export.</para>
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

export const buildDwcArchiveZipBufferFromSpecies = async (
  speciesRows: Array<SpeciesForTaxonExport & SpeciesForMeasurementExport>
): Promise<Buffer> => {
  const taxonRows = speciesRows.map(mapSpeciesToTaxonRow)
  const measurementRows = speciesRows.flatMap(mapSpeciesToMeasurementRows)

  const taxonCsv = writeDwcCsvString(TAXON_HEADERS, taxonRows)
  const measurementCsv = writeDwcCsvString(MEASUREMENT_HEADERS, measurementRows)
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

export const fetchSpeciesForDwcExport = async (
  speciesIds?: number[]
): Promise<Array<SpeciesForTaxonExport & SpeciesForMeasurementExport>> => {
  if (speciesIds && speciesIds.length === 0) return []
  const { nowDb } = await import('../utils/db')
  // NOTE: v1 intentionally exports only com_species rows as taxa.
  // TODO(#1150): Add synonym export from com_taxa_synonym.
  return await nowDb.com_species.findMany({
    where: speciesIds ? { species_id: { in: speciesIds } } : undefined,
    orderBy: { species_id: 'asc' },
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
      strain: true,
      gene: true,
      taxon_status: true,
      body_mass: true,
      brain_mass: true,
      sv_length: true,
      sd_size: true,
      sd_display: true,
      tshm: true,
      symph_mob: true,
      relative_blade_length: true,
      tht: true,
      diet1: true,
      diet2: true,
      diet3: true,
      diet_description: true,
      rel_fib: true,
      selectivity: true,
      digestion: true,
      feedinghab1: true,
      feedinghab2: true,
      shelterhab1: true,
      shelterhab2: true,
      locomo1: true,
      locomo2: true,
      locomo3: true,
      hunt_forage: true,
      activity: true,
      crowntype: true,
      microwear: true,
      mesowear: true,
      horizodonty: true,
      cusp_shape: true,
      cusp_count_buccal: true,
      cusp_count_lingual: true,
      loph_count_lon: true,
      loph_count_trs: true,
      fct_al: true,
      fct_ol: true,
      fct_sf: true,
      fct_ot: true,
      fct_cm: true,
      mw_or_high: true,
      mw_or_low: true,
      mw_cs_sharp: true,
      mw_cs_round: true,
      mw_cs_blunt: true,
      mw_scale_min: true,
      mw_scale_max: true,
      mw_value: true,
      pop_struc: true,
      sp_status: true,
    },
  })
}

export const buildDwcArchiveZipBuffer = async (speciesIds?: number[]): Promise<Buffer> => {
  const speciesRows = await fetchSpeciesForDwcExport(speciesIds)
  return await buildDwcArchiveZipBufferFromSpecies(speciesRows)
}
