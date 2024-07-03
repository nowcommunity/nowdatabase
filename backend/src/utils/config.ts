export const MARIADB_HOST = process.env.MARIADB_HOST as string
export const MARIADB_PASSWORD = process.env.MARIADB_PASSWORD as string
export const SECRET = process.env.SECRET as string
export const PORT = process.env.NOWDB_BACKEND_PORT as unknown as number
export const LOGIN_VALID_MS = parseInt(process.env.LOGIN_VALID_MINUTES as string) * 60 * 1000
export const MARIADB_PORT = parseInt(process.env.MARIADB_PORT as string)
export const USER_CREATION_SECRET = process.env.USER_CREATION_SECRET as string
export const BACKEND_MODE = process.env.BACKEND_MODE as 'dev' | 'prod' | 'test'
export const DB_CONNECTION_LIMIT = (process.env.DB_CONNECTION_LIMIT as string) ?? '10'
export const NOW_DB_NAME = process.env.NOW_DB_NAME as string
export const LOG_DB_NAME = process.env.LOG_DB_NAME as string
export const IS_LOCAL = (process.env.IS_LOCAL as string) === 'true'
export const COORDINATOR = process.env.COORDINATOR as string

const requiredEnvs = {
  MARIADB_HOST,
  MARIADB_PASSWORD,
  SECRET,
  PORT,
  LOGIN_VALID_MS,
  MARIADB_PORT,
  USER_CREATION_SECRET,
  BACKEND_MODE,
  NOW_DB_NAME,
  LOG_DB_NAME,
  IS_LOCAL,
  COORDINATOR,
}

const missingEnvs = Object.entries(requiredEnvs).filter(([, value]) => value === undefined)
if (missingEnvs.length > 0)
  throw new Error(`Missing environment variables: ${missingEnvs.map(env => env[0]).join(', ')}`)
