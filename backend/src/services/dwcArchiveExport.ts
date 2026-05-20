import Prisma from '../../prisma/generated/now_test_client'
import JSZip from 'jszip'
import { toDwcCsvString, writeDwcCsvString } from './utils/dwcCsv'
import { getFieldInfoText } from '../../../frontend/src/shared/fieldInfo'

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

const resolveTaxonRank = ({
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

export const buildDwcArchiveZipBuffer = async (): Promise<Buffer> => {
  const speciesRows = await fetchSpeciesForDwcExport()
  return await buildDwcArchiveZipBufferFromSpecies(speciesRows)
}
