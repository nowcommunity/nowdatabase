import { Request, Router } from 'express'
import {
  getAllLocalities,
  getLocalityDetails,
  normalizeLocalityAges,
  validateEntireLocality,
} from '../services/locality'
import { fixBigInt } from '../utils/common'
import { EditDataType, EditMetaData, LocalityDetailsType, Role } from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'
import { deleteLocality, writeLocality } from '../services/write/locality'

const router = Router()

router.get('/all', async (req, res) => {
  const localities = await getAllLocalities(req.user)
  return res.status(200).send(fixBigInt(localities))
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const locality = await getLocalityDetails(id, req.user)
  if (!locality) return res.status(404).send()
  return res.status(200).send(fixBigInt(locality))
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { locality: EditDataType<LocalityDetailsType> & EditMetaData }>, res) => {
    const { comment, references, ...editedLocality } = req.body.locality
    const normalizedLocality = normalizeLocalityAges(editedLocality)
    const validationErrors = await validateEntireLocality({ ...normalizedLocality, references: references })
    if (validationErrors.length > 0) {
      const hasCollectingMethodError = validationErrors.some(
        validationError => validationError.name === 'now_coll_meth' && validationError.error
      )
      if (hasCollectingMethodError) {
        return res.status(400).send(validationErrors)
      }
      return res.status(403).send(validationErrors)
    }
    const result = await writeLocality(normalizedLocality, comment, references, req.user)
    return res.status(200).send({ id: result })
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteLocality(id, req.user!)
  res.status(200).send()
})

export default router
