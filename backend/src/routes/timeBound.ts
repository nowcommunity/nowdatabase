import { Request, Router } from 'express'
import { EditDataType, EditMetaData, TimeBoundDetailsType, Role } from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'
import {
  getAllTimeBounds,
  getTimeBoundDetails,
  getTimeBoundTimeUnits,
  validateEntireTimeBound,
} from '../services/timeBound'
import { deleteTimeBound, writeTimeBound } from '../services/write/timeBound'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (_req, res) => {
  const time_bounds = await getAllTimeBounds()
  return res.status(200).send(time_bounds)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const timeBound = await getTimeBoundDetails(id)
  if (!timeBound) return res.status(404).send()
  return res.status(200).send(timeBound)
})

router.get('/time-units/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const timeUnits = await getTimeBoundTimeUnits(id)
  return res.status(200).send(fixBigInt(timeUnits))
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { timeBound: EditDataType<TimeBoundDetailsType> & EditMetaData }>, res) => {
    const { comment, references, ...editedTimeBound } = req.body.timeBound
    const validationErrors = validateEntireTimeBound(editedTimeBound)
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const { result, errorObject } = await writeTimeBound(editedTimeBound, comment, references, req.user!.initials)
    if (errorObject) {
      return res.status(403).send(errorObject)
    }
    return res.status(200).send({ bid: result })
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteTimeBound(id, req.user!)
  res.status(200).send()
})

export default router
