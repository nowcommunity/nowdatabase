import { Request, Router } from 'express'
import { EditDataType, EditMetaData, TimeUnitDetailsType, Role } from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'
import { getAllSequences } from '../services/sequence'
import {
  getAllTimeUnits,
  getTimeUnitDetails,
  getTimeUnitLocalities,
  validateEntireTimeUnit,
} from '../services/timeUnit'
import { getTimeBoundDetails } from '../services/timeBound'
import { deleteTimeUnit, writeTimeUnit } from '../services/write/timeUnit'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (_req, res) => {
  const time_units = await getAllTimeUnits()
  return res.status(200).send(time_units)
})

router.get('/sequences', async (_req, res) => {
  const sequences = await getAllSequences()
  return res.status(200).send(sequences)
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
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { timeUnit: EditDataType<TimeUnitDetailsType> & EditMetaData }>, res) => {
    const { comment, references, ...editedTimeUnit } = req.body.timeUnit

    let validationUpBound = undefined
    let validationLowBound = undefined
    if (editedTimeUnit.up_bnd) {
      validationUpBound = (await getTimeBoundDetails(editedTimeUnit.up_bnd)) ?? undefined
    }
    if (editedTimeUnit.low_bnd) {
      validationLowBound = (await getTimeBoundDetails(editedTimeUnit.low_bnd)) ?? undefined
    }
    const validationErrors = await validateEntireTimeUnit({
      ...editedTimeUnit,
      up_bound: validationUpBound,
      low_bound: validationLowBound,
      references: references,
    })
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const { tu_name, errorObject } = await writeTimeUnit(editedTimeUnit, comment, references, req.user!.initials)
    if (errorObject) {
      return res.status(403).send(errorObject)
    }
    return res.status(200).send({ tu_name })
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = req.params.id
  await deleteTimeUnit(id, req.user!)
  res.status(200).send()
})

export default router
