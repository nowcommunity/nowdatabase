import { PoolConnection } from 'mariadb'
import { AllowedTables } from './writeUtils'
import { NOW_DB_NAME } from '../../utils/config'
import { pool } from '../../utils/db'
import { logger } from '../../utils/logger'

const deleteFromTable = async (
  table: AllowedTables,
  idColumn: string,
  id: string | number,
  returnColumns: string[],
  connection: PoolConnection
) => {
  return await connection.query<Array<{ [key: string]: string | number }>>(
    `DELETE FROM ${NOW_DB_NAME}.${table} WHERE ${idColumn} = ? RETURNING ${returnColumns.join(', ')}`,
    [id]
  )
}

export const deleteLocality = async (id: string | number) => {
  const connection = await pool.getConnection()
  const deletedLocalitySpecies = await deleteFromTable('now_ls', 'lid', id, ['lid', 'species_id'], connection)
  logger.info(`Deleted following locality species: ${deletedLocalitySpecies.toString()}`)
  await deleteFromTable('now_loc', 'lid', id, ['lid'], connection)
  // TODO: Log, inside a transaction
  await connection.end()
}
