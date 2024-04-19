import { Router } from 'express'
import { getAllLocalities, getLocalityDetails } from '../services/locality'

const router = Router()

router.get('/all', async (req, res) => {
  const onlyPublic = !req.user
  const localities = await getAllLocalities(onlyPublic)
  return res.status(200).send(localities)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const locality = await getLocalityDetails(id)
  res.status(200).send(locality)
})

export default router
