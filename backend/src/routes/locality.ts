import { Request, Router } from 'express'
import { getAllLocalities, getLocalityDetails, validateEntireLocality } from '../services/locality'
import { fixBigInt } from '../utils/common'
import { EditDataType, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'

const router = Router()

router.get('/all', async (req, res) => {
  const onlyPublic = !req.user
  const localities = await getAllLocalities(onlyPublic)
  return res.status(200).send(fixBigInt(localities))
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const locality = await getLocalityDetails(id)
  res.status(200).send(fixBigInt(locality))
})

router.put('/', async (req: Request<object, object, { locality: EditDataType<LocalityDetailsType> }>, res) => {
  const editedLocality = req.body.locality
  const validationErrors = validateEntireLocality(editedLocality)
  if (validationErrors) {
    return res.status(400).send({ validationErrors })
  }
  const result = await write(editedLocality, 'now_loc', { authorizer: 'NA', userName: 'testuser' })
  return res.status(200).send(result ? { result: result } : { error: 'error' })
})

export default router
