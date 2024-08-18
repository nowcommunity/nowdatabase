import { PoolConnection } from 'mariadb'
import { LOG_DB_NAME, NOW_DB_NAME } from '../../utils/config'
import { ActionType, LogRow, debugLog, printJSON } from './writeUtils'

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
  return result?.[0]?.[idField as keyof object] as number
}

export const writeLogRows = async (conn: PoolConnection, logRows: LogRow[], authorizer: string) => {
  const actionTypeToDbFormat: Record<ActionType, number> = {
    delete: 1,
    add: 2,
    update: 3,
  }
  const updateRows = logRows.map(logRow => ({
    event_time: new Date(),
    user_name: authorizer,
    server_name: 'sysbiol',
    table_name: logRow.table,
    pk_data: logRow.pkData,
    column_name: logRow.column,
    // 1 = delete, 2 = add, 3 = update
    log_action: actionTypeToDbFormat[logRow.type],
    old_data: logRow.oldValue,
    new_data: logRow.value,
    suid: logRow.suid ?? null,
    luid: logRow.luid ?? null,
    buid: logRow.buid ?? null,
    tuid: logRow.tuid ?? null,
  }))

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
