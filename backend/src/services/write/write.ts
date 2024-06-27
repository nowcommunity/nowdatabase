/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PoolConnection } from 'mariadb'
import {
  EditDataType,
  LocalityDetailsType,
  ReferenceDetailsType,
  SpeciesDetailsType,
  TimeBoundDetailsType,
  TimeUnitDetailsType,
} from '../../../../frontend/src/backendTypes'
import { nowDb, pool } from '../../utils/db'
import { logger } from '../../utils/logger'
import { isEmptyValue, printJSON } from './writeUtils'

const DEBUG_MODE = true

const logDbName = 'now_log_test'

const debugLog = (msg: string) => {
  if (DEBUG_MODE) logger.info(msg)
}

type WriteFunction = (
  data: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>,
  tableName: string,
  authorizer: string,
  coordinator: string,
  userName: string
) => Promise<string> | ((data: EditDataType<ReferenceDetailsType>, tableName: 'ref_ref') => Promise<string>)

const ids = {
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
} as Record<string, string[]>

type Item = { column: string; value: any; oldValue?: any }
type WriteItem = { table: string; type: 'add' | 'update' | 'delete'; items: Item[] }

const getFindFunction = (tableName: string, newItem: any) => (item: any) => {
  if (!ids[tableName]) throw new Error(`Matcher missing for ${tableName}`)
  return !ids[tableName].find(f => newItem[f] !== item[f])
}

const allowedFields = {}
const addFieldsToAllowed = fields =>
  fields.forEach(f => {
    allowedFields[f] = true
  })

const supportedTables = [
  'now_loc',
  'now_ls',
  'now_proj',
  'now_plr',
  'now_syn_loc',
  'now_mus',
  'now_coll_meth',
  'com_mlist',
  'com_species',
  'now_ss',
  'now_time_unit',
  'now_tu_bound',
  'ref_ref',
]

if (supportedTables.find(table => !ids[table]) || Object.keys(ids).find(id => !supportedTables.includes(id)))
  throw Error('In write.js, all tables with ids must be supported and all supported tables must have ids')

// Adding tables and fields to allowed field values
addFieldsToAllowed(supportedTables)
supportedTables.forEach(table => addFieldsToAllowed(Object.keys(nowDb[table].fields)))
// Remove some fields that should be ignored
allowedFields['now_lau'] = false
allowedFields['now_sau'] = false
allowedFields['now_tau'] = false
allowedFields['now_bau'] = false

const dbName = 'now_test'

