import mariadb from 'mariadb'

const {
  MARIADB_HOST,
  MARIADB_PASSWORD,
  MARIADB_USER,
  DB_CONNECTION_LIMIT,
} = process.env

if (!MARIADB_HOST || !MARIADB_PASSWORD || !MARIADB_USER) {
  throw new Error('Missing required database environment variables')
}

export const pool = mariadb.createPool({
  host: MARIADB_HOST,
  password: MARIADB_PASSWORD,
  user: MARIADB_USER,
  connectionLimit: parseInt(DB_CONNECTION_LIMIT) || 50,
  checkDuplicate: false,
  acquireTimeout: 30000,
  idleTimeout: 30000,
  minimumIdle: 0,
})
