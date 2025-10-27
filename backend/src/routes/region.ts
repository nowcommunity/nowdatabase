import { Router, Request } from 'express'
import { getAllRegions, getRegionDetails, validateEntireRegion } from '../services/region'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../shared/types'
import { EditDataType, EditMetaData, RegionDetails } from '../../../frontend/src/shared/types'
import { writeRegion, deleteRegion } from '../services/write/region'

const router = Router()

router.get('/all', requireOneOf([Role.Admin]), async (_req, res) => {
  const regions = await getAllRegions()
  return res.status(200).send(regions)
})

router.get('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  const region = await getRegionDetails(id)
  if (!region) return res.status(404).send()
  return res.status(200).send(region)
})

router.put(
  '/',
  requireOneOf([Role.Admin]),
  async (req: Request<object, object, { region: EditDataType<RegionDetails> & EditMetaData }>, res) => {
    const { ...editedRegion } = req.body.region
    const validationErrors = validateEntireRegion({ ...editedRegion })
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const reg_coord_id = await writeRegion(editedRegion)
    return res.status(200).send({ reg_coord_id })
  }
)

router.delete('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteRegion(id)
  res.status(200).send()
})

export default router
