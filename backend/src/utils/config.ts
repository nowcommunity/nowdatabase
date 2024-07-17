export const MARIADB_HOST = process.env.MARIADB_HOST as string
export const MARIADB_PASSWORD = process.env.MARIADB_PASSWORD as string
export const SECRET = process.env.SECRET as string
export const PORT = process.env.NOWDB_BACKEND_PORT as unknown as number

export const LOGIN_VALID_SECONDS = parseInt(process.env.LOGIN_VALID_MINUTES as string) * 60
export const GRACE_PERIOD_SECONDS = parseInt(process.env.GRACE_PERIOD_MINUTES || '60') * 60

export const MARIADB_PORT = parseInt(process.env.MARIADB_PORT as string)
export const USER_CREATION_SECRET = process.env.USER_CREATION_SECRET as string

/* Running environment: 
    dev     = development or testing, locally or in GitHub actions
    staging = semi-public test version, non-anonymized test-data
    prod    = production with real data
*/
const allowedRunningEnvs = ['dev', 'staging', 'prod'] as const
export const RUNNING_ENV = process.env.VITE_RUNNING_ENV as (typeof allowedRunningEnvs)[number]
if (!allowedRunningEnvs.includes(RUNNING_ENV)) throw new Error('Invalid RUNNING_ENV')

// Enable write operations. If this is not set to 'true', all write (create, update, delete) operations except for allowed ones (like user/login) are disabled.
export const ENABLE_WRITE = process.env.VITE_ENABLE_WRITE === 'true'

export const DB_CONNECTION_LIMIT = (process.env.DB_CONNECTION_LIMIT as string) ?? '10'
export const NOW_DB_NAME = process.env.NOW_DB_NAME as string
export const LOG_DB_NAME = process.env.LOG_DB_NAME as string
export const COORDINATOR = process.env.COORDINATOR as string

const requiredEnvs = {
  MARIADB_HOST,
  MARIADB_PASSWORD,
  SECRET,
  PORT,
  LOGIN_VALID_SECONDS,
  GRACE_PERIOD_SECONDS,
  MARIADB_PORT,
  USER_CREATION_SECRET,
  BACKEND_MODE: RUNNING_ENV,
  NOW_DB_NAME,
  LOG_DB_NAME,
  COORDINATOR,
  RUNNING_ENV,
}

const missingEnvs = Object.entries(requiredEnvs).filter(([, value]) => value === undefined)
if (missingEnvs.length > 0)
  throw new Error(`Missing environment variables: ${missingEnvs.map(env => env[0]).join(', ')}`)
