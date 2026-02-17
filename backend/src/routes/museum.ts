import { Router, Request } from 'express'
import { getAllMuseums, getMuseumDetails, validateEntireMuseum } from '../services/museum'
import { fixBigInt } from '../utils/common'
import { requireOneOf } from '../middlewares/authorizer'
import { Role, EditDataType, EditMetaData, Museum } from '../../../frontend/src/shared/types'
import { DuplicateMuseumCodeError, writeMuseum } from '../services/write/museum'
import { parseTabListQuery } from '../services/tabularQuery'

const router = Router()

router.get('/all', async (_req, res) => {
  const museums = await getAllMuseums()
  return res.status(200).send(museums)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const parsedQuery = parseTabListQuery({
    query: req.query,
    allowedSortingColumns: ['loc_name', 'country', 'max_age', 'min_age', 'lid'],
    defaultSorting: [{ id: 'loc_name', desc: false }],
  })

  if (!parsedQuery.ok) {
    return res.status(400).send({ message: 'Invalid query parameters', errors: parsedQuery.errors })
  }

  const museum = await getMuseumDetails(id, parsedQuery.options)
  if (!museum) return res.status(404).send()
  return res.status(200).send(fixBigInt(museum))
})

router.put(
  '/',
  requireOneOf([Role.Admin]),
  async (req: Request<object, object, { museum: EditDataType<Museum> & EditMetaData }>, res) => {
    try {
      const { ...editedMuseum } = req.body.museum
      const validationErrors = validateEntireMuseum({ ...editedMuseum })
      if (validationErrors.length > 0) {
        return res.status(403).send(validationErrors)
      }
      const museum = await writeMuseum(editedMuseum)
      return res.status(200).send({ museum })
    } catch (error) {
      if (error instanceof DuplicateMuseumCodeError) {
        return res.status(error.status).send({ message: error.message, code: error.code })
      }

      return res.status(500).send({ message: 'Failed to write museum' })
    }
  }
)

export default router
