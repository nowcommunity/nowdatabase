import { Router } from 'express'
import { getSpeciesMergeSummary, mergeSpecies, SpeciesMergeRequest } from '../services/speciesMerge'

const router = Router()

router.get('/summary', async (req, res) => {
  const obsoleteIdRaw = req.query.obsoleteId
  const acceptedIdRaw = req.query.acceptedId

  const obsoleteId = typeof obsoleteIdRaw === 'string' ? parseInt(obsoleteIdRaw, 10) : NaN
  const acceptedId = typeof acceptedIdRaw === 'string' ? parseInt(acceptedIdRaw, 10) : NaN

  if (!Number.isFinite(obsoleteId) || !Number.isFinite(acceptedId)) {
    return res.status(400).json({ message: 'obsoleteId and acceptedId must be valid integers' })
  }

  if (obsoleteId === acceptedId) {
    return res.status(400).json({ message: 'obsoleteId and acceptedId must be different' })
  }

  const summary = await getSpeciesMergeSummary(obsoleteId, acceptedId)
  if (!summary) {
    return res.status(404).json({ message: 'Species not found' })
  }

  return res.status(200).send(summary)
})

router.post('/', async (req, res) => {
  const payload = req.body as SpeciesMergeRequest

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ message: 'Invalid payload' })
  }

  if (
    typeof payload.obsoleteSpeciesId !== 'number' ||
    typeof payload.acceptedSpeciesId !== 'number' ||
    payload.obsoleteSpeciesId === payload.acceptedSpeciesId
  ) {
    return res.status(400).json({ message: 'obsoleteSpeciesId and acceptedSpeciesId must be different integers' })
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }
    const result = await mergeSpecies(payload, req.user)
    return res.status(200).json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Merge failed'
    return res.status(400).json({ message })
  }
})

export default router
