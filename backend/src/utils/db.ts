import { Sequelize } from 'sequelize'
import { MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD } from './config'

const sequelize = new Sequelize(MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD, {
  dialect: 'mariadb',
  host: 'nowdb-db',
  port: 3306,
})

export default sequelize
