import { PoolConnection } from 'mariadb'
import { EditDataType, Reference, ReferenceDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME, RUNNING_ENV } from '../../utils/config'
import { nowDb } from '../../utils/db'
import { logger } from '../../utils/logger'
import { writeLogRows } from './updateAndLog'
import { WriteContext } from './write'
import { UpdateEntry } from '../writeOperations/updateLogHandler'

export type PrimaryTables = 'now_loc' | 'com_species' | 'now_time_unit' | 'now_tu_bound'

export type ActionType = 'delete' | 'update' | 'add'

export type LogRow = Item & {
  pkData: string
  suid?: number
  luid?: number
  buid?: number
  tuid?: number
  type: ActionType
}

export const logAllUpdates = async (
  writeContext: WriteContext,
  tableName: PrimaryTables,
  userInitials: string,
  comment: string,
  id: string | number,
  references: Reference[]
) => {
  const updateEntries: UpdateEntry[] = []
  const { writeList } = writeContext
  const getIdColumn = (targetTable: AllowedTables) => {
    if (targetTable === 'com_species') return 'species_id'
    if (targetTable === 'now_mus') return 'museum'
    if (targetTable === 'now_ls') return tableName === 'now_loc' ? 'species_id' : 'lid'
    if (targetTable === 'now_loc') return 'lid'
    if (targetTable === 'now_ss') return 'sed_struct'
    if (targetTable === 'com_taxa_synonym') return 'synonym_id'
    if (targetTable === 'now_coll_meth') return 'coll_meth'
    throw new Error(`No id column found for ${targetTable}`)
  }

  const getSecondaryPkData = (table: AllowedTables, items: Item[]) => {
    if (table === tableName) return ''
    const secondaryId = items.find(item => item.column === getIdColumn(table))?.value
    if (!secondaryId) throw new Error(`No id value found for ${table}`)
    return `${secondaryId.toString().length}.${secondaryId};`
  }

  const rootUpdateEntry: UpdateEntry = {
    type: writeContext.type,
    table: tableName,
    id,
    logRows: writeList.flatMap(writeItem =>
      writeItem.items.map(item => ({
        ...item,
        type: writeItem.type,
        pkData: `${id.toString().length}.${id};${getSecondaryPkData(writeItem.table, writeItem.items)}`,
      }))
    ),
  }

  updateEntries.push(rootUpdateEntry)

  // Create "secondary" update-entries. This map holds by the primary table and id, e.g. secondaryUpdateEntries['species_id'][10001]
  const secondaryUpdateEntries = {} as Record<PrimaryTables, Record<string | number, UpdateEntry>>

  for (const writeListItem of writeList) {
    const targetTables = tableToUpdateTargets[writeListItem.table] ?? [tableName]
    for (const targetTable of targetTables) {
      if (targetTable === tableName) continue
      // find id of current entry. it will be the other id than the one of this table, e.g.
      // if we are editing now_loc and this entry is triggered by now_ls (entry for com_species),
      // the id will be "species_id", not "lid".
      const idColumn = getIdColumn(targetTable)
      const secondaryId = writeListItem.items.find(item => item.column === idColumn)?.value as string | number
      if (!secondaryId)
        throw new Error(`Error when creating update entries: id not found for targetTable: ${targetTable}`)
      if (!secondaryUpdateEntries[targetTable]) secondaryUpdateEntries[targetTable] = {}
      const pkData = `${id.toString().length}.${id};${secondaryId.toString().length}.${secondaryId};`
      secondaryUpdateEntries[targetTable][secondaryId] = {
        id: secondaryId,
        table: targetTable,
        type: writeListItem.type,
        logRows: writeListItem.items.map(item => ({ ...item, pkData, type: writeListItem.type })),
      }
    }
  }
  for (const tableUpdates of Object.values(secondaryUpdateEntries)) {
    for (const singleUpdateOfTable of Object.values(tableUpdates)) {
      updateEntries.push(singleUpdateOfTable)
    }
  }

  // Write the update-entries: This inserts the id's that are created into the objects.
  await writeUpdateEntries(updateEntries, writeContext.connection, userInitials, comment)

  await writeReferences(updateEntries, writeContext.connection, references)

  // The write has value and oldValue swapped for 'delete' type logRows due to reasons.
  // It is simpler to fix it here than changing how write works, because values are used to find id's above.
  const fixDeleteRows = (logRow: LogRow) => {
    if (logRow.type !== 'delete') return logRow
    return { ...logRow, oldValue: logRow.value, value: null }
  }

  const logRows = mergeLogRows(updateEntries).map(logRow => fixDeleteRows(logRow))

  await writeLogRows(writeContext.connection, logRows, userInitials)
}

