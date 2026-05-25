import { nowDb } from '../utils/db'
import { EditDataType, PersonDetailsType } from '../../../frontend/src/shared/types'
import Prisma from '../../prisma/generated/now_test_client'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import { validatePerson } from '../../../frontend/src/shared/validators/person'

const PERSON_DELETE_BLOCKED_PREFIX = 'Person cannot be deleted because they are linked to'
export const PERSON_DELETE_SELF_MESSAGE = 'You cannot delete your own person record.'

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

const hasAny = async (checks: Array<Promise<number>>): Promise<boolean> => {
  const counts = await Promise.all(checks)
  return counts.some(count => count > 0)
}

const hasUpdateActivity = async (initials: string): Promise<boolean> => {
  return hasAny([
    nowDb.now_lau.count({ where: { OR: [{ lau_coordinator: initials }, { lau_authorizer: initials }] } }),
    nowDb.now_sau.count({ where: { OR: [{ sau_coordinator: initials }, { sau_authorizer: initials }] } }),
    nowDb.now_tau.count({ where: { OR: [{ tau_coordinator: initials }, { tau_authorizer: initials }] } }),
    nowDb.now_bau.count({ where: { OR: [{ bau_coordinator: initials }, { bau_authorizer: initials }] } }),
    nowDb.now_time_update.count({ where: { OR: [{ coordinator: initials }, { authorizer: initials }] } }),
  ])
}

const hasCoordinationOrProjectLinks = async (initials: string): Promise<boolean> => {
  return hasAny([
    nowDb.now_proj.count({ where: { contact: initials } }),
    nowDb.now_proj_people.count({ where: { initials } }),
    nowDb.now_reg_coord_people.count({ where: { initials } }),
    nowDb.now_sp_coord_people.count({ where: { initials } }),
    nowDb.now_strat_coord_people.count({ where: { initials } }),
  ])
}

export const getPersonDeleteBlockers = async (initials: string): Promise<string[]> => {
  const blockers: string[] = []

  if (await hasUpdateActivity(initials)) {
    blockers.push('person has data update history')
  }

  if (await hasCoordinationOrProjectLinks(initials)) {
    blockers.push('person is assigned to projects or coordinator groups')
  }

  return blockers
}

export const formatPersonDeleteBlockedMessage = (blockers: string[]): string => {
  if (blockers.length === 0) return 'Person cannot be deleted.'
  return `${PERSON_DELETE_BLOCKED_PREFIX}: ${blockers.join('; ')}.`
}

export const deletePerson = async (initials: string, currentUserInitials: string) => {
  if (initials === currentUserInitials) {
    return { deleted: false, status: 409 as const, message: PERSON_DELETE_SELF_MESSAGE, blockers: ['self'] }
  }

  const person = await nowDb.com_people.findUnique({
    where: { initials },
    select: { initials: true, user_id: true },
  })

  if (!person) {
    return { deleted: false, status: 404 as const, message: 'Person not found.', blockers: [] }
  }

  const blockers = await getPersonDeleteBlockers(initials)
  if (blockers.length > 0) {
    return {
      deleted: false,
      status: 409 as const,
      message: formatPersonDeleteBlockedMessage(blockers),
      blockers,
    }
  }

  await nowDb.$transaction(async prisma => {
    await prisma.com_people.delete({ where: { initials } })

    if (person.user_id) {
      await prisma.com_users.deleteMany({ where: { user_id: person.user_id } })
    }
  })

  return { deleted: true, status: 200 as const, message: null, blockers: [] }
}
