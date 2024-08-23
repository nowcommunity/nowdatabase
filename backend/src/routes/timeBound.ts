import { Request, Router } from 'express'
import { getAllTimeBounds, getTimeBoundDetails, getTimeBoundTimeUnits } from '../services/timeBound'
import { fixBigInt } from '../utils/common'
import { EditDataType, EditMetaData, TimeBoundDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'

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
  async (req: Request<object, object, { timeBound: EditDataType<TimeBoundDetailsType> & EditMetaData }>, res) => {
    const editedObject = req.body.timeBound
    const result = await write(
      editedObject,
      'now_tu_bound',
      req.user!.initials,
      editedObject.comment ?? '',
      editedObject.bid ? 'update' : 'add',
      editedObject.references ?? []
    )
    return res.status(200).send(result ? { result: result } : { error: 'error' })
  }
)

export default router
