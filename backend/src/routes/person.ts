import { Router } from 'express'
import { getAllPersons, getPersonDetails } from '../services/person'

const router = Router()

router.get('/all', async (_req, res) => {
  const persons = await getAllPersons()
  return res.status(200).send(persons)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const person = await getPersonDetails(id)
  res.status(200).send(person)
})

export default router