export const write: WriteFunction = async (data, tableName, coordinator, authorizer, userName) => {
  debugLog('Write')
  const writeList: WriteItem[] = []
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const query = async (queryString: string, values: any[]) => {
    const result = await conn.query(queryString, values)
    logger.info(`${queryString} \t\t| values: ${values.join(', ')} \t| Result: ${printJSON(result)}`)
    return result
  }

  const writeTable = async (obj: object, tableName: string) => {
    debugLog(`writeTable ${tableName} ${Object.keys(obj)}`)
    const where = ids[tableName].reduce((acc, cur) => {
      if (obj[cur] !== undefined) return { ...acc, [cur]: obj[cur] }
      return acc
    }, {})
    let whereObject = { [ids[tableName].join('_')]: where }
    if (ids[tableName].length === 1) whereObject = { [ids[tableName][0]]: obj[ids[tableName][0]] }
    debugLog(`ids: ${ids[tableName]}, where: ${printJSON(where)}`)
    const oldObj =
      ids[tableName] && obj[ids[tableName][0]] && Object.keys(where).length === ids[tableName].length
        ? await nowDb[tableName].findUnique({
            where: whereObject,
          })
        : null
    debugLog(`old obj: ${!!oldObj} ${Object.keys(whereObject).length} ${ids[tableName].length}`)
    const allFields = Object.keys(obj).filter(f => allowedFields[f])
    debugLog(`All fields: ${allFields}`)
    const basicFields = allFields.filter(
      f => typeof obj[f as keyof object] !== 'object' || obj[f as keyof object] === null
    )
    const arrayFields = allFields.filter(f => Array.isArray(obj[f as keyof object]))
    const objectFields = allFields.filter(f => typeof obj[f] === 'object' && obj[f] !== null && !Array.isArray(obj[f]))
    const fieldsToWrite: Item[] = []
    const rowsToDelete: Item[] = []
    const relationIds = {}
    for (const objectField of objectFields) {
      const newId = await writeTable(obj[objectField], objectField)
      const lastItem = ids[objectField].length - 1
      relationIds[ids[objectField][lastItem]] = newId
      debugLog(`Processed objectField ${objectField} and assigned id ${newId} to ${ids[objectField][lastItem]}`)
    }
    ids[tableName].forEach(id => {
      if (relationIds[id] === undefined) relationIds[id] = obj[id]
    })
    Object.keys(relationIds).forEach(rId => {
      if (!basicFields.includes(rId) && rId !== undefined) basicFields.push(rId)
    })

    debugLog(`basicFields: ${printJSON(basicFields)}, relationIds object: ${printJSON(relationIds)}`)
    for (const field of basicFields) {
      const isRelationField = !!relationIds[field]
      const newValue = relationIds[field] ?? (obj[field as keyof object] as any)
      const oldValue = oldObj?.[field as keyof object]
      debugLog(
        `Field: ${field} Old value: ${oldValue} (${typeof oldValue}) New value: ${newValue} (${typeof newValue}) - isRelationField: ${isRelationField}`
      )
      if (newValue === oldValue) continue
      if (isEmptyValue(newValue) && isEmptyValue(oldValue)) continue
      if (typeof oldValue === 'bigint' && typeof newValue === 'number' && BigInt(newValue) === oldValue) continue
      if (!isRelationField || newValue !== undefined) fieldsToWrite.push({ column: field, value: newValue, oldValue })
    }

    const columns = fieldsToWrite.map(({ column }) => column)
    const values = fieldsToWrite.map(({ value }) => value)
    const idFieldName = ids[tableName][0]
    debugLog(`idFieldName ${printJSON(idFieldName)}`)
    debugLog(`Writing to ${tableName} to columns ${columns.join(', ')} values ${values.join(', ')}`)
    let id = obj[idFieldName as keyof object] as string
    if (values.length > 0) {
      let type: 'add' | 'update' | 'delete'
      if (id && !!oldObj) {
        await query(
          `UPDATE ${dbName}.${tableName} SET ${columns.map(c => `${c} = ?`).join(', ')} WHERE ${idFieldName} = ?`,
          [...values, id]
        )
        type = 'update'
      } else {
        const result = await query(
          `INSERT INTO ${dbName}.${tableName} (${columns.join(', ')}) VALUES (${values.map(_ => '?').join(', ')}) RETURNING ${idFieldName}`,
          values
        )
        debugLog(`Insert result: ${printJSON(result)}`)
        id = result[0][idFieldName]
        type = 'add'
      }
      writeList.push({ items: fieldsToWrite, type, table: tableName })
    }
    for (const arrayField of arrayFields) {
      const items = obj[arrayField]

      // The ones with rowState 'removed' will be deleted
      const toBeDeleted: Item[] = items
        .filter(({ rowState }) => rowState === 'removed')
        .map(item => ({
          tableName: arrayField,
          idColumns: ids[arrayField],
          idValues: ids[arrayField].map(id => item[id]),
        }))
      rowsToDelete.push(...toBeDeleted)

      // Ones without that rowstate will be recursed into
      for (const item of items.filter(({ rowState }) => rowState !== 'removed')) {
        const itemWithId = { ...item, [ids[tableName]]: id }
        await writeTable(itemWithId, arrayField)
        debugLog(`Processed array item ${printJSON(item)}`)
      }
    }
    for (const rowToDelete of rowsToDelete) {
      const deleteResult = await query(
        `DELETE FROM ${dbName}.${rowToDelete.tableName} WHERE ${rowToDelete.idColumns.map(column => `${column} = ?`).join(' AND ')}`,
        rowToDelete.idValues
      ) // NOTE column here is actually table name
      writeList.push({ table: rowToDelete.tableName, type: 'delete', items: rowToDelete.idValues })
      debugLog(`deleteResult: ${printJSON(deleteResult)}`)
    }
    //debugLog(printJSON(fieldsToWrite, null, 2))
    debugLog(`Returning id: ${printJSON(id)}`)
    return id
  }

  let result = null

  try {
    // debugLog('Old object', printJSON(oldObject, null, 2))
    // debugLog('New object', printJSON(data, null, 2))
    result = await writeTable(data, tableName)
    debugLog(`Final result: ${printJSON(result)}`)
    debugLog(`WriteList: ${printJSON(writeList)}`)
    const tableNameToUpdateTable = {
      now_loc: 'now_lau',
      com_species: 'now_sau',
      now_time_unit: 'now_tau',
      now_tu_bound: 'now_bau',
    }
    const updateEntry = await createUpdateEntry(
      conn,
      tableNameToUpdateTable[tableName],
      coordinator,
      authorizer,
      data[tableNameToUpdateTable[tableName]].comment,
      result
    )
    debugLog(`updateEntry: ${printJSON(updateEntry)}`)
    const logResult = await writeToLog(conn, writeList, tableName, updateEntry, userName)
    await conn.commit()
  } catch (e: unknown) {
    await conn.rollback()
    await conn.end()
    logger.error('Error in write')
    throw e
  } finally {
    console.log('Closing connection')
    await conn.end()
  }
  return result
}

