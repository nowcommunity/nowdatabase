import * as Prisma from '../../backend/node_modules/@prisma/client/default'

// TODO does it really work for items of array too
type PartialExceptArrays<T> = {
  [P in keyof T]: T[P] extends Array<infer U>
    ? Array<Editable<PartialExceptArrays<U>>>
    : T[P] extends object
      ? PartialExceptArrays<T[P]>
      : T[P] | undefined
}

// Makes all fields optional, including nested fields. Also, add references-field.
// This is used for editData, which is all the same stuff as data, but for writing actions,
// so must include references and have fields as partial.
type EditDataType<T> = PartialExceptArrays<T> & { references: Reference[] }
export type SpeciesType = Prisma.com_species
export type RowState = 'new' | 'removed' | 'cancelled' | 'clean'
export type UpdateComment = { update_comment: string }
// Use this for fields that include array that has to be edited by EditableTable.
// For example see LocalityDetails: museums field
export type Editable<T> = T & { rowState?: RowState }
export type SedimentaryStructureValues = Prisma.now_ss_values
export type CollectingMethod = Prisma.now_coll_meth
export type LocalityProject = Prisma.now_plr & { now_proj: Prisma.now_proj }
export type LocalitySpecies = Omit<Prisma.now_ls, 'com_species'> & { com_species: SpeciesType }
export type SpeciesLocality = Prisma.now_ls & { now_loc: Prisma.now_loc }
export type LocalityUpdate = Prisma.now_lau & { now_lr: Prisma.now_lr }
export type SpeciesUpdate = Prisma.now_sau & { now_lr: Prisma.now_sr }
export type Museum = Prisma.com_mlist
export type Person = Prisma.com_people
export type PersonDetailsType = Prisma.com_people
export type ProjectPeople = Prisma.now_proj_people
export type ProjectDetailsType = Prisma.now_proj & { now_proj_people: Array<ProjectPeople> }
export type Project = Prisma.now_proj
export type Region = Prisma.now_reg_coord
export type RegionCoordinator = Prisma.now_reg_coord_people
export type RegionCountry = Prisma.now_reg_coord_country
export type SedimentaryStructure = Prisma.now_ss
export type LocalitySynonym = Prisma.now_syn_loc
export type SpeciesSynonym = Prisma.com_taxa_synonym
export type LocalityDetailsType = Omit<Prisma.now_loc, 'now_ls' | 'now_mus' | 'now_proj'> & {
  museums: Array<Museum>
} & {
  projects: Array<Project>
} & {
  now_ls: Array<LocalitySpecies>
} & { now_plr: Array<LocalityProject> } & { now_syn_loc: Array<LocalitySynonym> } & {
  now_ss: SedimentaryStructure[]
} & {
  now_coll_meth: CollectingMethod[]
} & { now_lau: Array<LocalityUpdate> } & UpdateComment

export type Locality = {
  lid: number
  loc_name: string
  bfa_max: string | null
  bfa_min: string | null
  max_age: number
  min_age: number
  country: string | null
  loc_status: boolean | null
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
  sp_status: boolean | null
}

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

export type ReferenceDetailsType = EditDataType<Prisma.ref_ref>
export type RegionDetails = Prisma.now_reg_coord & { now_reg_coord_people: Array<RegionCoordinator> } & {
  now_reg_coord_country: Array<RegionCountry>
}

export type TimeBound = {
  bid: number
  b_name: string
  age: number
  b_comment: string
}

export type TimeBoundDetailsType = EditDataType<Prisma.now_tu_bound & { now_bau: Prisma.now_bau }>

export type TimeUnit = {
  low_bound: number
  up_bound: number
  seq_name: string
  now_tu_sequence: {
    seq_name: string
  }
  tu_name: string
  now_tu_bound_now_time_unit_low_bndTonow_tu_bound: {
    age: number
  }
  now_tu_bound_now_time_unit_up_bndTonow_tu_bound: {
    age: number
  }
  tu_display_name: string
  rank: string
}

export type TimeBoundUpdate = Prisma.now_bau & { now_br: Prisma.now_br }

export type TimeUnitSequence = Prisma.now_tu_sequence

export type TimeUnitUpdate = Prisma.now_time_update & { now_tr: Prisma.now_tr }
export type TimeUnitDetailsType = EditDataType<
  Prisma.now_time_unit & { now_tu_sequence: Array<SequenceDetailsType> }
> & { now_tau: Array<TimeUnitUpdate> }

export type ReferenceType = Prisma.ref_ref_type & { ref_field_name: Prisma.ref_field_name[] }

export type ReferenceField = Prisma.ref_field_name
export type User = Prisma.com_users
export type UserDetailsType = EditDataType<Prisma.com_users>
