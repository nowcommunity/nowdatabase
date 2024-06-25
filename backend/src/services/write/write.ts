/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  EditDataType,
  LocalityDetailsType,
  SpeciesDetailsType,
  TimeBoundDetailsType,
  TimeUnitDetailsType,
} from '../../../../frontend/src/backendTypes'
import { nowDb } from '../../utils/db'
import { logger } from '../../utils/logger'
import { isEmptyValue } from './writeUtils'

const DEBUG_MODE = true

const debugLog = (msg: string) => {
  if (DEBUG_MODE) logger.info(msg)
}

type WriteFunction = (
  data: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>,
  tableName: string,
  oldObject: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>
) => Promise<string>

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
}

type Item = { column: string; value: any }
type WriteItem = { table: string; type: 'add' | 'update' | 'delete'; items: Item[] }

const getFindFunction = (tableName: string, newItem: any) => (item: any) => {
  if (!ids[tableName]) throw new Error(`Matcher missing for ${tableName}`)
  return !ids[tableName].find(f => newItem[f] !== item[f])
}

// TODO change ignored fields to allowed fields. form those by taking prisma.model.fields, and adding the accepted relation fields.
const ignoredFields = ['now_lau']
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
]
// Adding tables and fields to allowed field values
addFieldsToAllowed(supportedTables)
supportedTables.forEach(table => addFieldsToAllowed(Object.keys(nowDb[table].fields)))
// Remove some fields that should be ignored
allowedFields['now_lau'] = false
allowedFields['now_sau'] = false
allowedFields['now_tau'] = false
allowedFields['now_bau'] = false

export const write: WriteFunction = async (data, tableName, oldObject) => {
  debugLog('Write')
  const writeList: WriteItem[] = []
  const writeTable = async (obj: object, tableName: string) => {
    debugLog(`writeTable ${tableName} ${Object.keys(obj)}`)
    const where = ids[tableName].reduce((acc, cur) => {
      if (obj[cur] !== undefined) return { ...acc, [cur]: obj[cur] }
      return acc
    }, {})
    let whereObject = { [ids[tableName].join('_')]: where }
    if (ids[tableName].length === 1) whereObject = { [ids[tableName][0]]: obj[ids[tableName][0]] }
    debugLog(ids[tableName], JSON.stringify(where))
    const oldObj =
      ids[tableName] && Object.keys(where).length === ids[tableName].length
        ? await nowDb[tableName].findUnique({
            where: whereObject,
          })
        : null
    debugLog(`old obj: ${!!oldObj} ${Object.keys(whereObject).length} ${ids[tableName].length}`)
    const allFields = Object.keys(obj).filter(f => allowedFields[f])
    const basicFields = allFields.filter(
      f => typeof obj[f as keyof object] !== 'object' || obj[f as keyof object] === null
    )
    const arrayFields = allFields.filter(f => Array.isArray(obj[f as keyof object]))
    const objectFields = allFields.filter(f => typeof obj[f] === 'object' && obj[f] !== null && !Array.isArray(obj[f]))
    const fieldsToWrite: Item[] = []
    const rowsToDelete: Item[] = []
    const relationIds = {}
    for (const objectField of objectFields) {
      const newId = await writeTable(obj[objectField], objectField, oldObj?.[objectField])
      relationIds[ids[objectField][0]] = newId
      debugLog(`Processed objectField ${objectField} and assigned id ${newId} to ${ids[objectField][0]}`)
    }
    basicFields.push(Object.keys(relationIds))
    for (const field of basicFields) {
      const newValue = relationIds[field] ?? (obj[field as keyof object] as any)
      const oldValue = oldObj?.[field as keyof object]
      debugLog(
        `Field: ${field} Old value: ${oldValue} - ${typeof oldValue} New value: ${newValue} - ${typeof newValue}`
      )
      if (newValue === oldValue) continue
      if (isEmptyValue(newValue) && isEmptyValue(oldValue)) continue
      if (typeof oldValue === 'bigint' && typeof newValue === 'number' && BigInt(newValue) === oldValue) continue
      fieldsToWrite.push({ column: field, value: newValue })
    }

    const columns = fieldsToWrite.map(({ column }) => column)
    const values = fieldsToWrite.map(({ value }) => value)
    const idFieldName = ids[tableName as keyof object] as string
    let id = obj[idFieldName as keyof object] as string
    if (values.length > 0) {
      if (id && !!oldObj) {
        query(`UPDATE ${tableName} SET ${columns.map(c => `${c} = ?`).join(', ')} RETURNING ${idFieldName}`, [
          ...values,
        ])
      } else {
        id = query(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (?) RETURNING ${idFieldName}`, values)
      }
    }
    for (const arrayField of arrayFields) {
      const items = obj[arrayField]

      // The ones with rowState 'removed' will be deleted
      const toBeDeleted: Item[] = items
        .filter(({ rowState }) => rowState === 'removed')
        .map(item => ({ column: arrayField, value: item[idFieldName] }))
      rowsToDelete.push(...toBeDeleted)

      // Ones without that rowstate will be recursed into
      for (const item of items.filter(({ rowState }) => rowState !== 'removed')) {
        const itemWithId = { ...item, [ids[tableName]]: id }
        await writeTable(itemWithId, arrayField, oldObj?.[arrayField]?.find(getFindFunction(arrayField, itemWithId)))
        debugLog(`Processed array item ${JSON.stringify(item)}`)
      }
    }
    rowsToDelete.map(item => query(`DELETE FROM ${tableName} WHERE ? = ?`, [ids[item.column], item.value])) // NOTE column here is actually table name
    //debugLog(JSON.stringify(fieldsToWrite, null, 2))
    debugLog(`Returning id: ${id}`)
    return id
  }

  // debugLog('Old object', JSON.stringify(oldObject, null, 2))
  // debugLog('New object', JSON.stringify(data, null, 2))
  await writeTable(data, tableName)
  // debugLog(JSON.stringify(writeList, null, 2))
  return 'ok'
}

const query = (queryString: string, values: any[]) => {
  logger.info(`${queryString} \t| values: ${values.join(', ')}`)
  return 'some_id'
}
