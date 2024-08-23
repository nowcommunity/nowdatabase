import { AllowedTables, PrimaryTables, WriteItem } from '../write/writeUtils'
import { DatabaseHandler, DbWriteItem } from './databaseHandler'
import { valueIsDifferent } from './utils'

/* Handles writing logic that are agnostic of datatype, but not directly operations to db. */
export class WriteHandler extends DatabaseHandler {
  table: PrimaryTables
  writeList: WriteItem[] = []

  constructor(dbName: string, table: PrimaryTables) {
    super(dbName)
    this.table = table
  }

  /* Checks each field for their old value and if they did not (meaningfully) change,
     they are skipped, otherwise they are written to database.
     table: Table to write to
     items: Column & value pairs that should be written
     ids: Column & value pairs that define which item to write to. Empty if new item. */
  async writeTable<T>(table: AllowedTables, items: DbWriteItem[], ids: DbWriteItem[], idsToReturn: string[]) {
    if (ids.length === 0) {
      this.writeList.push({ table, type: 'add', items: items.map(item => ({ ...item, table })) })
      return await super.insert(table, items, idsToReturn)
    }

    const oldObject = await super.select<T>(table, [], ids)
    const fieldsToWrite: DbWriteItem[] = []

    for (const { column, value } of items) {
      const oldValue = oldObject[column as keyof T]

      if (!valueIsDifferent(value, oldValue)) continue

      fieldsToWrite.push({ column, value })
    }

    this.writeList.push({ table, type: 'update', items: items.map(item => ({ ...item, table })) })

    return await super.update(table, fieldsToWrite, ids)
  }
}
