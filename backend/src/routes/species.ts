import { Request, Response, Router } from 'express'
import { getAllSpecies, getAllSynonyms, getSpeciesDetails, validateEntireSpecies } from '../services/species'
import { fixBigInt } from '../utils/common'
import { EditMetaData, SpeciesDetailsType, Role } from '../../../frontend/src/shared/types'
import { deleteSpecies, writeSpecies } from '../services/write/species'
import { requireOneOf } from '../middlewares/authorizer'
import { buildDwcArchiveZipBuffer } from '../services/dwcArchiveExport'
import { currentDateAsString } from '../../../frontend/src/shared/currentDateAsString'
import { parseNumericIds } from './utils/exportFilters'

const router = Router()

router.get('/all', async (_req, res) => {
  const species = await getAllSpecies()
  return res.status(200).send(fixBigInt(species))
})

router.get('/synonyms', async (_req, res) => {
  const synonyms = await getAllSynonyms()
  return res.status(200).send(fixBigInt(synonyms))
})

const sendDwcArchive = async (ids: number[] | undefined, res: Response) => {
  const zipBuffer = await buildDwcArchiveZipBuffer(ids)
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="now_dwc_export_${currentDateAsString()}.zip"`)
  return res.status(200).send(zipBuffer)
}

router.get('/export/dwc-archive', requireOneOf([Role.Admin]), async (_req, res) => {
  return sendDwcArchive(undefined, res)
})

router.post('/export/dwc-archive', requireOneOf([Role.Admin]), async (req, res) => {
  try {
    return await sendDwcArchive(parseNumericIds((req.body as { ids?: unknown }).ids), res)
  } catch (error) {
    return res.status(400).send({ error: error instanceof Error ? error.message : 'Invalid export filters.' })
  }
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const species = await getSpeciesDetails(id, req.user)
  if (!species) return res.status(404).send()
  return res.status(200).send(species)
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditUnrestricted, Role.EditRestricted]),
  async (req: Request<object, object, { species: SpeciesDetailsType & EditMetaData }>, res) => {
    const { comment, references, ...editedSpecies } = req.body.species
    const validationErrors = await validateEntireSpecies({ ...editedSpecies, references })
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
