import { Router } from 'express'
import { getChangelog } from '../services/changelog'

const router = Router()

router.get('/', async (_req, res) => {
  const changelog = await getChangelog()
  return res.status(200).send(changelog)
})

export default router
