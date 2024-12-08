import { Request, Router } from 'express'
import { getAllSpecies, getSpeciesDetails, validateEntireSpecies } from '../services/species'
import { fixBigInt } from '../utils/common'
import { EditMetaData, SpeciesDetailsType } from '../../../frontend/src/shared/types/dbTypes'
import { deleteSpecies, writeSpecies } from '../services/write/species'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/shared/types'

const router = Router()

router.get('/all', async (_req, res) => {
  const species = await getAllSpecies()
  return res.status(200).send(fixBigInt(species))
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const species = await getSpeciesDetails(id)
  if (!species) return res.status(404).send()
  return res.status(200).send(species)
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { species: SpeciesDetailsType & EditMetaData }>, res) => {
    const { comment, references, ...editedSpecies } = req.body.species
    const validationErrors = validateEntireSpecies(editedSpecies)
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const species_id = await writeSpecies(editedSpecies, comment, references, req.user!.initials)
    return res.status(200).send({ species_id })
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteSpecies(id, req.user!)
  res.status(200).send()
})

export default router
