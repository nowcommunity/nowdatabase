import { sleep } from './common'
import { logger } from './logger'
import { PrismaClient as NowClient } from '../../prisma/generated/now_test_client'
import { PrismaClient as LogClient } from '../../prisma/generated/now_log_test_client/default'
import mariadb from 'mariadb'
import { MARIADB_HOST, MARIADB_PASSWORD, DB_CONNECTION_LIMIT, MARIADB_USER, RUNNING_ENV, LOG_DB_NAME } from './config'

import { readFile } from 'fs/promises'
import { PathLike } from 'fs'

type LogRecord = Record<string, unknown> & {
  luid?: number | null
  suid?: number | null
  buid?: number | null
  tuid?: number | null
}

type LogModel = {
  findMany: (args?: { where?: Record<string, unknown> }) => Promise<LogRecord[]>
  findFirst: (args?: { where?: Record<string, unknown> }) => Promise<LogRecord | null>
  fields: Record<string, unknown>
}

type LogPrismaClient = LogClient & { log: LogModel }

export const logDb = new LogClient() as unknown as LogPrismaClient
export const nowDb = new NowClient()

const fallbackLogFields = {
  log_id: true,
  event_time: true,
  user_name: true,
  server_name: true,
  table_name: true,
  pk_data: true,
  column_name: true,
  log_action: true,
  old_data: true,
  new_data: true,
  luid: true,
  suid: true,
  tuid: true,
  buid: true,
} as const

const buildLogWhere = (where?: Record<string, unknown>) => {
  if (!where) return { sql: '', params: [] as unknown[] }

  const clauses: string[] = []
  const params: unknown[] = []

  const pushInClause = (field: string, values: unknown[] | undefined) => {
    if (!values || values.length === 0) {
      clauses.push('1=0')
      return
    }
    const placeholders = values.map(() => '?').join(', ')
    clauses.push(`${field} IN (${placeholders})`)
    params.push(...values)
  }

  if (typeof where.table_name === 'string') {
    clauses.push('table_name = ?')
    params.push(where.table_name)
  }

  const pkData = where.pk_data as { contains?: string } | undefined
  if (pkData?.contains) {
    clauses.push('pk_data LIKE ?')
    params.push(`%${pkData.contains}%`)
  }

  if (Object.prototype.hasOwnProperty.call(where, 'luid')) {
    const luid = where.luid as { in?: number[] } | undefined
    pushInClause('luid', luid?.in)
  }

  if (Object.prototype.hasOwnProperty.call(where, 'suid')) {
    const suid = where.suid as { in?: number[] } | undefined
    pushInClause('suid', suid?.in)
  }

  if (Object.prototype.hasOwnProperty.call(where, 'tuid')) {
    const tuid = where.tuid as { in?: number[] } | undefined
    pushInClause('tuid', tuid?.in)
  }

  if (Object.prototype.hasOwnProperty.call(where, 'buid')) {
    const buid = where.buid as { in?: number[] } | undefined
    pushInClause('buid', buid?.in)
  }

  if (clauses.length === 0) return { sql: '', params }
  return { sql: ` WHERE ${clauses.join(' AND ')}`, params }
}

const runLogQuery = async (sql: string, params: unknown[]): Promise<LogRecord[]> => {
  const result = await (pool as { query: (sql: string, params?: unknown[]) => Promise<unknown> }).query(sql, params)
  if (!Array.isArray(result)) return []
  return result.filter((row): row is LogRecord => typeof row === 'object' && row !== null)
}

const getExistingLogModel = () => {
  const candidate = (logDb as { log?: LogModel }).log
  if (!candidate) return null
  if (typeof candidate.findMany !== 'function') return null
  if (!candidate.fields) return null
  return candidate
}

const createFallbackLogModel = (): LogModel => {
  const findMany = async ({ where }: { where?: Record<string, unknown> } = {}) => {
    const { sql, params } = buildLogWhere(where)
    return runLogQuery(`SELECT * FROM ${LOG_DB_NAME}.log${sql}`, params)
  }

  const findFirst = async ({ where }: { where?: Record<string, unknown> } = {}) => {
    const rows = await findMany({ where })
    return rows[0] ?? null
  }

  return {
    fields: fallbackLogFields,
    findMany,
    findFirst,
  }
}

const ensureLogClient = () => {
  if (getExistingLogModel()) return
  ;(logDb as { log: LogModel }).log = createFallbackLogModel()
}

ensureLogClient()

export const getCrossSearchFields = () => {
  const nowLsKeys = Object.keys(
    (nowDb['now_ls' as keyof object] as unknown as Record<string, { fields: object }>).fields as never
  )
  const nowLocKeys = Object.keys(
    (nowDb['now_loc' as keyof object] as unknown as Record<string, { fields: object }>).fields as never
  )
  const comSpeciesKeys = Object.keys(
    (nowDb['com_species' as keyof object] as unknown as Record<string, { fields: object }>).fields as never
  )
  return [
    ...nowLsKeys.map(key => `now_ls.${key}`),
    ...nowLocKeys.map(key => `now_loc.${key}`),
    ...comSpeciesKeys.map(key => `com_species.${key}`),
  ]
}

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
