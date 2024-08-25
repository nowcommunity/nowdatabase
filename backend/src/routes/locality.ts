import { Request, Router } from 'express'
import { getAllLocalities, getLocalityDetails, validateEntireLocality } from '../services/locality'
import { fixBigInt } from '../utils/common'
import { EditDataType, EditMetaData, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'
// import { deleteLocality } from '../services/write/delete'
import { writeLocality } from '../services/write/locality'

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
  requireOneOf([Role.Admin, Role.EditRestricted, Role.EditUnrestricted]),
  // TODO: Check if edit restricted has rights to edit the locality.
  async (req: Request<object, object, { locality: EditDataType<LocalityDetailsType> & EditMetaData }>, res) => {
    const editedLocality = req.body.locality
    const { comment, references } = editedLocality
    delete editedLocality.comment
    delete editedLocality.references
    const validationErrors = validateEntireLocality(editedLocality)

    if (validationErrors.length > 0) {
      return res.status(400).send({ validationErrors })
    }
    const result = await writeLocality(editedLocality, comment, references, req.user!.initials)
    return res.status(200).send({ id: result })
  }
)

router.delete('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  //   await deleteLocality(id)
  return res.status(200).send()
})

export default router
