import { Router } from 'express'
import { getAllPersons, getPersonDetails } from '../services/person'
import { Role } from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'

const router = Router()

router.get('/all', requireOneOf([Role.Admin]), async (_req, res) => {
  const persons = await getAllPersons()
  return res.status(200).send(persons)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id

  /* Access checking happens differently for this route, since we want to allow the route to return the user's own data for any user */
  if (!req.user) return res.status(401).send()
  if (req.user.role !== Role.Admin && req.user.initials !== id) return res.status(401).send()

  const person = await getPersonDetails(id)
  if (!person) return res.status(404).send()
  return res.status(200).send(person)
})

export default router
