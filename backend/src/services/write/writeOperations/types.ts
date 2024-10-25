export type AllowedTables =
  | 'now_loc'
  | 'now_ls'
  | 'now_proj'
  | 'now_plr'
  | 'now_syn_loc'
  | 'now_mus'
  | 'now_coll_meth'
  | 'com_mlist'
  | 'com_species'
  | 'now_ss'
  | 'com_taxa_synonym'
  | 'now_time_unit'
  | 'now_tu_bound'
  | 'ref_ref'
  | 'now_tu_sequence'
  | 'now_sau'
  | 'now_tau'
  | 'now_bau'

export type PrimaryTables = 'now_loc' | 'com_species' | 'now_time_unit' | 'now_tu_bound' | 'ref_ref'

export type ActionType = 'delete' | 'update' | 'add'

export type LogRow = Item & {
  pkData: string
  suid?: number
  luid?: number
  buid?: number
  tuid?: number
  type: ActionType
}

export type Item = { table: AllowedTables; column: string; value: DbValue; oldValue?: DbValue }
export type DeleteItem = { tableName: AllowedTables; idValues: Array<string | number>; idColumns: string[] }
export type WriteItem = {
  table: AllowedTables
  type: ActionType
  items: Item[]
}

// Possible types of values that are read from db or written in there. BigInt is handled as number.
export type DbValue = string | number | null | boolean

export type UpdateEntry = {
  table: PrimaryTables
  logRows: LogRow[]
  type: ActionType
  id: string | number // Id of the item that was changed
  entryId?: number // Id of the created update entry
}
