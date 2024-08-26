import { Reference } from '../../../../../frontend/src/backendTypes'
import { LOG_DB_NAME } from '../../../utils/config'
import { LogRow, ActionType, AllowedTables, UpdateEntry } from '../types'
import { WriteHandler } from '../writeHandler'
import { getFormattedDate, prefixToIdColumn, primaryTableToUpdatePrefix, updateTableToIdColumn } from './utils'

export const writeLogRows = async (writeHandler: WriteHandler, logRows: LogRow[], authorizer: string) => {
  const actionTypeToDbFormat: Record<ActionType, number> = {
    delete: 1,
    add: 2,
    update: 3,
  }

  const updateRows = logRows.map(logRow => ({
    event_time: getFormattedDate(),
    user_name: authorizer,
    server_name: 'sysbiol',
    table_name: logRow.table,
    pk_data: logRow.pkData,
    column_name: logRow.column,
    log_action: actionTypeToDbFormat[logRow.type],
    old_data: logRow.oldValue,
    new_data: logRow.value,
    suid: logRow.suid ?? null,
    luid: logRow.luid ?? null,
    buid: logRow.buid ?? null,
    tuid: logRow.tuid ?? null,
  }))

  writeHandler.dbName = LOG_DB_NAME
  for (const row of updateRows) {
    await writeHandler.createObject('log' as AllowedTables, row, ['log_id'])
  }
}

export const createUpdateEntry = async (
  writeHandler: WriteHandler,
  prefix: 'sau' | 'tau' | 'lau' | 'bau',
  coordinator: string,
  authorizer: string,
  comment: string,
  id: string | number
) => {
  const table = `now_${prefix}` as AllowedTables
  const idField = prefixToIdColumn[prefix]
  const result = await writeHandler.createObject(
    table,
    {
      [`${prefix}_coordinator`]: coordinator,
      [`${prefix}_authorizer`]: authorizer,
      [`${prefix}_date`]: getFormattedDate(),
      [updateTableToIdColumn[table]]: id,
      [`${prefix}_comment`]: comment,
    },
    [idField]
  )
  return result[idField] as number
}

export const writeReferences = async (
  writeHandler: WriteHandler,
  updateEntries: UpdateEntry[],
  references: Reference[]
) => {
  const referenceIds = references.map(ref => ref.rid)
  for (const updateEntry of updateEntries) {
    const id = updateEntry.entryId
    const idField = prefixToIdColumn[primaryTableToUpdatePrefix[updateEntry.table]]
    const referenceJoinTable = `now_${primaryTableToUpdatePrefix[updateEntry.table][0]}r` as AllowedTables
    for (const referenceId of referenceIds) {
      await writeHandler.createObject(referenceJoinTable, { [idField]: id, rid: referenceId }, [idField, 'rid'])
    }
  }
}
