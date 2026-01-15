import { afterAll } from '@jest/globals'
import { pool, nowDb, logDb } from '../utils/db'
import { testPrisma } from './helpers/prisma'

afterAll(async () => {
  await testPrisma.$disconnect()
  await pool.end()
  await nowDb.$disconnect()
  await logDb.$disconnect()
})
