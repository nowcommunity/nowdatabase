import { Sequelize } from 'sequelize'
import { MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD, MARIADB_HOST, MARIADB_PORT } from './config'
import { initModels } from '../models/init-models'
import { testDb } from '../services/locality'
import { sleep } from './common'
import { logger } from './logger'

export const sequelize = new Sequelize(MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD, {
  dialect: 'mariadb',
  host: MARIADB_HOST,
  port: MARIADB_PORT,
  logging: false,
})

export const models = initModels(sequelize)

export const testDbConnection = async () => {
  logger.info(`Attempting to connect to database at ${MARIADB_HOST}:${MARIADB_PORT}`)
  const tryDbConnection = async () => {
    try {
      await sequelize.authenticate()
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
