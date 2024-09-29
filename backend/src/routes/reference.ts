import { Request, Router } from 'express'
import { getAllReferences, getReferenceDetails, getReferenceTypes, getReferenceAuthors, getReferenceJournals } from '../services/reference'
import { requireOneOf } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'
import { EditMetaData, ReferenceDetailsType } from '../../../frontend/src/backendTypes'
import { deleteReference, writeReference } from '../services/write/reference'

const router = Router()

router.get('/all', async (_req, res) => {
  const references = await getAllReferences()
  return res.status(200).send(references)
})

router.get('/types', async (_req, res) => {
  const referenceTypes = await getReferenceTypes()
  res.status(200).send(referenceTypes)
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const reference = await getReferenceDetails(id)
  if (!reference) return res.status(404).send()
  return res.status(200).send(reference)
})

router.get('/authors', async (_req, res) => {
  const referenceTypes = await getReferenceAuthors()
  res.status(200).send(referenceTypes)
})

router.get('/journals', async (_req, res) => {
  const referenceTypes = await getReferenceJournals()
  res.status(200).send(referenceTypes)
})

router.put(
  '/',
  requireOneOf([Role.Admin]),
  async (req: Request<object, object, { reference: ReferenceDetailsType & EditMetaData }>, res) => {
    const { ...editedReference } = req.body.reference
    const id = await writeReference(editedReference)
    return res.status(200).send({ id })
  }
)

router.delete('/:id', requireOneOf([Role.Admin]), async (req, res) => {
  const id = parseInt(req.params.id)
  await deleteReference(id, req.user!)
  res.status(200).send()
})

export default router
