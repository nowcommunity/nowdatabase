import { Reference } from '../../../../../../frontend/src/shared/types'
import { COORDINATOR } from '../../../../utils/config'
import { AllowedTables, ActionType, Item, LogRow, PrimaryTables, WriteItem, UpdateEntry } from '../types'
import { WriteHandler } from '../writeHandler'
import { filterRelevantLogRows, prefixToIdColumn, primaryTableToUpdatePrefix, tableToUpdateTargets } from './utils'
import { createUpdateEntry, writeLogRows, writeReferences } from './writeUpdates'

export const logAllUpdates = async (
  writeHandler: WriteHandler,
  writeList: WriteItem[],
  tableName: PrimaryTables,
  id: string | number,
  userInitials: string,
  type: ActionType,
  comment?: string,
  references?: Reference[]
) => {
  if (type !== 'delete' && (comment === undefined || !references))
    throw new Error('Comment or references missing on update')

  const updateEntries: UpdateEntry[] = []
  const getIdColumn = (targetTable: AllowedTables) => {
    if (targetTable === 'com_species') return 'species_id'
    if (targetTable === 'now_mus') return 'museum'
    if (targetTable === 'now_ls') return tableName === 'now_loc' ? 'species_id' : 'lid'
    if (targetTable === 'now_loc') return 'lid'
    if (targetTable === 'now_ss') return 'sed_struct'
    if (targetTable === 'com_taxa_synonym') return 'synonym_id'
    if (targetTable === 'now_coll_meth') return 'coll_meth'
    if (targetTable === 'now_syn_loc') return 'syn_id'
    if (targetTable === 'now_plr') return 'pid'
    throw new Error(`No id column found for ${targetTable}`)
  }

  const getSecondaryPkData = (table: AllowedTables, items: Item[]) => {
    if (table === tableName) return ''
    const secondaryId = items.find(item => item.column === getIdColumn(table))?.value
    if (!secondaryId) throw new Error(`No id value found for ${table}`)
    return `${secondaryId.toString().length}.${secondaryId};`
  }

  if (type !== 'delete') {
    const rootUpdateEntry: UpdateEntry = {
      type,
      table: tableName,
      id,
      logRows: writeList.flatMap(writeItem =>
        writeItem.items
          .filter(item => filterRelevantLogRows(item, tableName))
          .map(item => ({
            ...item,
            type: writeItem.type,
            pkData: `${id.toString().length}.${id};${getSecondaryPkData(writeItem.table, writeItem.items)}`,
          }))
      ),
    }

    updateEntries.push(rootUpdateEntry)
  }
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
      if (secondaryUpdateEntries[targetTable][secondaryId]) {
        secondaryUpdateEntries[targetTable][secondaryId] = {
          ...secondaryUpdateEntries[targetTable][secondaryId],
          logRows: [
            ...secondaryUpdateEntries[targetTable][secondaryId].logRows,
            ...writeListItem.items.map(item => ({ ...item, pkData, type: writeListItem.type })),
          ],
        }
      } else {
        secondaryUpdateEntries[targetTable][secondaryId] = {
          id: secondaryId,
          table: targetTable,
          type: writeListItem.type,
          logRows: writeListItem.items.map(item => ({ ...item, pkData, type: writeListItem.type })),
        }
      }
    }
  }

  for (const tableUpdates of Object.values(secondaryUpdateEntries)) {
    for (const singleUpdateOfTable of Object.values(tableUpdates)) {
      updateEntries.push(singleUpdateOfTable)
    }
  }

  if (type !== 'delete') {
    // Write the update-entries: This inserts the id's that are created into the objects.
    await writeUpdateEntries(writeHandler, updateEntries, userInitials, comment!)

    await writeReferences(writeHandler, updateEntries, references!)
  }

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
    const idFieldName = prefixToIdColumn[primaryTableToUpdatePrefix[updateEntry.table]]
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
    const prefix = primaryTableToUpdatePrefix[updateEntry.table]
    const createdId = await createUpdateEntry(writeHandler, prefix, COORDINATOR, authorizer, comment, updateEntry.id)
    updateEntry.entryId = createdId
  }
  return updateEntries
}
