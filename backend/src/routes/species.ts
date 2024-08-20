import { Request, Router } from 'express'
import { getAllSpecies, getSpeciesDetails } from '../services/species'
import { fixBigInt } from '../utils/common'
import { SpeciesDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'

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

router.put('/', async (req: Request<object, object, { species: SpeciesDetailsType; comment: string }>, res) => {
  const editedSpecies = req.body.species
  const result = await write(
    editedSpecies,
    'com_species',
    req.user!.initials,
    req.body.comment,
    editedSpecies.species_id ? 'update' : 'add'
  )
  return res.status(200).send(result ? { result: result } : { error: 'error' })
})

export default router
