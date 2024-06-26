import { Request, Router } from 'express'
import { getAllSpecies, getSpeciesDetails } from '../services/species'
import { fixBigInt } from '../utils/common'
import { EditDataType, SpeciesDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'
import { printJSON } from '../services/write/writeUtils'

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

router.put('/', async (req: Request<object, object, { species: EditDataType<SpeciesDetailsType> }>, res) => {
  const editedObject = req.body.species
  const oldObject = await getSpeciesDetails(editedObject.species_id!)
  console.log(printJSON(editedObject))
  const result = await write(editedObject, 'com_species')
  return res.status(200).send(result ? { result: result } : { error: 'error' })
})

export default router
