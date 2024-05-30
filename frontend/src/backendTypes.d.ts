import * as Prisma from '../../backend/node_modules/@prisma/client/default'

type PartialString<T> = {
  [P in keyof T]: T[P] extends string | null ? T[P] | undefined : T[P]
}

// Makes all number fields strings, and then all string fields optional! Used for editData
type EditFields<T> = PartialString<{
  [P in keyof T]: T[P] extends number | bigint | null ? string : T[P]
}>

type EditDataType<T> = EditFields<{
  [P in keyof T]: T[P] extends (infer U)[]
    ? EditDataType<U>[]
    : T[P] extends object
      ? EditDataType<PartialString<EditFields<T[P]>>>
      : T[P]
}>

export type RowState = 'new' | 'removed' | 'cancelled' | 'clean'
export type UpdateComment = { update_comment: string }
// Use this for fields that include array that has to be edited by EditableTable.
// For example see LocalityDetails: museums field
export type Editable<T> = T & { rowState?: RowState }
export type SedimentaryStructureValues = Prisma.now_ss_values
export type CollectingMethod = Prisma.now_coll_meth
export type LocalityProject = Prisma.now_plr & { now_proj: Prisma.now_proj }
export type LocalitySpecies = Prisma.now_ls & { com_species: Prisma.com_species }
export type SpeciesLocality = Prisma.now_ls & { now_loc: Prisma.now_loc }
export type LocalityUpdate = Prisma.now_lau & { now_lr: Prisma.now_lr }
export type SpeciesUpdate = Prisma.now_sau & { now_lr: Prisma.now_sr }
export type Museum = Prisma.com_mlist
export type Project = Prisma.now_proj
export type SedimentaryStructure = Prisma.now_ss
export type LocalitySynonym = Prisma.now_syn_loc
export type SpeciesSynonym = Prisma.com_taxa_synonym
export type LocalityDetailsType = Omit<Prisma.now_loc, 'now_mus'> & { museums: Array<Editable<Museum>> } & {
  now_ls: Array<Editable<LocalitySpecies>>
} & { now_plr: Array<Editable<LocalityProject>> } & { now_syn_loc: Array<Editable<LocalitySynonym>> } & {
  now_ss: Editable<SedimentaryStructure>[]
} & {
  now_coll_meth: Editable<CollectingMethod>[]
} & { now_lau: Array<Editable<LocalityUpdate>> } & UpdateComment

export type Locality = {
  lid: number
  loc_name: string
  max_age: number
  min_age: number
  country: string | null
  loc_status: boolean | null
}

export type SpeciesDetailsType = Prisma.com_species & { now_ls: Array<Editable<SpeciesLocality>> } & {
  com_taxa_synonym: Array<Editable<SpeciesSynonym>>
} & { now_sau: Array<Editable<SpeciesUpdate>> }

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

export type ReferenceDetailsType = Prisma.ref_ref

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

export type TimeUnitDetailsType = Prisma.now_time_unit
