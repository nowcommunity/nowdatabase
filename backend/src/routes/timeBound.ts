import { Request, Router } from 'express'
import { getAllTimeBounds, getTimeBoundDetails, getTimeBoundTimeUnits } from '../services/timeBound'
import { fixBigInt } from '../utils/common'
import { EditDataType, EditMetaData, TimeBoundDetailsType } from '../../../frontend/src/backendTypes'
import { deleteTimeUnit, writeTimeBound } from '../services/write/timeBound'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'

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
    const result = await writeTimeBound(editedTimeBound, comment, references, req.user!.initials)
    return res.status(200).send({ id: result })
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteTimeUnit(id, req.user!)
  res.status(200).send()
})

export default router
