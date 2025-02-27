import { Router, Request } from 'express'
import { getAllPersons, getPersonDetails, validateEntirePerson } from '../services/person'
import { Role, PersonDetailsType, EditDataType, EditMetaData } from '../../../frontend/src/shared/types'
import { requireOneOf } from '../middlewares/authorizer'
import { writePerson } from '../services/write/person'

const router = Router()

router.get('/all', requireOneOf([Role.Admin]), async (_req, res) => {
  const persons = await getAllPersons()
  return res.status(200).send(persons)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id

  /* Access checking happens differently for this route, since we want to allow the route to return the user's own data for any user */
  if (!req.user)
    return res.status(401).send({
      message: 'User is not logged in',
    })
  if (req.user.role !== Role.Admin && req.user.initials !== id)
    return res.status(401).send({
      message: 'User not authorized for the requested resource or action',
    })

  const person = await getPersonDetails(id)
  if (!person) return res.status(404).send()
  return res.status(200).send(person)
})

router.put(
  '/',
  async (req: Request<object, object, { person: EditDataType<PersonDetailsType> & EditMetaData }>, res) => {
    const { ...editedPerson } = req.body.person

    if (!editedPerson.initials) {
      return res.status(403).send({ error: 'Missing initials, creating new persons is not yet implemented' })
    }

    /* Access checking happens differently for this route, since we want to allow users to modify their own data */
    if (!req.user)
      return res.status(401).send({
        message: 'User not authorized for the requested resource or action',
      })
    if (req.user.role !== Role.Admin && req.user.initials !== editedPerson.initials)
      return res.status(401).send({
        message: 'User not authorized for the requested resource or action',
      })

    const validationErrors = validateEntirePerson({ ...editedPerson })
    if (validationErrors.length > 0) {
      return res.status(403).send(validationErrors)
    }
    const initials = await writePerson(editedPerson)
    return res.status(200).send({ initials })
  }
)

export default router
