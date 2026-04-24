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
  // Start from the lowest rank to the highest, but respect the indet.* rules which
  // indicate that lower taxa are unknown and we should not emit species/subspecies ranks.
  const genusIndet = includesIndet(genus)
  const epithetIndet = includesIndet(specificEpithet)

  if (!genusIndet && !epithetIndet) {
    const speciesSp = isSpeciesSp(specificEpithet)
    if (!speciesSp && isSingleLowercaseWord(uniqueIdentifier)) return 'subspecies'
    if (uniqueIdentifier === '-') return 'species'
    if (speciesSp) return 'species'
  }

  if (!genusIndet && epithetIndet) return 'genus'

  if (genusIndet) {
    if (subtribe) return 'subtribe'
    if (tribe) return 'tribe'
    if (subfamily) return 'subfamily'
    if (!isMeaningfulString(subclassOrSuperorderName)) return 'family'
    if (includesIndet(family)) return 'order'
    return 'family'
  }

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

const MEASUREMENT_FIELD_MAPPINGS: Array<{
  field: keyof SpeciesForMeasurementExport
  measurementType: string
  measurementUnit: string
  measurementMethod: string
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
    field: 'sv_length',
    measurementType: 'snout-vent length',
    measurementUnit: '',
    measurementMethod:
      'For many species body-mass values will be unavailable or cannot be estimated with any confidence. However, every species should be classifiable into one of the gross size ranges listed below. This field will allow at least a crude characterization of body sizes for any fossil locality.',
  },
  {
    field: 'sd_size',
    measurementType: 'sexual dimorphism - size',
    measurementUnit: '',
    measurementMethod: 'Whether there is sexual dimorphism in overall body size.',
  },
  {
    field: 'sd_display',
    measurementType: 'sexual dimorphism - display',
    measurementUnit: '',
    measurementMethod:
      'Whether there is evidence of sexual dimorphism in display (or sexual combat) structures. (e. g., horns, antlers, dome-heads, canines). If the presence of these features is unknown, leave the field blank rather than enter "n."',
  },
  {
    field: 'tshm',
    measurementType: 'tooth shape -- multicuspid',
    measurementUnit: '',
    measurementMethod:
      'A description of the morphology of the tooth crown, for multicusped teeth (if present). In concert with the other tooth morphology fields, this may allow functional interpretations to be made independently of whatever has been entered in the diet fields. Terminology for tooth-crown morphology is most highly developed for extant and fossil mammals, but no system has gained universal acceptance. The following reflects a compromise among many competing traditional systems, and is based partly on Fortelius (1985) and Janis and Fortelius (1988). This field is currently subject to further development. Improved nomenclature for some mammal groups, such as rodents and insectivores, might be more functionally indicative. Also, an expanded list of terms would be useful to characterize more fully the variation found among nonmammalian terrestrial vertebrates -- dinosaurs and therapsids in particular. The similar Molar Crown Type field is based on an alternative descriptive classification scheme, and currently applies only to mammals.',
  },
  {
    field: 'symph_mob',
    measurementType: 'symphyseal mobility',
    measurementUnit: '',
    measurementMethod: 'Whether or not the mandibular symphysis is mobile.',
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
    measurementMethod:
      'An indication of hypsodonty (tooth crown height) or the nature of other adaptations to deal with the problem of lifetime tooth wear. Tooth replacement, Tooth plates, and Hypselodont (ever-growing teeth) are absolute descriptors. The terms Brachydont, Mesodont and Hypsodont refer to different degrees of crown height of (mammalian) cheek teeth, and are subject to a variety of interpretations. Hypsodont (high-crowned) teeth may be defined objectively as those where the antero-posterior length is exceeded by the dorso-ventral height (Janis & Fortelius, 1988). "Somewhat hypsodont" teeth, intermediate between brachydont and hypsodont, are referred to as "mesodont," but there is no corresponding objective definition of this term. Quantitative indices of hypsodonty have been used (Janis, 1988), and might prove superior to the classification scheme presented here. Thus, this field is currently subject to further development.',
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
    field: 'rel_fib',
    measurementType: 'relative fiber content',
    measurementUnit: '',
    measurementMethod:
      'The relative amount of plant fiber in the food of the species. Plant food can be divided into cell contents such as sugars, proteins and storage carbohydrates, which are directly digestible by vertebrates. Plant cell-walls, however, are composed of material ("fiber") partially digestible only by microbial fermentation. Thus, the higher the fiber content, relative to the amount of energy contained in the easily-digested portion, the harder it is to obtain energy from the forage and the poorer the "quality" of the food on a per-unit basis. In addition, the proportion of the fiber digestible by fermentation also varies among plant species, plant parts, and growth stages. This field describes the food as having high, medium, and low levels of fiber. It is intended as a rough indication of the nutritional quality of a species\' diet. It refers only to herbivorous diets, or the plant portions of omnivorous diets. (The field basically functions to group various Diet 3 categories by relative fiber content.)',
  },
  {
    field: 'selectivity',
    measurementType: 'selectivity',
    measurementUnit: '',
    measurementMethod:
      'Within its food-type category (Diet 1-3) a species may feed selectively or unselectively. Thus this field applies to any dietary category. Some food types impose selectivity restrictions on the species that feed on them. For example, most large grazers are less selective than mixed feeders or browsers. This is not what this field is meant to indicate! Rather, it applies within dietary categories. It could, for example, be used to distinguish between relatively selective and relatively unselective grazers.',
  },
  {
    field: 'digestion',
    measurementType: 'digestion',
    measurementUnit: '',
    measurementMethod:
      'There are different broad strategies for breaking down plant material by means of microbial activity in the gut. Hindgut fermenters (hg) and foregut fermenters (fg) are found in a variety of living taxa. True ruminants (ru) are confined to the ruminant artiodactyls; they are separated here from other foregut fermenters, of which they form a special derived subclass.',
  },
  {
    field: 'feedinghab1',
    measurementType: 'feeding habitat 1',
    measurementUnit: '',
    measurementMethod:
      'The general habitat from which the species obtains the major part of its trophic resources, and in which it ordinarily spends time feeding. The allowed values are identical to those for Shelter Habitat 1. See also Feeding Habitat 2.',
  },
  {
    field: 'feedinghab2',
    measurementType: 'feeding habitat 2',
    measurementUnit: '',
    measurementMethod:
      'For the Terrestrial (te) entry in Feeding Habitat 1 only, a further breakdown into more specific feeding habitats. They are described more fully below.',
  },
  {
    field: 'shelterhab1',
    measurementType: 'shelter habitat 1',
    measurementUnit: '',
    measurementMethod:
      'The general habitat in which the animal sleeps, shelters, or avoids predation when not feeding. The allowed values are identical to those for Feeding Habitat 1. See also Shelter Habitat 2.',
  },
  {
    field: 'shelterhab2',
    measurementType: 'shelter habitat 2',
    measurementUnit: '',
    measurementMethod:
      'For the Terrestrial (te) entry in Shelter Habitat 1 only, a further breakdown into more specific shelter habitats. They are described more fully below, and are mostly identical to the fields for Feeding Habitat 2.',
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
    field: 'hunt_forage',
    measurementType: 'hunt/forage',
    measurementUnit: '',
    measurementMethod:
      'The predominant hunting or foraging mode for carnivores. These categories are based upon those of Van Valkenburgh (1985) and are described more fully there. This field might also be of eventual use in describing foraging modes of non-carnivores, but at present these cannot be determined directly upon morphological criteria (such inferences as can be made are already taken care of in Feeding Habitat, Diet and Locomotion.)',
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
  },
  {
    field: 'cusp_count_buccal',
    measurementType: 'cusp count (buccal)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'cusp_count_lingual',
    measurementType: 'cusp count (lingual)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'loph_count_lon',
    measurementType: 'loph count (longitudinal)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'loph_count_trs',
    measurementType: 'loph count (transverse)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'fct_al',
    measurementType: 'functional crown type (AL)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'fct_ol',
    measurementType: 'functional crown type (OL)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'fct_sf',
    measurementType: 'functional crown type (SF)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'fct_ot',
    measurementType: 'functional crown type (OT)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
  },
  {
    field: 'fct_cm',
    measurementType: 'functional crown type (CM)',
    measurementUnit: '',
    // TODO(#1150): No matching field description found on pantherion.com/dbmanual97/VSP.html.
    measurementMethod: '',
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
    measurementMethod:
      'Occasionally there will be evidence of herding or other gregarious behavior for a species. This could include evidence from mass deaths, well-preserved trace fossils (e.g., trackways), nesting-site or burrow aggregations, or association of individuals in burrows. It could also be based, less directly, on other aspects of the organism\'s biology -- for example, sexual dimorphism in sexual display or combat features. If so, indicate "soc" here and give details briefly in the Comment field. The choice "sol" (solitary) is allowed for completeness, but ordinarily there will be no positive evidence for solitary behavior, so the alternative to "soc" is usually a blank.',
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
        measurementID: `NOW:${species.species_id}:${mapping.field.toString()}`,
        measurementType: mapping.measurementType,
        verbatimMeasurementType: mapping.field.toString(),
        measurementValue,
        measurementUnit: mapping.measurementUnit,
        measurementMethod: mapping.measurementMethod,
      },
    ]
  })
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
  <core encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy="&quot;" ignoreHeaderLines="1" rowType="${DWC_TERMS.taxon.rowType}">
    <files>
      <location>taxon.csv</location>
    </files>
    <id index="0" />
${taxonFields}
  </core>
  <extension encoding="UTF-8" linesTerminatedBy="\\n" fieldsTerminatedBy="," fieldsEnclosedBy="&quot;" ignoreHeaderLines="1" rowType="${DWC_TERMS.measurement.rowType}">
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
