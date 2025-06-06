import { Router } from 'express'
import { createTestUsers } from '../services/user'
import { resetTestDb } from '../utils/db'
const router = Router()

router.get('/create-test-users', async (_req, res) => {
  await createTestUsers()
  res.status(200).send()
})

router.get('/ping', (_req, res) => {
  return res.status(200).send()
})

router.get('/reset-test-database', async (_req, res) => {
  await resetTestDb()
  res.status(200).send()
})

export default router
