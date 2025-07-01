/* For types that describe data */

import * as Prisma from '../../../../backend/prisma/generated/now_test_client/default'
import * as LogPrisma from '../../../../backend/prisma/generated/now_log_test_client/default'
import { Editable, FixBigInt, RowState } from './util'
import { Decimal } from '../../../../backend/prisma/generated/now_test_client/runtime/library'

export type UserDetailsType = {
  password: string | null
  user_name: string | null
  now_user_group: string | null
  initials: string
}

export type Statistics = { localityCount: number; speciesCount: number; localitySpeciesCount: number }
export type ActivityStatistic = { year: number; month: number; surname: string }
export type SpeciesType = FixBigInt<Prisma.com_species>
export type SedimentaryStructureValues = Prisma.now_ss_values
export type CollectingMethod = Prisma.now_coll_meth
export type LocalityProject = Prisma.now_plr & { now_proj: Prisma.now_proj }
export type LocalitySpecies = FixBigInt<Prisma.now_ls> & { com_species: SpeciesType }
export type LocalitySpeciesDetailsType = FixBigInt<Prisma.now_ls> & { com_species: SpeciesDetailsType }
export type SpeciesLocality = FixBigInt<Prisma.now_ls> & { now_loc: Prisma.now_loc }
export type LocalityUpdate = Prisma.now_lau & { now_lr: LocalityReference[] } & { updates: UpdateLog[] }
export type SpeciesUpdate = Prisma.now_sau & { now_sr: SpeciesReference[] } & { updates: UpdateLog[] }
export type Museum = Prisma.com_mlist
export type MuseumLocalities = Prisma.com_mlist & { localities: Prisma.now_loc[] }
export type PersonDetailsType = Prisma.com_people & { user: Omit<Prisma.com_users, 'password, newpassword'> | null } & {
  now_user_group: string
}
export type ProjectPeople = Prisma.now_proj_people
export type ProjectDetailsType = Prisma.now_proj & { now_proj_people: Array<ProjectPeople> }
export type Project = Prisma.now_proj
export type Region = Prisma.now_reg_coord
export type RegionCoordinator = Prisma.now_reg_coord_people
export type RegionCountry = Prisma.now_reg_coord_country
export type SedimentaryStructure = Prisma.now_ss
export type LocalitySynonym = Prisma.now_syn_loc
export type SpeciesSynonym = Prisma.com_taxa_synonym
export type LocalityMuseum = Prisma.now_mus & { com_mlist: Museum }
export type LocalityDetailsType = Prisma.now_loc & {
  now_mus: Array<LocalityMuseum>
} & {
  projects: Array<Project>
} & {
  now_ls: Array<LocalitySpeciesDetailsType>
} & { now_plr: Array<LocalityProject> } & { now_syn_loc: Array<LocalitySynonym> } & {
  now_ss: SedimentaryStructure[]
} & {
  now_coll_meth: CollectingMethod[]
} & { now_lau: Array<LocalityUpdate> }
export type UpdateLog = LogPrisma.log
export type Locality = {
  lid: number
  loc_name: string
  bfa_max: string | null
  bfa_min: string | null
  max_age: number
  min_age: number
  bfa_max_abs: string | null
  bfa_min_abs: string | null
  frac_max: string | null
  frac_min: string | null
  chron: string | null
  age_comm: string | null
  basin: string | null
  subbasin: string | null
  dms_lat: string | null
  dms_long: string | null
  dec_lat: number
  dec_long: number
  altitude: number
  country: string
  state: string | null
  county: string | null
  appr_num_spm: number
  site_area: string | null
  gen_loc: string | null
  plate: string | null
  formation: string | null
  member: string | null
  bed: string | null
  loc_status: boolean | null
  estimate_precip: number | null
  estimate_temp: Decimal | null
  estimate_npp: number | null
  pers_woody_cover: number | null
  pers_pollen_ap: number | null
  pers_pollen_nap: number | null
  pers_pollen_other: number | null
  hominin_skeletal_remains: boolean
  bipedal_footprints: boolean
  stone_tool_cut_marks_on_bones: boolean
  stone_tool_technology: boolean
  technological_mode_1: number | null
  technological_mode_2: number | null
  technological_mode_3: number | null
  cultural_stage_1: string | null
  cultural_stage_2: string | null
  cultural_stage_3: string | null
  regional_culture_1: string | null
  regional_culture_2: string | null
  regional_culture_3: string | null
}

