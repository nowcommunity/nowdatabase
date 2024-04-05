import { Sequelize } from 'sequelize'
import { MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD } from './config'
import { initModels } from '../models/init-models'

export const sequelize = new Sequelize(MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD, {
  dialect: 'mariadb',
  host: 'nowdb-db',
  port: 3306,
  logging: false,
})

export const models = initModels(sequelize)
