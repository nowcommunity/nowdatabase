import { Request, Router } from 'express'
import { getAllLocalities, getLocalityDetails, validateEntireLocality } from '../services/locality'
import { getAllCrossSearch } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { EditDataType, EditMetaData, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'
import { deleteLocality, writeLocality } from '../services/write/locality'

const router = Router()

router.get('/all', async (req, res) => {
  const localities = await getAllLocalities(req.user)
  const crossSearch = await getAllCrossSearch(req.user)
  console.log(crossSearch[2])
  console.log(crossSearch[2]?.now_ls[0].com_species)
  return res.status(200).send(fixBigInt(crossSearch))
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
    const validationErrors = validateEntireLocality(editedLocality)
    if (validationErrors.length > 0) {
      return res.status(400).send({ validationErrors })
    }
    const result = await writeLocality(editedLocality, comment, references, req.user!.initials)
    return res.status(200).send({ id: result })
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteLocality(id, req.user!)
  res.status(200).send()
})

export default router
