import { sleep } from './common'
import { logger } from './logger'
import { PrismaClient as NowClient } from '../../prisma/generated/now_test_client'
import { PrismaClient as LogClient } from '../../prisma/generated/now_log_test_client'
import mariadb from 'mariadb'
import { MARIADB_HOST, MARIADB_PASSWORD } from './config'
import { LocalityDetailsType } from '../../../frontend/src/backendTypes'

export const logDb = new LogClient()
export const nowDb = new NowClient()

export const pool = mariadb.createPool({
  host: MARIADB_HOST,
  password: MARIADB_PASSWORD,
  user: 'now_test',
  connectionLimit: 5,
})

export const testMariaDb = async () => {
  const connect = async () => {
    const conn = await pool.getConnection()
    const rows: LocalityDetailsType[] = await conn.query('SELECT * FROM now_test.now_loc LIMIT 5')
    const logRows: unknown[] = await conn.query('SELECT * FROM now_log_test.log LIMIT 5')
    if (conn) return conn.end()
  }
  await connect()
}

export const testDb = async () => {
  logger.info('Testing db...')
  await nowDb.now_loc.findFirst({})
  logger.info('Db seems to work.')
}

export const testDbConnection = async () => {
  logger.info(`Attempting to connect to database...`)
  const tryDbConnection = async () => {
    try {
      await testDb()
      // await testMariaDb()
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
