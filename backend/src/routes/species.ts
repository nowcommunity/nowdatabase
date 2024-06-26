import { Router } from 'express'
import { getAllSpecies, getSpeciesDetails } from '../services/species'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (req, res) => {
  const onlyPublic = !req.user
  const species = await getAllSpecies(onlyPublic)
  return res.status(200).send(fixBigInt(species))
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const species = await getSpeciesDetails(id)
  res.status(200).send(fixBigInt(species))
})

export default router