export type CrossSearch = {
  // com_species fields
  species_id_com_species: number
  // class_name: string | null;
  order_name: string | null
  family_name: string | null
  subclass_or_superorder_name: string | null
  suborder_or_superfamily_name: string | null
  subfamily_name: string | null
  genus_name: string | null
  species_name: string | null
  unique_identifier: string | null
  taxonomic_status: string | null
  // common_name: string | null;
  // sp_author: string | null;
  // strain: string | null;
  // gene: string | null;
  // taxon_status: string | null;
  diet1: string | null
  diet2: string | null
  diet3: string | null
  // diet_description: string | null;
  // rel_fib: number | null;
  // selectivity: string | null;
  // digestion: string | null;
  // feedinghab1: string | null;
  // feedinghab2: string | null;
  // shelterhab1: string | null;
  // shelterhab2: string | null;
  locomo1: string | null
  locomo2: string | null
  locomo3: string | null
  // hunt_forage: string | null;
  body_mass_com_species: number | null
  // brain_mass: number | null;
  sv_length: number | null
  // activity: string | null;
  sd_size: string | null
  sd_display: string | null
  tshm: string | null
  // symph_mob: string | null;
  // relative_blade_length: number | null;
  tht: string | null
  crowntype: string | null
  microwear_com_species: string | null
  horizodonty: string | null
  cusp_shape: string | null
  cusp_count_buccal: number | null
  cusp_count_lingual: number | null
  loph_count_lon: number | null
  loph_count_trs: number | null
  fct_al: string | null
  fct_ol: string | null
  fct_sf: string | null
  fct_ot: string | null
  fct_cm: string | null
  mesowear_com_species: string | null
  mw_or_high_com_species: string | null
  mw_or_low_com_species: string | null
  mw_cs_sharp_com_species: string | null
  mw_cs_round_com_species: string | null
  mw_cs_blunt_com_species: string | null
  // mw_scale_min_com_species: number | null;
  // mw_scale_max_com_species: number | null;
  // mw_value_com_species: number | null;
  // pop_struc: string | null;
  // sp_status: string | null;
  // used_morph: string | null;
  // used_now: string | null;
  // used_gene: string | null;
  sp_comment: string | null

  // now_ls fields
  // lid_now_ls: number;
  // species_id_now_ls: number;
  // nis: number | null;
  // pct: number | null;
  // quad: number | null;
  // mni: number | null;
  // qua: number | null;
  id_status: string | null
  orig_entry: string | null
  source_name: string | null
  // body_mass_now_ls: number | null;
  mesowear_now_ls: string | null
  mw_or_high_now_ls: string | null
  mw_or_low_now_ls: string | null
  mw_cs_sharp_now_ls: string | null
  mw_cs_round_now_ls: string | null
  mw_cs_blunt_now_ls: string | null
  // mw_scale_min_now_ls: number | null;
  // mw_scale_max_now_ls: number | null;
  // mw_value_now_ls: number | null;
  microwear_now_ls: string | null
  // dc13_mean: number | null;
  // dc13_n: number | null;
  // dc13_max: number | null;
  // dc13_min: number | null;
  // dc13_stdev: number | null;
  // do18_mean: number | null;
  // do18_n: number | null;
  // do18_max: number | null;
  // do18_min: number | null;
  // do18_stdev: number | null;

  // now_loc fields
  lid_now_loc: number
  bfa_max: number | null
  bfa_min: number | null
  loc_name: string | null
  // date_meth: string | null;
  max_age: number | null
  min_age: number | null
  bfa_max_abs: number | null
  bfa_min_abs: number | null
  frac_max: number | null
  frac_min: number | null
  chron: string | null
  age_comm: string | null
  basin: string | null
  subbasin: string | null
  dms_lat: string | null
  dms_long: string | null
  dec_lat: number | null
  dec_long: number | null
  // approx_coord: string | null;
  altitude: number | null
  country: string | null
  state: string | null
  county: string | null
  appr_num_spm: number
  // site_area: string | null;
  gen_loc: string | null
  plate: string | null
  // loc_detail: string | null;
  // lgroup: string | null;
  formation: string | null
  member: string | null
  bed: string | null
  loc_status: boolean | null
  // datum_plane: string | null;
  // tos: string | null;
  // bos: string | null;
  // rock_type: string | null;
  // rt_adj: string | null;
  // lith_comm: string | null;
  // depo_context1: string | null;
  // depo_context2: string | null;
  // depo_context3: string | null;
  // depo_context4: string | null;
  // depo_comm: string | null;
  // sed_env_1: string | null;
  // sed_env_2: string | null;
  // event_circum: string | null;
  // se_comm: string | null;
  // climate_type: string | null;
  // biome: string | null;
  estimate_precip: number | null
  estimate_temp: number | null
  estimate_npp: number | null
  pers_woody_cover: number | null
  pers_pollen_ap: number | null
  pers_pollen_nap: number | null
  pers_pollen_other: number | null
  hominin_skeletal_remains: boolean | null
  bipedal_footprints: boolean | null
  stone_tool_technology: boolean | null
  stone_tool_cut_marks_on_bones: boolean | null
  technological_mode_1: boolean | null
  technological_mode_2: boolean | null
  technological_mode_3: boolean | null
  cultural_stage_1: boolean | null
  cultural_stage_2: boolean | null
  cultural_stage_3: boolean | null
  regional_culture_1: boolean | null
  regional_culture_2: boolean | null
  regional_culture_3: boolean | null
}

