import Prisma from '../../backend/node_modules/@prisma/client/default'
import { RowState } from './components/DetailView/common/FormComponents'

// Use this for fields that include array that has to be edited by EditableTable.
// For example see LocalityDetails: now_mus
export type EditableArray<T> = Array<T & { rowState?: RowState }>

export type Museum = Prisma.now_mus
export type LocalityDetails = Prisma.now_loc & { now_mus: EditableArray<Museum> }

export type Locality = {
  lid: number;
  loc_name: string;
  max_age: number;
  min_age: number;
  country: string | null;
  loc_status: boolean | null;
}

export type SpeciesDetails = Prisma.com_species

export type Species = {
  species_id: number;
  order_name: string;
  family_name: string;
  subclass_or_superorder_name: string | null;
  suborder_or_superfamily_name: string | null;
  subfamily_name: string | null;
  genus_name: string;
  species_name: string;
  unique_identifier: string;
  sp_status: boolean | null;
}

export type Reference = {
  ref_authors: {
      au_num: number;
      author_surname: string;
      author_initials: string;
  }[];
  ref_journal: {
      journal_title: string;
  };
  ref_ref_type: {
      ref_type: string;
  };
  rid: number;
  title_primary: string;
  date_primary: number;
  title_secondary: string;
}

export type ReferenceDetails = Prisma.ref_ref

export type TimeUnit = {
  low_bound: number;
  up_bound: number;
  seq_name: string;
  now_tu_sequence: {
      seq_name: string;
  };
  tu_name: string;
  now_tu_bound_now_time_unit_low_bndTonow_tu_bound: {
      age: number;
  };
  now_tu_bound_now_time_unit_up_bndTonow_tu_bound: {
      age: number;
  };
  tu_display_name: string;
  rank: string;
}

export type TimeUnitDetails = Prisma.now_time_unit
