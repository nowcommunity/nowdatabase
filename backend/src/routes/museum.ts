import { Router, Request } from 'express'
import { getAllMuseums, getMuseumDetails, validateEntireMuseum } from '../services/museum'
import { fixBigInt } from '../utils/common'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../shared/types'
import { EditDataType, EditMetaData, Museum } from '../../../frontend/src/shared/types'
import { writeMuseum } from '../services/write/museum'

const router = Router()

router.get('/all', async (_req, res) => {
  const museums = await getAllMuseums()
  return res.status(200).send(museums)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const museum = await getMuseumDetails(id)
  if (!museum) return res.status(404).send()
  return res.status(200).send(fixBigInt(museum))
})

router.put(
  '/',
  requireOneOf([Role.Admin]),
  async (req: Request<object, object, { museum: EditDataType<Museum> & EditMetaData }>, res) => {
    const { ...editedMuseum } = req.body.museum
    const validationErrors = validateEntireMuseum({ ...editedMuseum })
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const museum = await writeMuseum(editedMuseum)
    return res.status(200).send({ museum })
  }
)

export default router
