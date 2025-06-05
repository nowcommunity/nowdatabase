import { AllowedTables, Item, PrimaryTables } from '../types'

export const updateTableToIdColumn: Record<string, string> = {
  now_lau: 'lid',
  now_sau: 'species_id',
  now_tau: 'tu_name',
  now_bau: 'bid',
}

export const prefixToIdColumn = {
  lau: 'luid',
  sau: 'suid',
  tau: 'tuid',
  bau: 'buid',
}

export const getFormattedDate = () => new Date()

export const primaryTableToUpdatePrefix = {
  now_loc: 'lau',
  com_species: 'sau',
  now_time_unit: 'tau',
  now_tu_bound: 'bau',
} as Record<PrimaryTables, 'sau' | 'tau' | 'lau' | 'bau'>

/* Updates to certain tables have to be logged in a different table
   than the one the user edited. Sometimes several tables. For example,
   user editing locality and changing now_ls will require update entry
   to both now_loc and com_species. If this table doesn't have entry for a
   table, assume it goes to the "main" update entry e.g. if user edited locality, now_loc. */
export const tableToUpdateTargets = {
  now_ls: ['now_loc', 'com_species'],
  com_species: ['com_species'], // This is because com_species may be updated through now_loc
} as Record<AllowedTables, PrimaryTables[] | undefined>

/*
  This returns false for any logRow that should not be shown in the updates of tableName.
  For example, a com_species entry can be created while editing now_loc, but we don't want
  to show it in the now_loc update logs, only the now_ls part.
*/
export const filterRelevantLogRows = (item: Item, tableName: PrimaryTables) => {
  if (tableName === 'now_loc' && item.table === 'com_species') return false
  return true
}
