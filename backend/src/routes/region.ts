import { Router, Request } from 'express'
import { getAllRegions, getRegionDetails, validateEntireRegion } from '../services/region'
import { requireOneOf } from '../middlewares/authorizer'
import { Role, EditDataType, EditMetaData, RegionDetails } from '../../../frontend/src/shared/types'
import { writeRegion } from '../services/write/region'

const router = Router()

router.get('/all', async (_req, res) => {
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
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { region: EditDataType<RegionDetails> & EditMetaData }>, res) => {
    const { comment, references, ...editedRegion } = req.body.region
    const validationErrors = await validateEntireRegion({ ...editedRegion, references: references })
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const result = await writeRegion(editedRegion)
    return res.status(200).send({ id: result })
  }
)

export default router
