import { sleep } from './common'
import { logger } from './logger'
import { PrismaClient as NowClient } from '../../prisma/generated/now_test_client'
import { PrismaClient as LogClient } from '../../prisma/generated/now_log_test_client'
import mariadb, { Pool } from 'mariadb'
import { MARIADB_HOST, MARIADB_PASSWORD, DB_CONNECTION_LIMIT, MARIADB_USER, RUNNING_ENV } from './config'

import { readFile } from 'fs/promises'
import { PathLike } from 'fs'

type LazyFactory<T extends object> = () => T

const createLazySingleton = <T extends object>(factory: LazyFactory<T>): T => {
  let instance: T | null = null

  const resolveInstance = (): T => {
    if (!instance) {
      instance = factory()
    }

    return instance
  }

  const handler: ProxyHandler<T> = {
    get(_target, property) {
      const target = resolveInstance()
      const value = (target as unknown as Record<PropertyKey, unknown>)[property as PropertyKey]

      if (typeof value === 'function') {
        return (value as (...args: unknown[]) => unknown).bind(target)
      }

      return value as T[Extract<keyof T, typeof property>]
    },
    set(_target, property, value) {
      const target = resolveInstance()
      ;(target as unknown as Record<PropertyKey, unknown>)[property as PropertyKey] = value
      return true
    },
    has(_target, property) {
      const target = resolveInstance()
      return property in target
    },
    ownKeys() {
      return Reflect.ownKeys(resolveInstance())
    },
    getOwnPropertyDescriptor(_target, property) {
      const descriptor = Object.getOwnPropertyDescriptor(resolveInstance(), property)

      if (descriptor) {
        descriptor.configurable = true
      }

      return descriptor
    },
  }

  return new Proxy({} as T, handler)
}

const createNowDb = () => new NowClient()
const createLogDb = () => new LogClient()
const createPool = () =>
  mariadb.createPool({
    host: MARIADB_HOST,
    password: MARIADB_PASSWORD,
    user: MARIADB_USER,
    connectionLimit: parseInt(DB_CONNECTION_LIMIT),
    checkDuplicate: false,
  })

export const nowDb: NowClient = createLazySingleton(createNowDb)
export const logDb: LogClient = createLazySingleton(createLogDb)
export const pool: Pool = createLazySingleton(createPool)

export const getNowDb = (): NowClient => nowDb
export const getLogDb = (): LogClient => logDb
export const getPool = (): Pool => pool

export const getCrossSearchFields = () => {
  const client = getNowDb()
  const nowLsKeys = Object.keys(
    (client['now_ls' as keyof object] as unknown as Record<string, { fields: object }>).fields as never
  )
  const nowLocKeys = Object.keys(
    (client['now_loc' as keyof object] as unknown as Record<string, { fields: object }>).fields as never
  )
  const comSpeciesKeys = Object.keys(
    (client['com_species' as keyof object] as unknown as Record<string, { fields: object }>).fields as never
  )
  return [
    ...nowLsKeys.map(key => `now_ls.${key}`),
    ...nowLocKeys.map(key => `now_loc.${key}`),
    ...comSpeciesKeys.map(key => `com_species.${key}`),
  ]
}

export const getFieldsOfTables = (tables: string[]) => {
  const client = getNowDb()
  const logClient = getLogDb()
  return [
    ...tables.flatMap(table =>
      Object.keys((client[table as keyof object] as unknown as Record<string, { fields: object }>).fields as never)
    ),
    ...Object.keys(logClient.log.fields),
    ...Object.keys(client.ref_ref.fields),
  ]
}

export const testMariaDb = async () => {
  logger.info('Testing direct mariadb-connection...')
  const conn = await getPool().getConnection()
  await conn.query('SELECT * FROM now_test.now_loc LIMIT 5')
  await conn.query('SELECT * FROM now_log_test.log LIMIT 5')
  logger.info('Connections to both databases via direct mariadb-connector work.')
  if (conn) return conn.end()
}

export const testDb = async () => {
  logger.info('Testing Prisma-connection...')
  await getNowDb().now_loc.findFirst({})
  await getLogDb().log.findFirst({})
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
  logger.info('Resetting test database...')

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
