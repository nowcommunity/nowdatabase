import { Request, Router } from 'express'
import { getAllSpecies, getSpeciesDetails } from '../services/species'
import { fixBigInt } from '../utils/common'
import { EditMetaData, SpeciesDetailsType } from '../../../frontend/src/backendTypes'
import { writeSpecies } from '../services/write/species'

const router = Router()

router.get('/all', async (_req, res) => {
  const species = await getAllSpecies()
  return res.status(200).send(fixBigInt(species))
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const species = await getSpeciesDetails(id)
  if (!species) return res.status(404).send()
  return res.status(200).send(fixBigInt(species))
})

router.put('/', async (req: Request<object, object, { species: SpeciesDetailsType & EditMetaData }>, res) => {
  const editedSpecies = req.body.species
  const id = await writeSpecies(editedSpecies)
  return res.status(200).send({ id })
})

export default router
