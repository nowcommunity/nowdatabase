import { PoolConnection } from 'mariadb'
import { LOG_DB_NAME, NOW_DB_NAME } from '../../utils/config'
import { AllowedTables, WriteItem, debugLog, ids, printJSON } from './writeUtils'

const tableToId: Record<string, string> = { now_lau: 'lid', now_sau: 'species_id', now_tau: 'tu_name', now_bau: 'bid' }
const getUpdateIdField = (tableName: string) => `${tableName[4]}uid`

export const createUpdateEntry = async (
  conn: PoolConnection,
  prefix: 'sau' | 'tau' | 'lau' | 'bau',
  coordinator: string,
  authorizer: string,
  comment: string,
  id: string | number
) => {
  const table = `now_${prefix}`
  const idField = getUpdateIdField(table)
  const result: object[] = await conn.query(
    `INSERT INTO ${NOW_DB_NAME}.${table} (${prefix}_coordinator, ${prefix}_authorizer, ${tableToId[table]}, ${prefix}_date, ${prefix}_comment) VALUES (?, ?, ?, ?, ?) RETURNING ${table}.${idField}`,
    [coordinator, authorizer, id, new Date(), comment]
  )
  debugLog(`createUpdateEntry result before returning: ${printJSON(result)}`)
  return result?.[0]?.[idField as keyof object] as string | number
}

export const writeToLog = async (
  conn: PoolConnection,
  writeList: WriteItem[],
  tableName: AllowedTables,
  updateEntryId: number | string,
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
      `INSERT INTO ${LOG_DB_NAME}.log (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      values
    )
    debugLog(`Writing into log-db: ${printJSON(row)}`)
  }
}