const tableToId = { now_lau: 'lid', now_sau: 'species_id', now_tau: 'tu_name', now_bau: 'bid' }
const getUpdateIdField = (tableName: string) => `${tableName[4]}uid`

const writeToLog = async (
  conn: PoolConnection,
  writeList: WriteItem[],
  tableName: string,
  updateEntryId: number,
  userName: string
) => {
  const updateRows = writeList.flatMap(item =>
    item.items.map(row => ({
      event_time: new Date(),
      user_name: userName,
      server_name: 'sysbiol',
      table_name: item.table,
      pk_data: `${(ids[tableName][0] + '').length}.${ids[tableName].join('.')};`,
      column_name: row.column,
      // TODO add deletions
      log_action: row.oldValue ? 3 : 2, // 1 = delete, 2 = create, 3 = update
      old_data: row.oldValue,
      new_data: row.value,
      [getUpdateIdField(tableName)]: updateEntryId,
    }))
  )
  debugLog(`updateRows: ${printJSON(updateRows)}`)
  for (const row of updateRows) {
    const columnsAndValues = Object.entries(row)
    const columns = columnsAndValues.map(([column]) => column)
    const values = columnsAndValues.map(([, values]) => values)
    await conn.query(
      `INSERT INTO ${logDbName}.log (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      values
    )
    debugLog(`Writing into log-db: ${printJSON(row)}`)
  }
}

const createUpdateEntry = async (
  conn: PoolConnection,
  table: 'now_lau' | 'now_sau' | 'now_tau' | 'now_bau',
  coordinator: string,
  authorizer: string,
  comment: string,
  id: number
) => {
  const idField = getUpdateIdField(table)
  const prefix = `${table[4]}au`
  const result = await conn.query(
    `INSERT INTO ${dbName}.${table} (${prefix}_coordinator, ${prefix}_authorizer, ${tableToId[table]}, ${prefix}_date, ${prefix}_comment) VALUES (?, ?, ?, ?, ?) RETURNING ${table}.${idField}`,
    [coordinator, authorizer, id, new Date(), comment]
  )
  debugLog(`createUpdateEntry result before returning: ${printJSON(result)}`)
  return result?.[0]?.[idField]
}
