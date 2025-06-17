import { nowDb } from '../utils/db'
import { EditDataType, PersonDetailsType } from '../../../frontend/src/shared/types'
import Prisma from '../../prisma/generated/now_test_client'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import { validatePerson } from '../../../frontend/src/shared/validators/person'

export const getAllPersons = async () => {
  const persons = await nowDb.com_people.findMany({})
  const users = await nowDb.com_users.findMany({})
  const userMap = new Map(users.map(user => [user.user_id, user]))
  return persons.map(person => ({ ...person, user: person.user_id ? userMap.get(person.user_id) : null }))
}

export const getPersonDetails = async (id: string) => {
  // TODO: Check if user has access

  const person = await nowDb.com_people.findUnique({
    where: { initials: id },
  })

  if (!person) return null

  if (!person.user_id) return { ...person, user: null }

  const user = await nowDb.com_users.findUnique({
    where: { user_id: person.user_id },
    select: { user_id: true, user_name: true, last_login: true, now_user_group: true },
  })

  return { ...person, user, now_user_group: user?.now_user_group }
}

export const validateEntirePerson = (editedFields: EditDataType<Prisma.com_people>) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validatePerson(editedFields, key as keyof PersonDetailsType)
    if (error.error) errors.push(error)
  }
  return errors
}
