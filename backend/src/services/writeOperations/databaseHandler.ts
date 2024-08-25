import { PoolConnection } from 'mariadb'
import { AllowedTables, DbValue } from '../write/writeUtils'
import { logger } from '../../utils/logger'
import { pool } from '../../utils/db'

export type DbWriteItem = { column: string; value: DbValue }

const createWhereClause = (idColumns: string[]) => `${idColumns.map(idColumn => `${idColumn} = ?`).join(' AND ')}`

export class DatabaseHandler {
  connection?: PoolConnection
  dbName: string
  constructor(dbName: string) {
    this.dbName = dbName
  }
  async start() {
    this.connection = await pool.getConnection()
    await this.connection.beginTransaction()
  }

  async end() {
    if (!this.connection) throw new Error('DB connection not initialized')
    await this.connection.commit()
    await this.connection.end()
  }

  getValuesAndColumns(items: DbWriteItem[]) {
    return { values: items.map(item => item.value), columns: items.map(item => item.column) }
  }

  async insert<T>(table: AllowedTables, items: DbWriteItem[], returnColumns?: string[]) {
    const returnString = returnColumns ? `RETURNING ${returnColumns.join(', ')}` : ''
    const { columns, values } = this.getValuesAndColumns(items)
    const returnValue = await this.executeQuery<T>(
      `INSERT INTO ${this.dbName}.${table} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')}) ${returnString}`,
      values
    )
    return (returnValue as T[])[0]
  }

  async update(table: AllowedTables, items: DbWriteItem[], ids: DbWriteItem[]) {
    const { columns, values } = this.getValuesAndColumns(items)
    const columnsString = columns.join(', ')

    const { columns: idColumns, values: idValues } = this.getValuesAndColumns(ids)
    const whereClause = createWhereClause(idColumns)

    await this.executeQuery(`UPDATE ${this.dbName}.${table} (${columnsString}) WHERE ${whereClause}`, [
      ...values,
      ...idValues,
    ])
  }

  /* If return columns are not defined, returns the id columns given as argument. */
  async delete(table: AllowedTables, ids: DbWriteItem[], returnColumns?: string[]) {
    const { columns: idColumns, values: idValues } = this.getValuesAndColumns(ids)
    const whereClause = createWhereClause(idColumns)
    const returningClause = returnColumns?.join(' ,') ?? `${idColumns.join(', ')}`
    return await this.executeQuery(
      `DELETE FROM ${this.dbName}.${table} WHERE ${whereClause} RETURNING ${returningClause}`,
      idValues
    )
  }

  async select<T>(table: AllowedTables, columns: string[], ids: DbWriteItem[]) {
    const columnsString = columns.length === 0 ? '*' : columns.map(col => `${this.dbName}.${col}`).join(', ')
    const { columns: idColumns, values: idValues } = this.getValuesAndColumns(ids)
    const whereClause = createWhereClause(idColumns)
    return await this.executeQuery<T>(
      `SELECT ${columnsString} FROM ${this.dbName}.${table} WHERE ${whereClause}`,
      idValues
    )
  }

  async executeQuery<T>(query: string, values?: Array<DbValue>) {
    if (!this.connection) throw new Error('DB connection not initialized')

    logger.info(`Executing SQL query: ${query} \nWith values ${JSON.stringify(values)}\n`)
    let returnValue
    if (values) {
      returnValue = await this.connection.query<T>(query, values)
    } else {
      returnValue = await this.connection.query<T>(query)
    }
    return returnValue
  }
}
