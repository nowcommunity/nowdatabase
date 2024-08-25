import { Reference } from '../../../../frontend/src/backendTypes'
import { COORDINATOR, LOG_DB_NAME } from '../../utils/config'
import { AllowedTables, ActionType, Item, LogRow, PrimaryTables, WriteItem, UpdateEntry } from './types'
import { WriteHandler } from './writeHandler'

const tableNameToPrefix = {
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
const tableToUpdateTargets = {
  now_ls: ['now_loc', 'com_species'],
} as Record<AllowedTables, PrimaryTables[] | undefined>

export const logAllUpdates = async (
  writeHandler: WriteHandler,
  writeList: WriteItem[],
  tableName: PrimaryTables,
  id: string | number,
  userInitials: string,
  comment: string,
  references: Reference[],
  type: ActionType
) => {
  const updateEntries: UpdateEntry[] = []
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
    type,
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
  await writeUpdateEntries(writeHandler, updateEntries, userInitials, comment)

  await writeReferences(writeHandler, updateEntries, references)

  // The write has value and oldValue swapped for 'delete' type logRows due to reasons.
  // It is simpler to fix it here than changing how write works, because values are used to find id's above.
  const fixDeleteRows = (logRow: LogRow) => {
    if (logRow.type !== 'delete') return logRow
    return { ...logRow, oldValue: logRow.value, value: null }
  }
  const logRows = mergeLogRows(updateEntries).map(logRow => fixDeleteRows(logRow))

  await writeLogRows(writeHandler, logRows, userInitials)
}

const mergeLogRows = (updateEntries: UpdateEntry[]) => {
  const getLogRowKey = (logRow: LogRow) => {
    return `${logRow.column}-${logRow.value}-${logRow.oldValue}-${logRow.table}-${logRow.pkData}`
  }

  const logRowMap: Record<string, LogRow> = {}

  // Iterate through updateEntries. Collect logrows into map. LogRows with identical data may be in multiple
  // updateEntries, such as now_ls rows in locality and species. These should be merged so that only one is left,
  // but with both id's (luid and suid) found in the updateEntries.
  for (const updateEntry of updateEntries) {
    const idFieldName = prefixToIdColumn[tableNameToPrefix[updateEntry.table]]
    console.log({ idFieldName, updateEntry })
    for (const logRow of updateEntry.logRows) {
      const key = getLogRowKey(logRow)
      logRowMap[key] = { ...(logRowMap[key] ? logRowMap[key] : logRow), [idFieldName]: updateEntry.entryId }
    }
  }
  return Object.values(logRowMap)
}

const writeUpdateEntries = async (
  writeHandler: WriteHandler,
  updateEntries: UpdateEntry[],
  authorizer: string,
  comment: string
) => {
  for (const updateEntry of updateEntries) {
    const prefix = tableNameToPrefix[updateEntry.table]
    const createdId = await createUpdateEntry(writeHandler, prefix, COORDINATOR, authorizer, comment, updateEntry.id)
    updateEntry.entryId = createdId
  }
  return updateEntries
}

const writeReferences = async (writeHandler: WriteHandler, updateEntries: UpdateEntry[], references: Reference[]) => {
  const referenceIds = references.map(ref => ref.rid)
  for (const updateEntry of updateEntries) {
    const id = updateEntry.entryId
    const idField = prefixToIdColumn[tableNameToPrefix[updateEntry.table]]
    const referenceJoinTable = `now_${tableNameToPrefix[updateEntry.table][0]}r` as AllowedTables
    for (const referenceId of referenceIds) {
      await writeHandler.createObject(referenceJoinTable, { [idField]: id, rid: referenceId }, [idField, 'rid'])
    }
  }
}

const updateTableToIdColumn: Record<string, string> = {
  now_lau: 'lid',
  now_sau: 'species_id',
  now_tau: 'tu_name',
  now_bau: 'bid',
}

const prefixToIdColumn = {
  lau: 'luid',
  sau: 'suid',
  tau: 'tuid',
  bau: 'buid',
}

export const getFormattedDate = () => new Date()

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
  console.log({ result, up: updateTableToIdColumn, table, idField, prefix })
  return result[idField] as number
}

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