// Some tables are not logged at all.
// TODO dont even use write() for these, make their own services.
export const tablesToNotLog = ['com_mlist']

export const getFieldTypes = <T extends CustomObject>(obj: T, allFields: string[]) => {
  const basicFields = allFields.filter(
    f => typeof obj[f as keyof object] !== 'object' || obj[f as keyof object] === null
  )
  const arrayFields = allFields.filter(f => Array.isArray(obj[f as keyof object])) as AllowedTables[]
  const objectFields: AllowedTables[] = allFields.filter(
    f => typeof obj[f] === 'object' && obj[f] !== null && !Array.isArray(obj[f])
  ) as AllowedTables[]
  return { basicFields, arrayFields, objectFields }
}
export const getOldData = async <T extends CustomObject>(obj: T, tableName: AllowedTables) => {
  // Create where-object with relevant ids to find
  const where = ids[tableName].reduce<object>((acc: object, cur: keyof T) => {
    if (obj[cur] !== undefined) return { ...acc, [cur]: obj[cur] as unknown }
    return acc
  }, {} as object) as unknown as object

  // This creates the whereObject for tables whose primary id is composed of multiple ids
  let whereObject: unknown = { [ids[tableName].join('_')]: where }

  // Or if there is just one, then simply use that one
  if (ids[tableName].length === 1) whereObject = { [ids[tableName][0]]: obj[ids[tableName][0]] }

  debugLog(`Ids: ${ids[tableName].join(', ')}, where: ${printJSON(where)}`, true)

  // Fetch the actual object
  const oldObj: object | null =
    ids[tableName] && obj[ids[tableName][0]] && Object.keys(where).length === ids[tableName].length
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        ((await (nowDb[tableName] as any).findUnique({
          where: whereObject,
        })) as object)
      : null

  debugLog(
    `Old object: ${!!oldObj} ${Object.keys(whereObject as Record<string, string>).length} ${ids[tableName].length}`,
    true
  )

  return oldObj
}

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

// If doing hard debugging of write in local dev, set this to 2
const debugLevel = RUNNING_ENV === 'prod' ? 0 : 1

export const debugLog = (msg: string, onlyVerbose?: boolean) => {
  if (debugLevel === 0) return
  if (debugLevel === 1 && onlyVerbose) return
  logger.info(msg)
}

export type CustomObject = Record<string, string | number | object | CustomObject[] | null | boolean>

export type WriteFunction = <T extends CustomObject>(
  data: T,
  tableName: PrimaryTables,
  username: string,
  comment: string,
  type: ActionType,
  references: Reference[]
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
  | 'com_taxa_synonym'
  | 'now_time_unit'
  | 'now_tu_bound'
  | 'ref_ref'

/*
  Only tables listed here are supported for write operations
*/
export const ids: Record<AllowedTables, string[]> = {
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
  com_taxa_synonym: ['synonym_id'],
}

export const supportedTables = Object.keys(ids)

export type Item = { table: AllowedTables; column: string; value: DbValue; oldValue?: DbValue }
export type DeleteItem = { tableName: AllowedTables; idValues: Array<string | number>; idColumns: string[] }
export type WriteItem = {
  table: AllowedTables
  type: ActionType
  items: Item[]
}

// Possible types of values that are read from db or written in there. BigInt is handled as number.
export type DbValue = string | number | null | boolean

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
