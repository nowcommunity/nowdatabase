import { Router } from 'express'
import { createTestUsers } from '../services/user'
const router = Router()

router.get('/create-test-users', async (_req, res) => {
  await createTestUsers()
  res.status(200).send()
})

router.get("/ping", async (_req, res) => {
    return res.status(200).send()
})

export default router
