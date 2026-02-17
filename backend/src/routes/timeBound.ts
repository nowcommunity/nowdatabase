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
import { parseTabListQuery } from '../services/tabularQuery'

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
  const parsedQuery = parseTabListQuery({
    query: req.query,
    allowedSortingColumns: ['tu_name', 'tu_display_name', 'rank', 'sequence', 'tu_comment', 'up_bnd', 'low_bnd'],
    defaultSorting: [
      { id: 'rank', desc: false },
      { id: 'sequence', desc: false },
      { id: 'tu_name', desc: false },
    ],
  })

  if (!parsedQuery.ok) {
    return res.status(400).send({ message: 'Invalid query parameters', errors: parsedQuery.errors })
  }

  const timeUnits = await getTimeBoundTimeUnits(id, parsedQuery.options)
  return res.status(200).send(fixBigInt(timeUnits))
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { timeBound: EditDataType<TimeBoundDetailsType> & EditMetaData }>, res) => {
    const { comment, references, ...editedTimeBound } = req.body.timeBound
    const validationErrors = await validateEntireTimeBound({ ...editedTimeBound, references: references })
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
