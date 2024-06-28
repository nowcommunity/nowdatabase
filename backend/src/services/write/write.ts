import { nowDb, pool } from '../../utils/db'
import { logger } from '../../utils/logger'
import {
  AllowedTables,
  CustomObject,
  DeleteItem,
  Item,
  WriteFunction,
  WriteItem,
  allowedFields,
  debugLog,
  ids,
  isEmptyValue,
  printJSON,
} from './writeUtils'
import { NOW_DB_NAME } from '../../utils/config'
import { createUpdateEntry, writeToLog } from './updateAndLog'

export const write: WriteFunction = async (data, tableName, updateOptions) => {
  debugLog(`Started write. Table: ${tableName} ${updateOptions?.userName ? `User: ${updateOptions.userName}` : ''}`)
  const writeList: WriteItem[] = []
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const query = async (queryString: string, values: Array<string | number>) => {
    const result: object = await conn.query(queryString, values)
    debugLog(`${queryString} \t\t| values: ${values.join(', ')} \t| Result: ${printJSON(result)}`)
    return result
  }

  const writeTable = async <T extends CustomObject>(obj: T, tableName: AllowedTables) => {
    debugLog(`writeTable ${tableName} ${Object.keys(obj).join(', ')}`)
    const where = ids[tableName].reduce<object>((acc: object, cur: keyof T) => {
      if (obj[cur] !== undefined) return { ...acc, [cur]: obj[cur] as unknown }
      return acc
    }, {} as object) as unknown as object
    let whereObject: unknown = { [ids[tableName].join('_')]: where }
    if (ids[tableName].length === 1) whereObject = { [ids[tableName][0]]: obj[ids[tableName][0]] }
    debugLog(`Ids: ${ids[tableName].join(', ')}, where: ${printJSON(where)}`, true)
    const oldObj: object | null =
      ids[tableName] && obj[ids[tableName][0]] && Object.keys(where).length === ids[tableName].length
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          ((await (nowDb[tableName] as any).findUnique({
            where: whereObject,
          })) as object)
        : null
    debugLog(
      `Old object: ${!!oldObj} ${Object.keys(whereObject as Record<string, string>).length} ${ids[tableName].length}`,
      true
    )
    const allFields = Object.keys(obj).filter(f => allowedFields[f])
    debugLog(`All fields: ${allFields.join(', ')}`, true)
    const basicFields = allFields.filter(
      f => typeof obj[f as keyof object] !== 'object' || obj[f as keyof object] === null
    )
    const arrayFields = allFields.filter(f => Array.isArray(obj[f as keyof object])) as AllowedTables[]
    const objectFields: AllowedTables[] = allFields.filter(
      f => typeof obj[f] === 'object' && obj[f] !== null && !Array.isArray(obj[f])
    ) as AllowedTables[]
    const fieldsToWrite: Item[] = []
    const rowsToDelete: DeleteItem[] = []
    const relationIds: Record<string, string | number> = {}
    for (const objectField of objectFields) {
      const newId = await writeTable(obj[objectField] as CustomObject, objectField)
      const lastItem = ids[objectField].length - 1
      relationIds[ids[objectField][lastItem]] = newId
      debugLog(`Processed objectField ${objectField} and assigned id ${newId} to ${ids[objectField][lastItem]}`, true)
    }
    ids[tableName].forEach(id => {
      if (relationIds[id] === undefined) relationIds[id] = obj[id] as string
    })
    Object.keys(relationIds).forEach(rId => {
      if (!basicFields.includes(rId) && rId !== undefined) basicFields.push(rId)
    })

    debugLog(`basicFields: ${printJSON(basicFields)}, relationIds object: ${printJSON(relationIds)}`)
    for (const field of basicFields) {
      const isRelationField = !!relationIds[field]
      const newValue = relationIds[field] ?? (obj[field as keyof object] as CustomObject)
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
    debugLog(`idFieldName ${printJSON(idFieldName)}`, true)
    debugLog(`Writing to ${tableName} to columns ${columns.join(', ')} values ${values.join(', ')}`, true)
    let id = obj[idFieldName as keyof object] as string | number
    if (values.length > 0) {
      let type: 'add' | 'update' | 'delete'
      if (id && !!oldObj) {
        await query(
          `UPDATE ${NOW_DB_NAME}.${tableName} SET ${columns.map(c => `${c} = ?`).join(', ')} WHERE ${idFieldName} = ?`,
          [...values, id]
        )
        type = 'update'
      } else {
        const result = (await query(
          `INSERT INTO ${NOW_DB_NAME}.${tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')}) RETURNING ${idFieldName}`,
          values
        )) as Record<string, string | number>[]
        debugLog(`Insert result: ${printJSON(result)}`)
        id = result[0][idFieldName]
        type = 'add'
      }
      writeList.push({ items: fieldsToWrite, type, table: tableName })
    }
    for (const arrayField of arrayFields) {
      const items = obj[arrayField] as CustomObject[]

      // The ones with rowState 'removed' will be deleted
      const toBeDeleted: DeleteItem[] = items
        .filter(({ rowState }) => rowState === 'removed')
        .map(item => ({
          tableName: arrayField,
          idColumns: ids[arrayField],
          idValues: ids[arrayField].map((id: string) => item[id]) as string[],
        }))
      rowsToDelete.push(...toBeDeleted)

      // Ones without that rowstate will be recursed into
      for (const item of items.filter(({ rowState }) => rowState !== 'removed')) {
        const itemWithId = { ...item, [ids[tableName][0]]: id }
        debugLog(`itemWithId: ${printJSON(itemWithId)}`)
        await writeTable(itemWithId, arrayField)
        debugLog(`Processed array item ${printJSON(item)}`)
      }
    }

    for (const rowToDelete of rowsToDelete) {
      const deleteResult = await query(
        `DELETE FROM ${NOW_DB_NAME}.${rowToDelete.tableName} WHERE ${rowToDelete.idColumns.map(column => `${column} = ?`).join(' AND ')}`,
        rowToDelete.idValues
      ) // NOTE column here is actually table name
      // writeList.push({ table: rowToDelete.tableName, type: 'delete', items: rowToDelete.idValues })
      debugLog(`deleteResult: ${printJSON(deleteResult)}`)
    }
    //debugLog(printJSON(fieldsToWrite, null, 2))
    debugLog(`Returning id: ${printJSON(id)}`)
    return id
  }

  let result = null

  try {
    result = await writeTable(data, tableName)
    debugLog(`Final result: ${printJSON(result)}`)
    debugLog(`WriteList: ${printJSON(writeList)}`)
    if (updateOptions) {
      const { coordinator, authorizer, userName } = updateOptions
      const tableNameToPrefix = {
        now_loc: 'l',
        com_species: 's',
        now_time_unit: 't',
        now_tu_bound: 'b',
      } as Record<AllowedTables, 's' | 't' | 'l' | 'b'>
      const prefix = tableNameToPrefix[tableName]
      const updateEntry = await createUpdateEntry(
        conn,
        prefix,
        coordinator,
        authorizer,
        (data[`now_${prefix}au`] as { comment: string }).comment,
        result
      )
      debugLog(`updateEntry: ${printJSON(updateEntry)}`, true)
      await writeToLog(conn, writeList, tableName, updateEntry, userName)
    }
    await conn.commit()
  } catch (e: unknown) {
    await conn.rollback()
    await conn.end()
    logger.error('Error in write')
    throw e
  } finally {
    await conn.end()
  }
  return result
}