export type Sequence = Prisma.now_tu_sequence
export type SequenceDetailsType = Prisma.now_tu_sequence

export type SpeciesDetailsType = Prisma.com_species & { now_ls: Array<SpeciesLocality> } & {
  com_taxa_synonym: Array<SpeciesSynonym>
} & { now_sau: Array<SpeciesUpdate> }

export type Species = {
  species_id: number
  order_name: string | null
  family_name: string | null
  genus_name: string | null
  species_name: string | null
  subclass_or_superorder_name: string | null
  suborder_or_superfamily_name: string | null
  subfamily_name: string | null
  unique_identifier: string | null
  taxonomic_status: string | null
  sv_length: string | null
  body_mass: number
  sd_size: string | null
  sd_display: string | null
  tshm: string | null
  tht: string | null
  horizodonty: string | null
  crowntype: string | null
  cusp_shape: string | null
  cusp_count_buccal: string | null
  cusp_count_lingual: string | null
  loph_count_lon: string | null
  loph_count_trs: string | null
  fct_al: string | null
  fct_ol: string | null
  fct_sf: string | null
  fct_ot: string | null
  fct_cm: string | null
  microwear: string | null
  mesowear: string | null
  mw_or_high: number
  mw_or_low: number
  mw_cs_sharp: number
  mw_cs_round: number
  mw_cs_blunt: number
  diet1: string | null
  diet2: string | null
  diet3: string | null
  locomo1: string | null
  locomo2: string | null
  locomo3: string | null
  sp_comment: string | null
}

export type RegionDetails = Prisma.now_reg_coord & { now_reg_coord_people: Array<RegionCoordinator> } & {
  now_reg_coord_country: Array<RegionCountry>
}

export type PersonDetails = {
  initials: string | null
  first_name: string | null
  surname: string | null
  email: string | null
  organization: string | null
  country: string | null
}

// used in Region's CoordinatorTab to allow adding com_people field to the editData manually
export type RegionDetailsWithComPeople = Prisma.now_reg_coord & {
  now_reg_coord_people: Array<RegionCoordinator & { com_people?: Prisma.com_people }>
} & {
  now_reg_coord_country: Array<RegionCountry>
}

