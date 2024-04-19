export const MARIADB_HOST = 'nowdb-db'
export const MARIADB_DATABASE = process.env.MARIADB_DATABASE as string
export const MARIADB_LOG_DATABASE = process.env.MARIADB_LOG_DATABASE as string
export const MARIADB_USER = process.env.MARIADB_USER as string
export const MARIADB_PASSWORD = process.env.MARIADB_PASSWORD as string
export const SECRET = process.env.SECRET as string
export const PORT = process.env.NOWDB_BACKEND_PORT as unknown as number
export const LOGIN_VALID_MS = parseInt(process.env.LOGIN_VALID_MINUTES as string) * 60 * 1000
