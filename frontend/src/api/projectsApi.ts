import type { ProjectFormValues } from '@/components/Project/ProjectForm'
import type { UserOption } from '@/hooks/useUsersApi'
import type { EditDataType, ProjectDetailsType, ProjectPeople, RowState } from '@/shared/types'
import type { UpdateProjectPayload } from '@/redux/projectReducer'

const findUserIdByInitials = (users: UserOption[], initials: string | null): number | null => {
  if (!initials) return null
  const match = users.find(user => user.initials === initials)
  return match?.userId ?? null
}

const mapMembersToUserIds = (project: ProjectDetailsType, users: UserOption[]): number[] => {
  const ids = project.now_proj_people
    .map(member => {
      const userIdFromRelation = member.com_people?.user?.user_id
      if (typeof userIdFromRelation === 'number') return userIdFromRelation
      return findUserIdByInitials(users, member.initials)
    })
    .filter((id): id is number => typeof id === 'number')

  return Array.from(new Set(ids))
}

export const projectToFormValues = (project: ProjectDetailsType, users: UserOption[]): ProjectFormValues => {
  const coordinatorUserId = findUserIdByInitials(users, project.contact)
  const memberUserIds = mapMembersToUserIds(project, users).filter(id => id !== coordinatorUserId)

  return {
    projectCode: project.proj_code ?? '',
    projectName: project.proj_name ?? '',
    coordinatorUserId,
    projectStatus: project.proj_status ?? '',
    recordStatus: project.proj_records ?? '',
    memberUserIds,
  }
}

const isRemoved = (member: EditDataType<ProjectPeople>) => {
  const state = (member as EditDataType<ProjectPeople> & { rowState?: RowState }).rowState
  return state === 'removed' || state === 'cancelled'
}

export const mapProjectEditDataToUpdatePayload = (
  editData: EditDataType<ProjectDetailsType>,
  users: UserOption[]
): UpdateProjectPayload | null => {
  const coordinatorUserId = findUserIdByInitials(users, editData.contact ?? null)
  if (!coordinatorUserId || typeof editData.pid !== 'number') return null

  const memberUserIds = Array.from(
    new Set(
      (editData.now_proj_people ?? [])
        .filter(member => !isRemoved(member))
        .map(member => {
          const userIdFromRelation = member.com_people?.user?.user_id
          if (typeof userIdFromRelation === 'number') return userIdFromRelation
          return findUserIdByInitials(users, member.initials ?? null)
        })
        .filter((id): id is number => typeof id === 'number' && id !== coordinatorUserId)
    )
  )

  const normalizeRecordStatus = (value: EditDataType<ProjectDetailsType>['proj_records']) => {
    if (typeof value === 'boolean') return value
    return Boolean(value)
  }

  return {
    pid: editData.pid,
    projectCode: (editData.proj_code ?? '').trim(),
    projectName: (editData.proj_name ?? '').trim(),
    coordinatorUserId,
    projectStatus: (editData.proj_status ?? '').toString(),
    recordStatus: normalizeRecordStatus(editData.proj_records),
    memberUserIds: memberUserIds.length ? memberUserIds : undefined,
  }
}
