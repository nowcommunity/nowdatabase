import { PROJECT_STATUSES, type ProjectStatus, RECORD_STATUS_VALUES } from '../constants/status'
import { nowDb } from '../utils/db'

export class ValidationError extends Error {
  declare status: number

  constructor(message: string) {
    super(message)
    this.status = 400
  }
}

export type CreateProjectInput = {
  projectCode: string
  projectName: string
  coordinatorUserId: number
  projectStatus?: ProjectStatus | null
  recordStatus?: boolean | null
  memberUserIds?: number[]
}

const ensureNonEmptyString = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${fieldName} is required`)
  }

  return value.trim()
}

const ensureValidUserId = (value: unknown, fieldName: string) => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }

  return value
}

const ensureValidMemberIds = (memberUserIds: unknown) => {
  if (memberUserIds === undefined) return [] as number[]

  if (!Array.isArray(memberUserIds)) {
    throw new ValidationError('Project members must be an array of user IDs')
  }

  const numericIds = memberUserIds.filter((id): id is number => typeof id === 'number' && Number.isInteger(id))

  if (numericIds.length !== memberUserIds.length) {
    throw new ValidationError('Project members must be an array of user IDs')
  }

  return Array.from(new Set(numericIds))
}

const ensureValidProjectStatus = (value: unknown): ProjectStatus | null => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !PROJECT_STATUSES.includes(value as ProjectStatus)) {
    throw new ValidationError('Project status is invalid')
  }

  return value as ProjectStatus
}

const ensureValidRecordStatus = (value: unknown): boolean | null => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'boolean' || !RECORD_STATUS_VALUES.includes(value)) {
    throw new ValidationError('Record status is invalid')
  }

  return value
}

export const createProject = async ({
  projectCode,
  projectName,
  coordinatorUserId,
  projectStatus,
  recordStatus,
  memberUserIds,
}: CreateProjectInput) => {
  const proj_code = ensureNonEmptyString(projectCode, 'Project code')
  const proj_name = ensureNonEmptyString(projectName, 'Project name')
  const coordinatorId = ensureValidUserId(coordinatorUserId, 'Coordinator user ID')
  const uniqueMemberIds = ensureValidMemberIds(memberUserIds)
  const validProjectStatus = ensureValidProjectStatus(projectStatus)
  const validRecordStatus = ensureValidRecordStatus(recordStatus)

  const coordinator = await nowDb.com_people.findFirst({
    select: { initials: true },
    where: { user_id: coordinatorId },
  })

  if (!coordinator) {
    throw new ValidationError('Coordinator user does not exist')
  }

  const members = uniqueMemberIds.length
    ? await nowDb.com_people.findMany({
        select: { initials: true, user_id: true },
        where: { user_id: { in: uniqueMemberIds } },
      })
    : []

  if (members.length !== uniqueMemberIds.length) {
    throw new ValidationError('One or more project members do not exist')
  }

  const project = await nowDb.$transaction(async prisma => {
    const createdProject = await prisma.now_proj.create({
      data: {
        proj_code,
        proj_name,
        proj_status: validProjectStatus,
        proj_records: validRecordStatus,
        contact: coordinator.initials,
        now_proj_people: members.length
          ? {
              create: members.map(member => ({ initials: member.initials })),
            }
          : undefined,
      },
      include: { now_proj_people: true },
    })

    return createdProject
  })

  return project
}
