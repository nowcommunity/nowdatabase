import {
  LocalityDetailsType,
  ReferenceDetailsType,
  SpeciesDetailsType,
  TimeBoundDetailsType,
  TimeUnitDetailsType,
} from '@/backendTypes'

export const emptyLocality = {
  bfa_max: '',
  bfa_min: '',
  loc_name: '',
  date_meth: '',
  max_age: null,
  min_age: null,
  bfa_max_abs: '',
  bfa_min_abs: '',
  frac_max: '',
  frac_min: '',
  chron: '',
  age_comm: '',
  basin: '',
  subbasin: null,
  dms_lat: '',
  dms_long: '',
  dec_lat: null,
  dec_long: null,
  approx_coord: null,
  altitude: null,
  country: '',
  state: '',
  county: '',
  site_area: '',
  gen_loc: '',
  plate: '',
  loc_detail: '',
  lgroup: '',
  formation: '',
  member: '',
  bed: '',
  datum_plane: '',
  tos: null,
  bos: null,
  rock_type: '',
  rt_adj: '',
  lith_comm: '',
  depo_context1: '',
  depo_context2: '',
  depo_context3: '',
  depo_context4: '',
  depo_comm: '',
  sed_env_1: '',
  sed_env_2: '',
  event_circum: '',
  se_comm: '',
  climate_type: '',
  biome: '',
  v_ht: '',
  v_struct: '',
  v_envi_det: '',
  disturb: '',
  nutrients: '',
  water: '',
  seasonality: '',
  seas_intens: '',
  pri_prod: '',
  moisture: '',
  temperature: '',
  assem_fm: '',
  transport: '',
  trans_mod: '',
  weath_trmp: '',
  pt_conc: '',
  size_type: '',
  vert_pres: '',
  plant_pres: '',
  invert_pres: '',
  time_rep: '',
  appr_num_spm: null,
  num_spm: null,
  true_quant: '',
  complete: '',
  num_quad: null,
  taph_comm: '',
  tax_comm: '',
  loc_status: false, // NOTICE: Loc status
  estimate_precip: null,
  estimate_temp: null,
  estimate_npp: null,
  pers_woody_cover: null,
  pers_pollen_ap: null,
  pers_pollen_nap: null,
  pers_pollen_other: null,
  hominin_skeletal_remains: null,
  bipedal_footprints: null,
  stone_tool_technology: null,
  stone_tool_cut_marks_on_bones: null,
  technological_mode_1: null,
  technological_mode_2: null,
  technological_mode_3: null,
  cultural_stage_1: null,
  cultural_stage_2: null,
  cultural_stage_3: null,
  regional_culture_1: null,
  regional_culture_2: null,
  regional_culture_3: null,
  now_mus: [],
  now_ls: [],
  now_syn_loc: [],
  now_ss: [],
  now_coll_meth: [],
  now_plr: [],
  now_lau: [],
} as unknown as LocalityDetailsType

export const emptySpecies = {
  class_name: '',
  order_name: '',
  family_name: '',
  subclass_or_superorder_name: '',
  suborder_or_superfamily_name: '',
  subfamily_name: '',
  genus_name: '',
  species_name: '',
  unique_identifier: '-',
  taxonomic_status: null,
  common_name: '',
  sp_author: '',
  strain: null,
  gene: null,
  taxon_status: '',
  diet1: '',
  diet2: '',
  diet3: '',
  diet_description: '',
  rel_fib: null,
  selectivity: '',
  digestion: '',
  feedinghab1: null,
  feedinghab2: null,
  shelterhab1: null,
  shelterhab2: null,
  locomo1: null,
  locomo2: null,
  locomo3: null,
  hunt_forage: null,
  body_mass: null,
  brain_mass: null,
  sv_length: null,
  activity: null,
  sd_size: null,
  sd_display: null,
  tshm: '',
  symph_mob: null,
  relative_blade_length: null,
  tht: '',
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
  sp_status: null,
  used_morph: null,
  used_now: null,
  used_gene: null,
  sp_comment: null,
  now_ls: [],
  com_taxa_synonym: [],
  now_sau: [],
} as unknown as SpeciesDetailsType

export const emptyTimeUnit = {
  tu_display_name: '',
  up_bnd: null,
  low_bnd: null,
  rank: '',
  sequence: '',
  tu_comment: '',
  now_tu_sequence: {
    sequence: '',
    seq_name: '',
  },
  now_tau: [],
} as unknown as TimeUnitDetailsType

export const emptyTimeBound = {
  b_name: '',
  age: null,
  b_comment: '',
  now_bau: [],
} as unknown as TimeBoundDetailsType

export const emptyReference = {
  ref_type_id: 1,
  journal_id: null,
  title_primary: '',
  date_primary: null,
  volume: '',
  issue: null,
  start_page: null,
  end_page: null,
  publisher: null,
  pub_place: null,
  title_secondary: null,
  date_secondary: null,
  title_series: null,
  issn_isbn: '',
  ref_abstract: null,
  web_url: null,
  misc_1: null,
  misc_2: null,
  gen_notes: null,
  printed_language: '',
  exact_date: null,
  used_morph: null,
  used_now: null,
  used_gene: null,
  ref_authors: [],
  ref_journal: null,
  visible_ref_authors: [],
} as unknown as ReferenceDetailsType
