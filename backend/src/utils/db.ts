import { Sequelize } from 'sequelize'
import { MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD } from './config'
import { initModels } from '../models/init-models'
import { testDb } from '../services/locality'
import { sleep } from './common'
import { logger } from './logger'

export const sequelize = new Sequelize(MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD, {
  dialect: 'mariadb',
  host: 'nowdb-db',
  port: 3306,
  logging: false,
})

export const models = initModels(sequelize)

export const testDbConnection = async () => {
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
