import { testDb } from '../services/locality'
import { sleep } from './common'
import { logger } from './logger'
import { PrismaClient as DbClient } from '../../prisma/generated/now_test_client'
import { PrismaClient as LogDbClient } from '../../prisma/generated/now_log_test_client'

export const logDbClient = new LogDbClient()
export const dbClient = new DbClient()

export const testDbConnection = async () => {
  logger.info(`Attempting to connect to database...`)
  const tryDbConnection = async () => {
    try {
      await testDb()
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
