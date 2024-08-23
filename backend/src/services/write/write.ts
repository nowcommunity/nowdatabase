import { pool } from '../../utils/db'
import { logger } from '../../utils/logger'
import {
  ActionType,
  AllowedTables,
  CustomObject,
  DbValue,
  DeleteItem,
  Item,
  WriteFunction,
  WriteItem,
  allowedFields,
  debugLog,
  getFieldTypes,
  getOldData,
  ids,
  isEmptyValue,
  logAllUpdates,
  printJSON,
  tablesToNotLog,
} from './writeUtils'
import { NOW_DB_NAME } from '../../utils/config'
import { PoolConnection } from 'mariadb'

const query = async (queryString: string, values: Array<DbValue>, conn: PoolConnection) => {
  const result: object = await conn.query(queryString, values)
  debugLog(`Executed query: ${queryString} \t\t| values: ${values.join(', ')} \t| Result: ${printJSON(result)}`)
  return result
}

export type WriteContext = {
  connection: PoolConnection
  writeList: WriteItem[]
  username: string
  type: ActionType
}

const writeTable = async <T extends CustomObject>(obj: T, tableName: AllowedTables, writeContext: WriteContext) => {
  const oldObj = await getOldData(obj, tableName)

  const allFields = Object.keys(obj).filter(f => allowedFields[f])

  /* 
    We divide the fields (the objects properties) into different types. Basic fields are the normal fields,
    object fields are relations to single objects and those need to be written first to get the id if its newly created,
    arrayFields are relations to multiple items, which have to be written last.
  */
  const { basicFields, arrayFields, objectFields } = getFieldTypes(obj, allFields)

  const fieldsToWrite: Item[] = []
  const rowsToDelete: DeleteItem[] = []

  const relationIds: Record<string, string | number> = {}

  /* "objectFields" are children objects, for example now_ls has species_id which refers to an another table "com_species",
    which in the code is the whole object.
    We will first recourse into that, as we cannot write the parent table itself if we don't have the id of the possibly newly-created relation.
    So we write all objectFields and take their id's to be written later */
  for (const objectField of objectFields) {
    const newId = await writeTable(obj[objectField] as CustomObject, objectField, writeContext)
    const lastItem = ids[objectField].length - 1
    // get the relevant id name from ids: the order is so that last item is the relevant id. e.g. now_ls
    const idFieldName = ids[objectField][lastItem]
    relationIds[idFieldName] = newId
  }

  // Add to relationIds-map also those ids that we did not just edit or create
  ids[tableName].forEach(id => {
    if (relationIds[id] === undefined) relationIds[id] = obj[id] as string
  })

  /* Write the "basicFields", meaning simply all the columns that actually exist in the current table */
  for (const field of basicFields) {
    const isRelationField = !!relationIds[field]
    const newValue = relationIds[field] ?? (obj[field as keyof object] as CustomObject)
    const oldValue = oldObj?.[field as keyof object]

    // Skipping the values that aren't changed: including differences in empty values (etc. null and "") or bigint/number different type
    if (newValue === oldValue) continue
    if (isEmptyValue(newValue) && isEmptyValue(oldValue)) continue
    if (typeof oldValue === 'bigint' && typeof newValue === 'number' && BigInt(newValue) === oldValue) continue

    // Add the fields to be written, we will actually write them at the end.
    if (!isRelationField || newValue !== undefined)
      fieldsToWrite.push({ column: field, value: newValue, oldValue, table: tableName })
  }

  // Extract columns and values to write from the list
  const columns = fieldsToWrite.map(({ column }) => column)
  const values = fieldsToWrite.map(({ value }) => value)

  // Field name of the primary key for the current table
  const idFieldName = ids[tableName][0]

  let id = obj[idFieldName as keyof object] as string | number

  /*
    Actually write the basic fields. If the item is new, we get the new id while creating it.
    If it's old, we do an UPDATE and find the correct row to update with the current id.
  */
  if (values.length > 0) {
    let type: 'add' | 'update' | 'delete'
    if (id && !!oldObj) {
      await query(
        `UPDATE ${NOW_DB_NAME}.${tableName} SET ${columns.map(c => `${c} = ?`).join(', ')} WHERE ${idFieldName} = ?`,
        [...values, id] as never,
        writeContext.connection
      )
      type = 'update'
    } else {
      const result = (await query(
        `INSERT INTO ${NOW_DB_NAME}.${tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')}) RETURNING ${idFieldName}`,
        values,
        writeContext.connection
      )) as Record<string, string | number>[]
      id = result[0][idFieldName]
      type = 'add'

      // Add the newly created id to list, so that it will be logged correctly
      fieldsToWrite.push({ table: tableName, column: idFieldName, value: id })
    }
    writeContext.writeList.push({ items: fieldsToWrite, type, table: tableName })
  }

  /* Write arrayFields: the one-to-many relations. For example, if started to write now_loc, now_ls would be written here.
     Notice we write recursively all objects that are inside that array. */
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
    writeContext.writeList.push(
      ...rowsToDelete.map(row => ({
        type: 'delete' as const,
        table: row.tableName,
        items: row.idColumns.map((idColumn, index) => ({
          column: idColumn,
          value: row.idValues[index],
          table: row.tableName,
        })),
      }))
    )

    // Ones without that rowstate will be recursed into
    for (const item of items.filter(({ rowState }) => rowState !== 'removed')) {
      const itemWithId = { ...item, [ids[tableName][0]]: id }
      await writeTable(itemWithId, arrayField, writeContext)
    }
  }

  /*
    Delete rows from current table.
  */
  for (const rowToDelete of rowsToDelete) {
    await query(
      `DELETE FROM ${NOW_DB_NAME}.${rowToDelete.tableName} WHERE ${rowToDelete.idColumns.map(column => `${column} = ?`).join(' AND ')}`,
      rowToDelete.idValues,
      writeContext.connection
    )
  }
  return id
}

export const write: WriteFunction = async (data, tableName, userInitials, comment, type, references) => {
  const connection = await pool.getConnection()
  await connection.beginTransaction()

  const writeContext: WriteContext = {
    connection,
    writeList: [],
    username: userInitials,
    type,
  }

  try {
    const id = await writeTable(data, tableName, writeContext)
    writeContext.writeList = writeContext.writeList.filter(item => !tablesToNotLog.includes(item.table))
    debugLog(`WriteList: ${printJSON(writeContext.writeList)}`)
    if (writeContext.writeList.length > 0) {
      await logAllUpdates(writeContext, tableName, userInitials, comment, id, references)
    }
    await connection.commit()
    await connection.end()
    return id
  } catch (e: unknown) {
    await connection.rollback()
    await connection.end()
    logger.error('Error in write')
    throw e
  }
}
