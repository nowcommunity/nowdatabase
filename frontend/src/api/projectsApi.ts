import type { ProjectFormValues } from '@/components/Project/ProjectForm'
import type { UserOption } from '@/hooks/useUsersApi'
import type { ProjectDetailsType } from '@/shared/types'

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
