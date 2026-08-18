import { ensureValidMemberIds, ValidationError } from '../../validators/projectsValidator'
import { EditDataType, ProjectDetailsType } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { getProjectDetails } from '../project'
import { filterAllowedKeys, fixRadioSelection } from './writeOperations/utils'

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

export const writeProject = async (project: EditDataType<ProjectDetailsType>) => {
  const allowedColumns = getFieldsOfTables(['now_proj'])
  const filteredProject = filterAllowedKeys(project, allowedColumns) as Prisma.now_proj
  let projectId: number

  const contactPerson = await nowDb.com_people.findFirst({ where: { initials: project.contact } })
  if (!contactPerson) {
    throw new ValidationError('Contact does not exist')
  }

  const memberUserIds = project.now_proj_people
    .filter(member => member.rowState !== 'removed')
    .map(member => member.com_people!.user_id)
  const uniqueMemberIds = ensureValidMemberIds(memberUserIds)
  const members = await loadMembersByIds(uniqueMemberIds)

  const existingProject = filteredProject.pid ? await getProjectDetails(filteredProject.pid) : null
  if (!existingProject) {
    const newProject = await nowDb.now_proj.create({
      data: {
        ...filteredProject,
        proj_records: fixRadioSelection(filteredProject.proj_records),
        now_proj_people:
          members.length > 0
            ? {
                create: members.map(member => ({ initials: member.initials })),
              }
            : undefined,
      },
      include: { now_proj_people: true },
    })
    projectId = newProject.pid
  } else {
    await nowDb.$transaction(async prisma => {
      await prisma.now_proj.update({
        where: { pid: filteredProject.pid },
        data: {
          ...filteredProject,
          proj_records: fixRadioSelection(filteredProject.proj_records),
        },
      })

      if (existingProject) {
        // removes all members, then adds back ones that are not marked as removed
        if (Array.isArray(members)) {
          await prisma.now_proj_people.deleteMany({ where: { pid: filteredProject.pid } })
          if (members.length > 0) {
            await prisma.now_proj_people.createMany({
              data: members.map(member => ({ pid: filteredProject.pid, initials: member.initials })),
            })
          }
        }
      }
    })
    projectId = filteredProject.pid
  }

  return projectId
}
