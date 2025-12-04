import { type ProjectStatus } from '../constants/status'
import { nowDb } from '../utils/db'
import {
  ensureNonEmptyString,
  ensureValidMemberIds,
  ensureValidProjectStatus,
  ensureValidRecordStatus,
  ensureValidUserId,
  NotFoundError,
  ValidationError,
} from '../validators/projectsValidator'

export type CreateProjectInput = {
  projectCode: string
  projectName: string
  coordinatorUserId: number
  projectStatus?: ProjectStatus | null
  recordStatus?: boolean | null
  memberUserIds?: number[]
}

export type UpdateProjectInput = {
  projectCode?: string
  projectName?: string
  coordinatorUserId?: number
  projectStatus?: ProjectStatus | null
  recordStatus?: boolean | null
  memberUserIds?: number[]
}

const ensureValidProjectStatusValue = (value: unknown) => ensureValidProjectStatus(value)
const ensureValidRecordStatusValue = (value: unknown) => ensureValidRecordStatus(value)

const loadMembersByIds = async (memberIds: number[]) => {
  if (!memberIds.length) return [] as Array<{ initials: string; user_id: number }>

  const members = await nowDb.com_people.findMany({
    select: { initials: true, user_id: true },
    where: { user_id: { in: memberIds } },
  })

  if (members.length !== memberIds.length) {
    throw new ValidationError('One or more project members do not exist')
  }

  return members
}

const loadCoordinatorById = async (coordinatorId: number) => {
  const coordinator = await nowDb.com_people.findFirst({
    select: { initials: true },
    where: { user_id: coordinatorId },
  })

  if (!coordinator) {
    throw new ValidationError('Coordinator user does not exist')
  }

  return coordinator
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
  const validProjectStatus = ensureValidProjectStatusValue(projectStatus)
  const validRecordStatus = ensureValidRecordStatusValue(recordStatus)

  const coordinator = await loadCoordinatorById(coordinatorId)
  const members = await loadMembersByIds(uniqueMemberIds)

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

export const updateProject = async (
  projectId: number,
  { projectCode, projectName, coordinatorUserId, projectStatus, recordStatus, memberUserIds }: UpdateProjectInput
) => {
  const existingProject = await nowDb.now_proj.findUnique({
    where: { pid: projectId },
    include: { now_proj_people: true },
  })

  if (!existingProject) {
    throw new NotFoundError('Project not found')
  }

  const proj_code = projectCode ? ensureNonEmptyString(projectCode, 'Project code') : existingProject.proj_code
  const proj_name = projectName ? ensureNonEmptyString(projectName, 'Project name') : existingProject.proj_name
  const validProjectStatus = ensureValidProjectStatusValue(projectStatus ?? existingProject.proj_status)
  const validRecordStatus = ensureValidRecordStatusValue(recordStatus ?? existingProject.proj_records)

  const coordinatorInitials =
    coordinatorUserId !== undefined
      ? (await loadCoordinatorById(ensureValidUserId(coordinatorUserId, 'Coordinator user ID'))).initials
      : existingProject.contact

  const memberIdsToUpdate = memberUserIds !== undefined ? ensureValidMemberIds(memberUserIds) : null
  const members = memberIdsToUpdate ? await loadMembersByIds(memberIdsToUpdate) : null

  const project = await nowDb.$transaction(async prisma => {
    const updatedProject = await prisma.now_proj.update({
      where: { pid: projectId },
      data: {
        proj_code,
        proj_name,
        proj_status: validProjectStatus,
        proj_records: validRecordStatus,
        contact: coordinatorInitials,
      },
    })

    if (members !== null && memberIdsToUpdate !== null) {
      await prisma.now_proj_people.deleteMany({ where: { pid: projectId } })
      if (members.length) {
        await prisma.now_proj_people.createMany({
          data: members.map(member => ({ pid: projectId, initials: member.initials })),
        })
      }
    }

    return prisma.now_proj.findUnique({ where: { pid: updatedProject.pid }, include: { now_proj_people: true } })
  })

  return project
}
