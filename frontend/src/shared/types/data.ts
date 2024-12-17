/* For types that describe data */

import * as Prisma from '../../../../backend/prisma/generated/now_test_client/default'
import * as LogPrisma from '../../../../backend/prisma/generated/now_log_test_client/default'
import { Editable, FixBigInt, RowState } from './util'

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
export type PersonDetailsType = Prisma.com_people & { user: Omit<Prisma.com_users, 'password, newpassword'> | null }
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
  estimate_temp: number | null
  estimate_npp: number | null
  pers_woody_cover: number | null
  pers_pollen_ap: number | null
  pers_pollen_nap: number | null
  pers_pollen_other: number | null
  hominin_skeletal_remains: boolean | null
  bipedal_footprints: boolean | null
  stone_tool_cut_marks_on_bones: boolean | null
  stone_tool_technology: boolean | null
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
  site_area: string | null
  gen_loc: string | null
  plate: string | null
  formation: string | null
  member: string | null
  bed: string | null
  loc_status: boolean | null
  species_id: number
  order_name: string
  family_name: string
  subclass_or_superorder_name: string | null
  suborder_or_superfamily_name: string | null
  subfamily_name: string | null
  genus_name: string
  species_name: string
  unique_identifier: string
  taxonomic_status: string
  common_name: string | null
  sp_author: string | null
  strain: string | null
  gene: string | null
  body_mass: number | null
  brain_mass: number | null
  sp_status: boolean | null
}

export type Sequence = Prisma.now_tu_sequence
export type SequenceDetailsType = Prisma.now_tu_sequence

export type SpeciesDetailsType = Prisma.com_species & { now_ls: Array<SpeciesLocality> } & {
  com_taxa_synonym: Array<SpeciesSynonym>
} & { now_sau: Array<SpeciesUpdate> }

export type Species = {
  species_id: number
  order_name: string
  family_name: string
  subclass_or_superorder_name: string | null
  suborder_or_superfamily_name: string | null
  subfamily_name: string | null
  genus_name: string
  species_name: string
  unique_identifier: string
  taxonomic_status: string
  common_name: string | null
  sp_author: string | null
  strain: string | null
  gene: string | null
  body_mass: number | null
  brain_mass: number | null
  sp_status: boolean | null
}

export type RegionDetails = Prisma.now_reg_coord & { now_reg_coord_people: Array<RegionCoordinator> } & {
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

export type ParsedGeoname = Pick<Geoname, 'name' | 'countryName' | 'lat' | 'lng'>
