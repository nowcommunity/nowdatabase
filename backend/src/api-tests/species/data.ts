import { EditDataType, EditMetaData, SpeciesDetailsType } from '../../../../frontend/src/shared/types'

const references = [
  {
    rid: 10039,
    ref_journal: {
      journal_title: 'Geology',
    },
    ref_authors: [
      {
        au_num: 1,
        author_surname: 'Cande',
        author_initials: 'S.C.',
      },
    ],
    title_primary: 'A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic',
    date_primary: 1992,
    title_secondary: undefined,
  },
  {
    rid: 21368,
    ref_journal: {
      journal_title: 'Geology',
    },
    ref_authors: [
      {
        au_num: 1,
        author_surname: 'Ciochon',
        author_initials: 'Russell.',
      },
    ],
    title_primary: 'Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam',
    date_primary: 1996,
    title_secondary: undefined,
  },
]

export const newSpeciesBasis: EditDataType<SpeciesDetailsType & EditMetaData> = {
  class_name: 'Mammalia',
  order_name: 'Eulipotyphla',
  family_name: 'Soricidae',
  subclass_or_superorder_name: 'Eutheria',
  suborder_or_superfamily_name: null,
  subfamily_name: 'Soricinae',
  genus_name: 'Petenyia',
  species_name: 'dubia test',
  unique_identifier: '-',
  taxonomic_status: null,
  common_name: null,
  sp_author: 'Bachmayer & Wilson, 1970',
  strain: null,
  gene: null,
  taxon_status: null,
  diet1: 'a',
  diet2: null,
  diet3: null,
  diet_description: null,
  rel_fib: null,
  selectivity: null,
  digestion: null,
  feedinghab1: null,
  feedinghab2: null,
  shelterhab1: null,
  shelterhab2: null,
  locomo1: null,
  locomo2: null,
  locomo3: null,
  hunt_forage: null,
  brain_mass: null,
  sv_length: null,
  activity: null,
  sd_size: null,
  sd_display: null,
  tshm: null,
  symph_mob: null,
  relative_blade_length: null,
  tht: null,
  crowntype: null,
  microwear: null,
  horizodonty: null,
  cusp_shape: null,
  cusp_count_buccal: null,
  cusp_count_lingual: null,
  loph_count_lon: null,
  loph_count_trs: null,
  fct_al: null,
  fct_ol: null,
  fct_sf: null,
  fct_ot: null,
  fct_cm: null,
  mesowear: null,
  mw_or_high: null,
  mw_or_low: null,
  mw_cs_sharp: null,
  mw_cs_round: null,
  mw_cs_blunt: null,
  mw_scale_min: null,
  mw_scale_max: null,
  mw_value: null,
  pop_struc: null,
  sp_status: false,
  used_morph: null,
  used_now: true,
  used_gene: null,
  sp_comment: null,
  now_ls: [
    {
      rowState: 'new',
      lid: 24750,
      nis: null,
      pct: null,
      quad: null,
      mni: null,
      qua: null,
      id_status: null,
      orig_entry: null,
      source_name: null,
      mesowear: null,
      mw_or_high: null,
      mw_or_low: null,
      mw_cs_sharp: null,
      mw_cs_round: null,
      mw_cs_blunt: null,
      mw_scale_min: null,
      mw_scale_max: null,
      mw_value: null,
      microwear: null,
      dc13_mean: null,
      dc13_n: null,
      dc13_max: null,
      dc13_min: null,
      dc13_stdev: null,
      do18_mean: null,
      do18_n: null,
      do18_max: null,
      do18_min: null,
      do18_stdev: null,
    },
  ],
  now_sau: [],
  com_taxa_synonym: [],
  references: references,
}

export const editedSpecies: EditDataType<SpeciesDetailsType & EditMetaData> = {
  species_id: 21426,
  sp_comment: 'Test comment',
  species_name: 'Test species name',
  now_ls: [{ rowState: 'new', lid: 20920 }],
  com_taxa_synonym: [],
  now_sau: [],
  comment: 'species edit test',
  references: [references[0]],
}

export const newSpeciesWithoutRequiredFields: EditDataType<SpeciesDetailsType> = {
  ...newSpeciesBasis,
  order_name: '',
  family_name: '',
  genus_name: '',
  species_name: '',
}
