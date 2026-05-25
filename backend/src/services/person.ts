import { nowDb } from '../utils/db'
import {
  EditDataType,
  PersonCoordinatorRelation,
  PersonDetailsType,
  PersonProjectRelation,
} from '../../../frontend/src/shared/types'
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

const formatSpeciesCoordinatorTaxa = (
  taxa: Array<{
    order_name: string
    family_name: string
  }>
): string | undefined => {
  if (taxa.length === 0) return undefined
  return taxa.map(({ order_name, family_name }) => [order_name, family_name].filter(Boolean).join(' / ')).join(', ')
}

export const getPersonRelations = async (
  initials: string
): Promise<{
  project_relations: PersonProjectRelation[]
  coordinator_relations: PersonCoordinatorRelation[]
}> => {
  const [contactProjects, memberProjects, regionalCoordinators, speciesCoordinators, stratigraphyCoordinators] =
    await Promise.all([
      nowDb.now_proj.findMany({
        where: { contact: initials },
        select: { pid: true, proj_code: true, proj_name: true, proj_status: true },
        orderBy: [{ proj_name: 'asc' }, { pid: 'asc' }],
      }),
      nowDb.now_proj_people.findMany({
        where: { initials },
        select: {
          now_proj: { select: { pid: true, proj_code: true, proj_name: true, proj_status: true } },
        },
        orderBy: [{ now_proj: { proj_name: 'asc' } }, { pid: 'asc' }],
      }),
      nowDb.now_reg_coord_people.findMany({
        where: { initials },
        select: {
          now_reg_coord: { select: { reg_coord_id: true, region: true } },
        },
        orderBy: [{ now_reg_coord: { region: 'asc' } }, { reg_coord_id: 'asc' }],
      }),
      nowDb.now_sp_coord_people.findMany({
        where: { initials },
        select: {
          now_sp_coord: {
            select: {
              sp_coord_id: true,
              tax_group: true,
              now_sp_coord_taxa: {
                select: { order_name: true, family_name: true },
                orderBy: [{ order_name: 'asc' }, { family_name: 'asc' }],
              },
            },
          },
        },
        orderBy: [{ now_sp_coord: { tax_group: 'asc' } }, { sp_coord_id: 'asc' }],
      }),
      nowDb.now_strat_coord_people.findMany({
        where: { initials },
        select: {
          now_strat_coord: { select: { strat_coord_id: true, title: true } },
        },
        orderBy: [{ now_strat_coord: { title: 'asc' } }, { strat_coord_id: 'asc' }],
      }),
    ])

  const project_relations: PersonProjectRelation[] = [
    ...contactProjects.map(project => ({ ...project, relation: 'Contact' as const })),
    ...memberProjects.map(({ now_proj }) => ({ ...now_proj, relation: 'Member' as const })),
  ]

  const coordinator_relations: PersonCoordinatorRelation[] = [
    ...regionalCoordinators.map(({ now_reg_coord }) => ({
      id: now_reg_coord.reg_coord_id,
      type: 'Region' as const,
      name: now_reg_coord.region,
    })),
    ...speciesCoordinators.map(({ now_sp_coord }) => ({
      id: now_sp_coord.sp_coord_id,
      type: 'Taxa' as const,
      name: now_sp_coord.tax_group,
      details: formatSpeciesCoordinatorTaxa(now_sp_coord.now_sp_coord_taxa),
    })),
    ...stratigraphyCoordinators.map(({ now_strat_coord }) => ({
      id: now_strat_coord.strat_coord_id,
      type: 'Stratigraphy' as const,
      name: now_strat_coord.title,
    })),
  ]

  return { project_relations, coordinator_relations }
}

export const getPersonDetails = async (id: string) => {
  // TODO: Check if user has access

  const [person, relations] = await Promise.all([
    nowDb.com_people.findUnique({
      where: { initials: id },
    }),
    getPersonRelations(id),
  ])

  if (!person) return null

  if (!person.user_id) return { ...person, user: null, now_user_group: '', ...relations }

  const user = await nowDb.com_users.findUnique({
    where: { user_id: person.user_id },
    select: { user_id: true, user_name: true, last_login: true, now_user_group: true },
  })

  return { ...person, user, now_user_group: user?.now_user_group, ...relations }
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
