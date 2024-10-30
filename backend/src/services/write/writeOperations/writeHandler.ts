import { Reference, RowState } from '../../../../../frontend/src/backendTypes'
import { logger } from '../../../utils/logger'
import { logAllUpdates } from './updateLogger/prepareUpdates'
import { DatabaseHandler, DbWriteItem } from './databaseHandler'
import { fixBoolean, getItemList, isEmptyValue, valueIsDifferent } from './utils'
import { ActionType, AllowedTables, DbValue, Item, PrimaryTables, WriteItem } from './types'

type WriteHandlerParams = {
  dbName: string
  table: PrimaryTables
  idColumn: string
  allowedColumns: string[]
  type: ActionType
}

/* Handles writing logic that are agnostic of datatype, but not directly operations to db. */
/* Usage: after constructor, initialize with writeHandler.start. Assign value to idValue whever you have it. */
export class WriteHandler extends DatabaseHandler {
  table: PrimaryTables
  writeList: WriteItem[] = []
  idColumn: string
  idValue?: string | number
  type: ActionType

  constructor({ dbName, table, type, idColumn, allowedColumns }: WriteHandlerParams) {
    super(dbName, allowedColumns)
    this.table = table
    this.idColumn = idColumn
    this.type = type
  }

  async createRow<T extends Record<string, DbValue>>(table: AllowedTables, items: DbWriteItem[], ids: string[]) {
    const returnValue = await super.insert<T>(table, items, ids)
    // If ID was created, add it to writelist also.
    for (const id of ids) {
      if (!items.find(item => item.column === id && item.value)) {
        items.push({ column: id, value: returnValue[id] })
      }
    }
    this.writeList.push({
      table,
      type: 'add',
      items: items.filter(item => !isEmptyValue(item.value)).map(item => ({ ...item, table })),
    })
    return returnValue
  }

  /* Checks each field for their old value and if they did not (meaningfully) change,
     they are skipped, otherwise they are written to database.
     table: Table to write to
     items: Column & value pairs that should be written
     ids: Column & value pairs that define which item to write to. Empty if new item. */
  async updateRow<T extends Record<string, DbValue>>(table: AllowedTables, items: DbWriteItem[], ids: DbWriteItem[]) {
    const oldObject = await super.select<T>(table, [], ids)
    const fieldsToWrite: Item[] = []

    for (const { column, value } of items) {
      const oldValue = oldObject[column as keyof T]

      const fixedValue = fixBoolean(value)
      if (!valueIsDifferent(fixedValue, oldValue)) continue
      fieldsToWrite.push({ column, value: fixedValue, oldValue, table })
    }

    this.writeList.push({ table, type: 'update', items: fieldsToWrite.map(item => ({ ...item, table })) })
    if (fieldsToWrite.length === 0) return
    return await super.update(table, fieldsToWrite, ids)
  }

  async createObject<T extends Record<string, unknown>>(table: AllowedTables, object: T, idColumns: string[]) {
    if (idColumns.includes(this.idColumn) && this.idValue && !object[this.idColumn]) {
      ;(object as Record<string, unknown>)[this.idColumn] = this.idValue
    }
    const itemsToWrite = getItemList({ ...object }, true)
    return await this.createRow<Record<keyof T, DbValue>>(table, itemsToWrite, idColumns)
  }

  async updateObject<T extends Record<string, unknown>>(table: AllowedTables, object: T, idColumns: string[]) {
    const ids = idColumns.map(column => ({ column, value: object[column] as DbValue }))
    const itemsToWrite = getItemList(object, true)
    return await this.updateRow<Record<keyof T, DbValue>>(table, itemsToWrite, ids)
  }

  async deleteObject<T extends Record<string, unknown>>(table: AllowedTables, object: T, idColumns: string[]) {
    // Get id's, log as deleted, delete
    const ids = idColumns.map(idColumn => ({ column: idColumn, value: object[idColumn] as DbValue }))
    const oldObject = await this.select<T>(table, [], ids)
    const deletedItems = getItemList(oldObject)
    this.writeList.push({
      table,
      type: 'delete',
      // NOTE: oldValue and value are swapped here, but they are logged correctly in update!
      items: deletedItems
        .filter(item => !isEmptyValue(item.value))
        .map(item => ({ table, column: item.column, oldValue: '', value: item.value })),
    })
    return await this.delete(table, ids)
  }

  async upsertObject<T extends Record<string, unknown>>(table: AllowedTables, object: T, idColumns: string[]) {
    if (idColumns.includes(this.idColumn) && this.idValue && !object[this.idColumn]) {
      ;(object as Record<string, unknown>)[this.idColumn] = this.idValue
    }
    if (idColumns.find(idCol => !object[idCol])) return await this.createObject(table, object, idColumns)
    return await this.updateObject<T>(table, object, idColumns)
  }

  /* Takes in a list of objects which are of Editable type, meaning they have a rowState field. Either adds or removes a join relation. */
  async applyListChanges<T extends { rowState?: RowState }>(table: AllowedTables, objects: T[], idColumns: string[]) {
    for (const object of objects) {
      const rowState = object.rowState
      if (rowState === 'new') {
        await this.createObject(table, object, idColumns)
      } else if (rowState === 'removed') {
        await this.deleteObject(table, object, idColumns)
      }
    }
  }

  async logUpdatesAndComplete(authorizer: string, comment?: string, references?: Reference[]) {
    if (this.writeList.flatMap(writeItem => writeItem.items).length === 0) {
      logger.info(`No changes detected, skipping logging.`)
    } else {
      await logAllUpdates(this, this.writeList, this.table, this.idValue!, authorizer, this.type, comment, references)
    }
    await this.commit()
    await this.end()
  }
}