export type TimeBound = {
  bid: number
  b_name: string
  age: number
  b_comment: string
}

export type TimeBoundDetailsType = Prisma.now_tu_bound & { now_bau: TimeBoundUpdate[] }

export type TimeBoundUpdate = Prisma.now_bau & { now_br: Prisma.now_br } & { updates: UpdateLog[] }

/* Time Unit */
export type TimeUnitSequence = Prisma.now_tu_sequence

export type TimeUnitUpdate = Prisma.now_tau & {
  now_tr: Prisma.now_tr & { ref_ref: { ref_authors: string; ref_journal: string }[] }
} & { updates: UpdateLog[] }

export type TimeUnitDetailsType = Prisma.now_time_unit & { now_tu_sequence: SequenceDetailsType } & {
  now_tau: Array<TimeUnitUpdate>
} & {
  low_bound: Prisma.now_tu_bound
  up_bound: Prisma.now_tu_bound
}

export type TimeUnit = {
  low_bound: number
  up_bound: number
  seq_name: string
  tu_name: string
  tu_display_name: string
  rank: string
}

export type EditMetaData = { comment?: string; references?: Editable<Reference>[] }

/* Reference */
export type ReferenceDetailsType = Omit<Prisma.ref_ref, 'exact_date'> & {
  exact_date: string | null
} & {
  ref_authors: {
    rid: number
    au_num: number
    author_surname?: string
    author_initials?: string
    field_id: number
    rowState?: RowState
    index?: number
  }[]
  ref_journal: {
    journal_id: number
    journal_title: string
    short_title: string
    alt_title: string
    ISSN: string
    rowState?: RowState
  }
  ref_ref_type: {
    ref_type: string
  }
}

export type ReferenceType = Prisma.ref_ref_type & { ref_field_name: Prisma.ref_field_name[] }

export type ReferenceField = Prisma.ref_field_name

export type Reference = {
  ref_authors: {
    au_num: number
    author_surname: string
    author_initials: string
  }[]
  ref_journal: {
    journal_title: string
  }
  ref_ref_type: {
    ref_type: string
  }
  rid: number
  title_primary: string
  date_primary: number
  title_secondary: string
}

export type ReferenceOfUpdate = Prisma.ref_ref & {
  ref_authors: Prisma.ref_authors[]
  ref_journal: Prisma.ref_journal
}

export type LocalityReference = Prisma.now_lr & ReferenceOfUpdate
export type SpeciesReference = Prisma.now_sr & ReferenceOfUpdate

export type ReferenceJournalType = {
  journal_id?: number
  journal_title?: string
  short_title?: string
  alt_title?: string
  ISSN?: string
  rowState?: RowState
}

export type ReferenceAuthorType = {
  rid?: number
  au_num?: number
  author_surname?: string
  author_initials?: string
  field_id?: number
  rowState?: RowState
  data_id?: number
}

type Geoname = {
  adminCode01: string
  lng: number
  geonameId: number
  toponymName: string
  countryId: string
  fcl: string
  population: number
  countryCode: string
  name: string
  fclName: string
  adminCodes1: {
    ISO3166_2: string
  }
  countryName: string
  fcodeName: string
  adminName1: string
  lat: number
  fcode: string
}

export type GeonamesJSON = {
  totalResultsCount: number
  geonames: Geoname[]
}

export type ParsedGeoname = Pick<Geoname, 'name' | 'countryName' | 'fclName' | 'adminName1' | 'lat' | 'lng'>

export type UserGroup = 'su (admin)' | 'eu (edit unrestricted)' | 'er (edit restricted)' | 'ro (read only)'
export const userGroups = ['ro (read only)', 'er (edit restricted)', 'eu (edit unrestricted)', 'su (admin)']

export type SimplifiedLocality = {
  lid: number
  dec_lat: number
  dec_long: number
  loc_name: string
}
