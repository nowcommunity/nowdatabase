import { Request, Router } from 'express'
import {
  editLocality,
  filterLocality,
  fixEditedLocality,
  getAllLocalities,
  getLocalityDetails,
  validateEntireLocality,
} from '../services/locality'
import { fixBigInt } from '../utils/common'
import { detailedDiff } from 'deep-object-diff'
import { LocalityDetailsType } from '../../../frontend/src/backendTypes'

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

router.put('/', async (req: Request<object, object, { locality: LocalityDetailsType }>, res) => {
  const editedLocality = req.body.locality
  const fixedEditedLocality = fixEditedLocality(editedLocality)
  const oldLocality = await getLocalityDetails(fixedEditedLocality.lid)
  const difference = detailedDiff(oldLocality!, fixedEditedLocality)
  const filteredLoc = filterLocality(difference.updated)
  const validationErrors = validateEntireLocality(filteredLoc)
  if (validationErrors.length > 0) {
    return res.status(400).send({ validationErrors })
  }
  const result = await editLocality(oldLocality!.lid, difference.updated)
  if (!result) return res.status(400).send()
  return res.status(200).send(result)
})

export default router
