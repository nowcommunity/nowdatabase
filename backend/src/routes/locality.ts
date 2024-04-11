import { Router } from 'express'
import { getAllLocalities } from '../services/now_loc'

const router = Router()

router.get('/all', async (_req, res) => {
  const localities = await getAllLocalities()
  return res.status(200).send(localities)
})

export default router
