import { afterAll } from '@jest/globals'
import { pool, nowDb, logDb } from '../utils/db'

afterAll(async () => {
  await pool.end()
  await nowDb.$disconnect()
  await logDb.$disconnect()
})
