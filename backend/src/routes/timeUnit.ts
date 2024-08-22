import { Request, Router } from 'express'
import { getAllTimeUnits, getTimeUnitDetails, getTimeUnitLocalities } from '../services/timeUnit'
import { fixBigInt } from '../utils/common'
import { EditDataType, EditMetaData, TimeUnitDetailsType } from '../../../frontend/src/backendTypes'
import { write } from '../services/write/write'

const router = Router()

router.get('/all', async (_req, res) => {
  const time_units = await getAllTimeUnits()
  return res.status(200).send(time_units)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const timeUnit = await getTimeUnitDetails(id)
  if (!timeUnit) return res.status(404).send()
  return res.status(200).send(timeUnit)
})

router.get('/localities/:id', async (req, res) => {
  const id = req.params.id
  const localities = await getTimeUnitLocalities(id)
  return res.status(200).send(fixBigInt(localities))
})

router.put(
  '/',
  async (req: Request<object, object, { timeUnit: EditDataType<TimeUnitDetailsType> & EditMetaData }>, res) => {
    const editedObject = req.body.timeUnit
    const result = await write(
      editedObject,
      'now_time_unit',
      req.user!.initials,
      editedObject.comment ?? '',
      editedObject.tu_name ? 'update' : 'add',
      editedObject.references ?? []
    )
    return res.status(200).send(result ? { result: result } : { error: 'error' })
  }
)

export default router
