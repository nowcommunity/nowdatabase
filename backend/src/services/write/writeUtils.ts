/*
  Common utility functions for processing saving actions
*/
import { EditDataType, ReferenceDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME, IS_LOCAL } from '../../utils/config'
import { nowDb } from '../../utils/db'
import { logger } from '../../utils/logger'

/*
  Returns object where only the "original" fields remain.
*/
export const filterFields = <T extends object>(
  editedObject: EditDataType<T>,
  wantedFields: Record<string, unknown>
) => {
  const fields = Object.keys(wantedFields)
  const filteredFields = Object.entries(editedObject).filter(([field]) => fields.includes(field))
  const filteredObject = filteredFields.reduce<Record<string, unknown>>((obj, cur) => {
    obj[cur[0]] = cur[1]
    return obj
  }, {}) as Partial<T>
  return { filteredFields, filteredObject }
}

export const replaceKey =
  (f: (from: string) => string) =>
  (o: object): object =>
    Array.isArray(o)
      ? o.map(replaceKey(f))
      : Object(o) === o
        ? Object.fromEntries(Object.entries(o).map(([k, v]: [string, object]) => [f(k), replaceKey(f)(v)]))
        : o

export const revertFieldNames = (obj: object) => {
  const fieldsToReplace = { species: 'now_ls' }
  let newObj = obj
  for (const [oldName, newName] of Object.entries(fieldsToReplace)) {
    newObj = replaceKey(key => (key === oldName ? newName : key))(newObj)
  }
  return newObj
}

export const isNumeric = (value: string) => /^-?\d+$/.test(value)

// JSON.stringify doesn't preserve "key: undefined" entries, this prints those as a string instead.
// Also turns bigint to number because bigint cant be serialized
export const printJSON = (item: object | string | number) =>
  JSON.stringify(
    item,
    (_k: string | number, v: unknown) => {
      if (typeof v === 'bigint') return Number(v)
      return v === undefined ? 'undefined' : v
    },
    2
  )

export const isEmptyValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value === '') return true
  return false
}

// If we're using test db, we show debug prints. In local development, it will be more verbose.
const debugLevel = NOW_DB_NAME === 'now_test' ? (IS_LOCAL ? 2 : 1) : 0

export const debugLog = (msg: string, onlyVerbose?: boolean) => {
  if (debugLevel === 0) return
  if (debugLevel === 1 && onlyVerbose) return
  logger.info(msg)
}

export type CustomObject = Record<string, string | number | object | CustomObject[]>

export type WriteFunction = <T extends CustomObject>(
  data: EditDataType<T>,
  tableName: AllowedTables,
  authorizer: string,
  coordinator: string,
  userName: string
) =>
  | Promise<string | number>
  | ((data: EditDataType<ReferenceDetailsType>, tableName: 'ref_ref') => Promise<string | number>)

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
  | 'now_time_unit'
  | 'now_tu_bound'
  | 'ref_ref'

/*
  Only tables listed here are supported for write operations
*/
export const ids = {
  now_loc: ['lid'],
  now_ls: ['lid', 'species_id'],
  now_proj: ['pid'],
  now_plr: ['lid', 'pid'],
  now_syn_loc: ['syn_id'],
  now_mus: ['lid', 'museum'],
  now_coll_meth: ['lid', 'coll_meth'],
  com_mlist: ['museum'],
  com_species: ['species_id'],
  now_ss: ['lid', 'sed_struct'],
  now_time_unit: ['tu_name'],
  now_tu_bound: ['bid'],
  ref_ref: ['rid'],
} satisfies Record<AllowedTables, string[]>

export const supportedTables = Object.keys(ids)
export type Item = { column: string; value: string | number; oldValue?: string | number; items?: (string | number)[] }
export type DeleteItem = { tableName: AllowedTables; idValues: Array<string | number>; idColumns: string[] }
export type WriteItem = {
  table: AllowedTables
  type: 'add' | 'update' | 'delete'
  items: Item[]
}

export const allowedFields: Record<string, boolean | undefined> = {}
const addFieldsToAllowed = (fields: string[]) =>
  fields.forEach(f => {
    allowedFields[f] = true
  })

// Adding tables and fields to allowed field values
addFieldsToAllowed(supportedTables)
supportedTables.forEach(table => addFieldsToAllowed(Object.keys(nowDb[table as AllowedTables].fields)))
// Remove some fields that should be ignored
allowedFields['now_lau'] = false
allowedFields['now_sau'] = false
allowedFields['now_tau'] = false
allowedFields['now_bau'] = false
