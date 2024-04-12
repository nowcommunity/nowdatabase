import { Router } from 'express'
import { getAllLocalities, getLocalityDetails } from '../services/locality'

const router = Router()

router.get('/all', async (_req, res) => {
  const localities = await getAllLocalities()
  return res.status(200).send(localities)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const locality = await getLocalityDetails(id)
  res.status(200).send(locality)
})

export default router
