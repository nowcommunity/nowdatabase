import { Router } from 'express'
import { getLocalityDetails } from '../services/locality'
import { getAllCrossSearch } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (req, res) => {
  const crossSearch = await getAllCrossSearch(req.user)
  return res.status(200).send(fixBigInt(crossSearch))
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const locality = await getLocalityDetails(id, req.user)
  if (!locality) return res.status(404).send()
  return res.status(200).send(fixBigInt(locality))
})

export default router
