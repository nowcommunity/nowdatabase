import { PoolConnection } from 'mariadb'
import { pool } from '../../../utils/db'
import { DbValue, AllowedTables } from './types'
import { RUNNING_ENV } from '../../../utils/config'
import { logger } from '../../../utils/logger'
import { fixBigInt } from '../../../utils/common'

export type DbWriteItem = { column: string; value: DbValue }

export class DatabaseHandler {
  connection?: PoolConnection
  dbName: string
  allowedColumns: Set<string>

  constructor(dbName: string, allowedColumns: string[]) {
    this.dbName = dbName
    this.allowedColumns = new Set(allowedColumns)
  }

  checkColumn(column: string) {
    if (!this.allowedColumns.has(column)) throw new Error(`Non-allowed column: ${column}`)
    return column
  }

  createWhereClause(idColumns: string[]) {
    return `${idColumns
      .map(idColumn => {
        return `${this.checkColumn(idColumn)} = ?`
      })
      .join(' AND ')}`
  }

  async start() {
    this.connection = await pool.getConnection()
    await this.connection.beginTransaction()
  }

  async rollback() {
    if (!this.connection) throw new Error('DB connection not initialized')
    await this.connection.rollback()
  }

  async end() {
    if (!this.connection) throw new Error('DB connection not initialized')
    const connection = this.connection
    this.connection = undefined
    await connection.end()
  }

  async commit() {
    if (!this.connection) throw new Error('DB connection not initialized')
    await this.connection.commit()
  }

  getValuesAndColumns(items: DbWriteItem[]) {
    return { values: items.map(item => item.value), columns: items.map(item => item.column) }
  }

  buildIdResult<T>(items: DbWriteItem[], returnColumns?: string[], insertId?: unknown) {
    if (!returnColumns || returnColumns.length === 0) {
      return {} as T
    }

    const result: Record<string, DbValue> = {}

    for (const column of returnColumns) {
      const existingItem = items.find(item => item.column === column && item.value !== undefined)
      if (existingItem) {
        result[column] = existingItem.value
        continue
      }

      if (typeof insertId === 'number') {
        result[column] = insertId
      }
    }

    return result as T
  }

  async insert<T>(table: AllowedTables, items: DbWriteItem[], returnColumns?: string[]) {
    const { columns, values } = this.getValuesAndColumns(items)
    await this.executeQuery(
      `INSERT INTO ${this.dbName}.${table} (${columns.map(column => this.checkColumn(column)).join(', ')}) VALUES (${values.map(() => '?').join(', ')})`,
      values
    )

    const allReturnColumnsProvided =
      returnColumns?.every(column => items.some(item => item.column === column && item.value !== undefined)) ?? false

    if (allReturnColumnsProvided) {
      return this.buildIdResult<T>(items, returnColumns)
    }

    const lastInsertIdResult = await this.executeQuery<Array<{ insertId?: number; 'LAST_INSERT_ID()'?: number }>>(
      'SELECT LAST_INSERT_ID() AS insertId'
    )
    const insertId = lastInsertIdResult[0]?.insertId ?? lastInsertIdResult[0]?.['LAST_INSERT_ID()']

    return this.buildIdResult<T>(items, returnColumns, insertId)
  }

  async update(table: AllowedTables, items: DbWriteItem[], ids: DbWriteItem[]) {
    const { columns, values } = this.getValuesAndColumns(items)
    const columnsString = columns.map(col => `${this.checkColumn(col)} = ?`).join(', ')

    const { columns: idColumns, values: idValues } = this.getValuesAndColumns(ids)
    const whereClause = this.createWhereClause(idColumns)

    await this.executeQuery(`UPDATE ${this.dbName}.${table} SET ${columnsString} WHERE ${whereClause}`, [
      ...values,
      ...idValues,
    ])
  }

  /* If return columns are not defined, returns the id columns given as argument. */
  async delete(table: AllowedTables, ids: DbWriteItem[], returnColumns?: string[]) {
    const { columns: idColumns, values: idValues } = this.getValuesAndColumns(ids)
    const whereClause = this.createWhereClause(idColumns)
    await this.executeQuery(`DELETE FROM ${this.dbName}.${table} WHERE ${whereClause}`, idValues)
    return this.buildIdResult(ids, returnColumns ?? idColumns)
  }

  async select<T>(table: AllowedTables, columns: string[], ids: DbWriteItem[]) {
    const columnsString =
      columns.length === 0 ? '*' : columns.map(col => `${this.dbName}.${this.checkColumn(col)}`).join(', ')
    const { columns: idColumns, values: idValues } = this.getValuesAndColumns(ids)
    const whereClause = this.createWhereClause(idColumns)
    const returnValue = (
      await this.executeQuery<T[]>(
        `SELECT ${columnsString} FROM ${this.dbName}.${table} WHERE ${whereClause}`,
        idValues
      )
    )[0]
    return JSON.parse(fixBigInt(returnValue as object)!) as T
  }

  async executeQuery<T>(query: string, values?: Array<DbValue>) {
    if (!this.connection) throw new Error('DB connection not initialized')

    if (RUNNING_ENV === 'dev') logger.info(`Executing SQL query: ${query} \nWith values ${JSON.stringify(values)}\n`)
    let returnValue
    if (values) {
      returnValue = await this.connection.query<T>(query, values)
    } else {
      returnValue = await this.connection.query<T>(query)
    }
    return returnValue
  }
}
