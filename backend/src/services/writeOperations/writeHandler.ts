import { RowState } from '../../../../frontend/src/backendTypes'
import { AllowedTables, DbValue, PrimaryTables, WriteItem } from '../write/writeUtils'
import { DatabaseHandler, DbWriteItem } from './databaseHandler'
import { fixBoolean, getItemList, valueIsDifferent } from './utils'

/* Handles writing logic that are agnostic of datatype, but not directly operations to db. */
/* Usage: after constructor, initialize with writeHandler.start. Assign value to idValue whever you have it. */
export class WriteHandler extends DatabaseHandler {
  table: PrimaryTables
  writeList: WriteItem[] = []
  idColumn: string
  idValue?: string | number
  allowedColumns: string[]

  constructor(dbName: string, table: PrimaryTables, idColumn: string, allowedColumns: string[]) {
    super(dbName)
    this.table = table
    this.idColumn = idColumn
    this.allowedColumns = allowedColumns
  }

  async createRow<T extends Record<string, DbValue>>(
    table: AllowedTables,
    items: DbWriteItem[],
    idsToReturn: string[]
  ) {
    this.writeList.push({ table, type: 'add', items: items.map(item => ({ ...item, table })) })
    return await super.insert<T>(table, items, idsToReturn)
  }

  /* Checks each field for their old value and if they did not (meaningfully) change,
     they are skipped, otherwise they are written to database.
     table: Table to write to
     items: Column & value pairs that should be written
     ids: Column & value pairs that define which item to write to. Empty if new item. */
  async updateRow<T extends Record<string, DbValue>>(table: AllowedTables, items: DbWriteItem[], ids: DbWriteItem[]) {
    const oldObject = await super.select<T>(table, [], ids)
    const fieldsToWrite: DbWriteItem[] = []
    // TODO put oldValue here too for logging
    for (const { column, value } of items) {
      const oldValue = oldObject[column as keyof T]

      const fixedValue = fixBoolean(value)
      if (!valueIsDifferent(fixedValue, oldValue)) continue

      fieldsToWrite.push({ column, value: fixedValue })
    }
    if (items.find(item => !this.allowedColumns.includes(item.column))) {
      throw new Error('Unallowed column in SQL')
    }
    this.writeList.push({ table, type: 'update', items: items.map(item => ({ ...item, table })) })
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

  async upsertObject<T extends Record<string, unknown>>(table: AllowedTables, object: T, idColumns: string[]) {
    if (idColumns.includes(this.idColumn) && this.idValue && !object[this.idColumn]) {
      ;(object as Record<string, unknown>)[this.idColumn] = this.idValue
    }
    if (idColumns.find(idCol => !object[idCol])) return await this.createObject(table, object, idColumns)
    return await this.updateObject<T>(table, object, idColumns)
  }

  async upsertList<T extends { rowState?: RowState }>(table: AllowedTables, objects: T[], idColumns: string[]) {
    for (const object of objects) {
      const rowState = object.rowState
      if (rowState === 'new') {
        await this.createObject(table, object, idColumns)
      } else if (rowState === 'removed') {
        await this.delete(
          table,
          idColumns.map(idColumn => ({ column: idColumn, value: object[idColumn as keyof T] as DbValue }))
        )
      }
    }
  }
}
