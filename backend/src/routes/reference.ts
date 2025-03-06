import { Request, Router } from 'express'
import {
  getAllReferences,
  getReferenceDetails,
  getReferenceTypes,
  getReferenceAuthors,
  getReferenceJournals,
  getReferenceLocalities,
  getReferenceSpecies,
  validateEntireReference,
  getAuthorsOfReference,
  getJournalById,
} from '../services/reference'
import { requireOneOf } from '../middlewares/authorizer'
import { Role, EditMetaData, ReferenceDetailsType, EditDataType } from '../../../frontend/src/shared/types'
import { deleteReference, writeReference } from '../services/write/reference'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (_req, res) => {
  const references = await getAllReferences()
  return res.status(200).send(references)
})

router.get('/types', async (_req, res) => {
  const referenceTypes = await getReferenceTypes()
  res.status(200).send(referenceTypes)
})

router.get('/authors', async (_req, res) => {
  const referenceTypes = await getReferenceAuthors()
  res.status(200).send(referenceTypes)
})

router.get('/journals', async (_req, res) => {
  const referenceTypes = await getReferenceJournals()
  res.status(200).send(referenceTypes)
})

// Fetch authors by reference ID
router.get('/authors/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const authors = await getAuthorsOfReference(id)
  if (!authors) return res.status(404).send()
  return res.status(200).send(authors)
})

router.get('/journal/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const journal = await getJournalById(id)
  if (!journal) return res.status(404).send()
  return res.status(200).send(journal)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const reference = await getReferenceDetails(id)
  if (!reference) return res.status(404).send()
  return res.status(200).send(reference)
})

router.get('/localities/:id', async (req, res) => {
  const id = req.params.id
  const localities = await getReferenceLocalities(id)
  return res.status(200).send(fixBigInt(localities))
})

router.get('/species/:id', async (req, res) => {
  const id = req.params.id
  const species = await getReferenceSpecies(id)
  return res.status(200).send(fixBigInt(species))
})

router.put(
  '/',
  requireOneOf([Role.Admin, Role.EditUnrestricted]),
  async (req: Request<object, object, { reference: EditDataType<ReferenceDetailsType> & EditMetaData }>, res) => {
    const { ...editedReference } = req.body.reference
    const validationErrors = validateEntireReference(editedReference)
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const rid = await writeReference(editedReference)
    return res.status(200).send({ rid })
  }
)

router.delete('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const rid = parseInt(req.params.id)
  await deleteReference(rid)
  res.status(200).send()
})

export default router
