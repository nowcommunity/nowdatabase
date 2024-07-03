import { sleep } from './common'
import { logger } from './logger'
import { PrismaClient as NowClient } from '../../prisma/generated/now_test_client'
import { PrismaClient as LogClient } from '../../prisma/generated/now_log_test_client'
import mariadb from 'mariadb'
import { MARIADB_HOST, MARIADB_PASSWORD, DB_CONNECTION_LIMIT } from './config'

export const logDb = new LogClient()
export const nowDb = new NowClient()

export const pool = mariadb.createPool({
  host: MARIADB_HOST,
  password: MARIADB_PASSWORD,
  user: 'now_test',
  connectionLimit: parseInt(DB_CONNECTION_LIMIT),
})

export const testMariaDb = async () => {
  logger.info('Testing direct mariadb-connection...')
  const conn = await pool.getConnection()
  await conn.query('SELECT * FROM now_test.now_loc LIMIT 5')
  await conn.query('SELECT * FROM now_log_test.log LIMIT 5')
  logger.info('Connections to both databases via direct mariadb-connector work.')
  if (conn) return conn.end()
}

export const testDb = async () => {
  logger.info('Testing Prisma-connection...')
  await nowDb.now_loc.findFirst({})
  await logDb.log.findFirst({})
  logger.info('Connection to now database via Prisma works.')
}

export const testDbConnection = async () => {
  const tryDbConnection = async () => {
    try {
      await testDb()
      await testMariaDb()
      return true
    } catch (e) {
      if (e instanceof Error) logger.error(e.toString())
      else logger.error('DB connection failed with unknown error type')
      return false
    }
  }
  const maxAttempts = 20
  let attempts = 0
  while (attempts < maxAttempts) {
    const success = await tryDbConnection()
    if (success) {
      return
    }
    logger.info(`Trying again in 6 seconds, attempt ${attempts} / ${maxAttempts}`)
    attempts++
    await sleep(6000)
  }
  logger.error(`Attempted ${maxAttempts} times, but database connection could not be established`)
}
