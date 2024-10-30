import { sleep } from './common'
import { logger } from './logger'
import { PrismaClient as NowClient } from '../../prisma/generated/now_test_client'
import { PrismaClient as LogClient } from '../../prisma/generated/now_log_test_client'
import mariadb from 'mariadb'
import { MARIADB_HOST, MARIADB_PASSWORD, DB_CONNECTION_LIMIT, MARIADB_USER, RUNNING_ENV } from './config'

import { readFile } from 'fs/promises'
import { PathLike } from 'fs'

export const logDb = new LogClient()
export const nowDb = new NowClient()

export const getFieldsOfTables = (tables: string[]) => {
  return [
    ...tables.flatMap(table =>
      Object.keys((nowDb[table as keyof object] as unknown as Record<string, { fields: object }>).fields as never)
    ),
    ...Object.keys(logDb.log.fields),
    ...Object.keys(nowDb.ref_ref.fields),
  ]
}

export const pool = mariadb.createPool({
  host: MARIADB_HOST,
  password: MARIADB_PASSWORD,
  user: MARIADB_USER,
  connectionLimit: parseInt(DB_CONNECTION_LIMIT),
  checkDuplicate: false,
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
  const maxAttempts = 25
  let attempts = 0
  while (attempts < maxAttempts) {
    const success = await tryDbConnection()
    if (success) {
      return
    }
    logger.info(`Trying again in 4 seconds, attempt ${attempts} / ${maxAttempts}`)
    attempts++
    await sleep(4000)
  }
  logger.error(`Attempted ${maxAttempts} times, but database connection could not be established`)
}

// TODO this is very slow to execute, around 4500ms each time. Not good...
export const resetTestDb = async () => {
  if (RUNNING_ENV !== 'dev') throw new Error(`Trying to reset test database with RUNNING_ENV ${RUNNING_ENV}`)
  logger.info("Resetting test database...")

  const createTestConnection = (dbName: string) => {
    return mariadb.createConnection({
      host: MARIADB_HOST,
      password: process.env.MARIADB_ROOT_PASSWORD,
      user: 'root',
      checkDuplicate: false,
      multipleStatements: true,
      database: dbName,
      trace: true,
    })
  }

  const connNow = await createTestConnection('now_test')
  const connLog = await createTestConnection('now_log_test')

  const fileContentsNowTest = await readSqlFile('../test_data/sqlfiles/now_test.sql')
  const fileContentsNowLogTest = await readSqlFile('../test_data/sqlfiles/now_log_test.sql')

  if (!fileContentsNowTest || !fileContentsNowLogTest) {
    throw new Error('Sqlfiles not found')
  }

  await connNow.query(fileContentsNowTest)
  await connLog.query(fileContentsNowLogTest)

  await connNow.end()
  await connLog.end()

  return
}

const readSqlFile = async (filename: PathLike): Promise<string | undefined> => {
  const fileContents = await readFile(filename, 'utf8')
  return fileContents
}
