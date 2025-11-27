import { Request, Router } from 'express'
import {
  EditDataType,
  EditMetaData,
  TimeUnitDetailsType,
  Role,
  TimeBoundDetailsType,
} from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'
import { getSequences } from '../controllers/sequenceController'
import {
  getAllTimeUnits,
  getTimeUnitDetails,
  getTimeUnitLocalities,
  validateEntireTimeUnit,
} from '../services/timeUnit'
import { getTimeBoundDetails, validateEntireTimeBound } from '../services/timeBound'
import { ConflictError, DuplicateTimeUnitError, deleteTimeUnit, writeTimeUnit } from '../services/write/timeUnit'
import { fixBigInt } from '../utils/common'
import { writeTimeBound } from '../services/write/timeBound'

const router = Router()

router.get('/all', async (_req, res) => {
  try {
    const time_units = await getAllTimeUnits()
    return res.status(200).send(time_units)
  } catch (_error) {
    return res.status(500).send({ message: 'Failed to fetch time units' })
  }
})

router.get('/sequences', getSequences)

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const timeUnit = await getTimeUnitDetails(id)
    if (!timeUnit) return res.status(404).send({ message: 'Time unit not found' })
    return res.status(200).send(timeUnit)
  } catch (_error) {
    return res.status(500).send({ message: 'Failed to fetch time unit' })
  }
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
    try {
      const { comment, references, ...editedTimeUnit } = req.body.timeUnit
      const normalizedTimeUnit = { ...editedTimeUnit, rank: editedTimeUnit.rank === '' ? null : editedTimeUnit.rank }

      let validationUpBound = undefined
      let validationLowBound = undefined
      let newUpBoundId = undefined
      let newLowBoundId = undefined

      // new up bound has been created in time unit edit view
      if (!normalizedTimeUnit.up_bnd && normalizedTimeUnit.up_bound) {
        const newUpBound = {
          ...normalizedTimeUnit.up_bound,
          now_bau: [],
          references: references,
        } as EditDataType<TimeBoundDetailsType> & EditMetaData

        const newUpBoundValidationErrors = await validateEntireTimeBound(newUpBound)
        if (newUpBoundValidationErrors.length > 0) {
          return res.status(403).send(newUpBoundValidationErrors)
        }

        const { result } = await writeTimeBound(newUpBound, undefined, references, req.user!.initials)
        newUpBoundId = result
        validationUpBound = (await getTimeBoundDetails(newUpBoundId)) ?? undefined
      } else if (normalizedTimeUnit.up_bnd !== undefined && normalizedTimeUnit.up_bnd !== null) {
        validationUpBound = (await getTimeBoundDetails(normalizedTimeUnit.up_bnd)) ?? undefined
      }

      // new low bound has been created in time unit edit view
      if (!normalizedTimeUnit.low_bnd && normalizedTimeUnit.low_bound) {
        const newLowBound = { ...normalizedTimeUnit.low_bound, now_bau: [], references: references }

        const newLowBoundValidationErrors = await validateEntireTimeBound(newLowBound)
        if (newLowBoundValidationErrors.length > 0) {
          return res.status(403).send(newLowBoundValidationErrors)
        }

        const { result } = await writeTimeBound(newLowBound, undefined, references, req.user!.initials)
        newLowBoundId = result
        validationLowBound = (await getTimeBoundDetails(newLowBoundId)) ?? undefined
      } else if (normalizedTimeUnit.low_bnd !== undefined && normalizedTimeUnit.low_bnd !== null) {
        validationLowBound = (await getTimeBoundDetails(normalizedTimeUnit.low_bnd)) ?? undefined
      }

      const validationErrors = await validateEntireTimeUnit({
        ...normalizedTimeUnit,
        up_bnd: newUpBoundId ?? normalizedTimeUnit.up_bnd,
        up_bound: validationUpBound,
        low_bnd: newLowBoundId ?? normalizedTimeUnit.low_bnd,
        low_bound: validationLowBound,
        references: references,
      })
      if (validationErrors.length > 0) {
        return res.status(403).send(validationErrors)
      }
      const { tu_name, errorObject } = await writeTimeUnit(
        {
          ...normalizedTimeUnit,
          up_bnd: newUpBoundId ?? normalizedTimeUnit.up_bnd,
          low_bnd: newLowBoundId ?? normalizedTimeUnit.low_bnd,
        },
        comment,
        references,
        req.user!.initials
      )
      if (errorObject) {
        return res.status(403).send(errorObject)
      }
      return res.status(200).send({ tu_name })
    } catch (error) {
      if (error instanceof DuplicateTimeUnitError) {
        return res.status(error.status).send({ message: error.message, code: error.code })
      }

      return res.status(500).send({ message: 'Failed to write time unit' })
    }
  }
)

router.delete('/:id', requireOneOf([Role.Admin, Role.EditUnrestricted]), async (req, res) => {
  const id = req.params.id

  try {
    await deleteTimeUnit(id, req.user!)
    return res.status(200).send()
  } catch (error) {
    if (error instanceof ConflictError) {
      return res.status(error.status).send({ message: error.message })
    }

    if (error instanceof Error && error.message === 'Time unit not found') {
      return res.status(404).send({ message: error.message })
    }

    return res.status(500).send({ message: 'Failed to delete time unit' })
  }
})

export default router
