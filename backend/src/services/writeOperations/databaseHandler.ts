import { PoolConnection } from 'mariadb'
import { AllowedTables, DbValue } from '../write/writeUtils'
import { logger } from '../../utils/logger'
import { NOW_DB_NAME } from '../../utils/config'

export class DatabaseHandler {
  connection: PoolConnection

  constructor(connection: PoolConnection) {
    this.connection = connection
  }

  async start() {
    await this.connection.beginTransaction()
  }

  async end() {
    await this.connection.commit()
    await this.connection.end()
  }

  async insert(table: AllowedTables, items: Array<{ column: string; value: DbValue }>, returnColumns?: string[]) {
    const returnString = returnColumns ? `RETURNING ${returnColumns.join(', ')}` : ''
    const columns = items.map(item => item.column)
    const values = items.map(item => item.value)
    return (await this.executeQuery(`INSERT INTO ${NOW_DB_NAME}.${table} (?) VALUES (?) ${returnString}`, [
      columns,
      values,
    ])) as {
      [key: string]: DbValue
    }[]
  }

  async insert(table: AllowedTables, items: Array<{ column: string; value: DbValue }>, returnColumns?: string[]) {}

  async executeQuery(query: string, values?: Array<DbValue[]>) {
    logger.info(`Executing SQL query: ${query}`)
    return (await this.connection.query(query, values)) as unknown
  }
}
