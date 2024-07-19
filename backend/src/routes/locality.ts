import { Request, Router } from 'express'
import {
  getAllLocalities,
  getLocalityDetails,
  getLocalitySpeciesList,
  validateEntireLocality,
} from '../services/locality'
import { fixBigInt } from '../utils/common'
import { EditDataType, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'

const router = Router()

router.get('/all', async (req, res) => {
  const localities = await getAllLocalities(req.user)
  return res.status(200).send(fixBigInt(localities))
})

router.post('/localitySpecies', async (req: Request<object, object, { lids: number[] }>, res) => {
  const user = req.user
  const lids = req.body.lids
  if (!lids) return res.status(400).send({ message: 'Missing lids' })
  const localitySpeciesList = await getLocalitySpeciesList(lids, user)
  return res.status(200).json(localitySpeciesList)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const locality = await getLocalityDetails(id, req.user)
  if (!locality) return res.status(404).send()
  return res.status(200).send(fixBigInt(locality))
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditRestricted, Role.EditUnrestricted]),
  async (req: Request<object, object, { locality: EditDataType<LocalityDetailsType> }>, res) => {
    const editedLocality = req.body.locality
    const validationErrors = validateEntireLocality(editedLocality)
    if (validationErrors.length > 0) {
      return res.status(400).send({ validationErrors })
    }
    const result = await write(editedLocality, 'now_loc', { authorizer: 'TEST-SU', userName: 'testuser' })
    return res.status(200).send(result ? { id: result } : { error: 'error' })
  }
)

export default router
