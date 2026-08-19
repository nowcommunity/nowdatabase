import { describe, expect, it } from '@jest/globals'

import { ProjectFormValues } from '@/components/Project/ProjectForm'
import { UserOption } from '@/hooks/useUsersApi'
import { UpdateProjectPayload } from '@/redux/projectReducer'
import type { EditDataType, ProjectDetailsType, ProjectPeople, RowState } from '@/shared/types'

const findUserIdByInitials = (users: UserOption[], initials: string | null): number | null => {
  if (!initials) return null
  const match = users.find(user => user.initials === initials)
  return match?.userId ?? null
}

const mapMembersToUserIds = (project: ProjectDetailsType, users: UserOption[]): number[] =>
  Array.from(
    new Set(
      project.now_proj_people
        .map(member => {
          const userIdFromPeople = (member.com_people as { user_id?: number } | undefined)?.user_id
          const userIdFromRelation = member.com_people?.user?.user_id
          if (typeof userIdFromPeople === 'number') return userIdFromPeople
          if (typeof userIdFromRelation === 'number') return userIdFromRelation
          return findUserIdByInitials(users, member.initials)
        })
        .filter((id): id is number => typeof id === 'number')
    )
  )

const projectToFormValues = (project: ProjectDetailsType, users: UserOption[]): ProjectFormValues => {
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

const mapProjectEditDataToUpdatePayload = (
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
          const userIdFromPeople = (member.com_people as { user_id?: number } | undefined)?.user_id
          const userIdFromRelation = member.com_people?.user?.user_id
          if (typeof userIdFromPeople === 'number') return userIdFromPeople
          if (typeof userIdFromRelation === 'number') return userIdFromRelation
          return findUserIdByInitials(users, member.initials ?? null)
        })
        .filter((id): id is number => typeof id === 'number')
    )
  )

  const normalizeRecordStatus = (value: EditDataType<ProjectDetailsType>['proj_records']) => {
    if (typeof value === 'string') {
      const normalizedValue = (value as string).trim().toLowerCase()
      if (normalizedValue === 'true') return true
      if (normalizedValue === 'false') return false
      return normalizedValue === 'true'
    }
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
    memberUserIds,
  }
}

describe('project mapping helpers', () => {
  const baseProject = {
    pid: 42,
    proj_code: 'PRJ-42',
    proj_name: 'Demo Project',
    proj_status: 'current',
    proj_records: true,
    contact: 'JD',
    now_proj_people: [
      { pid: 42, initials: 'JD' },
      { pid: 42, initials: 'AS' },
    ],
  } as unknown as ProjectDetailsType

  const users = [
    { userId: 1, label: 'Doe, Jane', initials: 'JD' },
    { userId: 2, label: 'Smith, Alex', initials: 'AS' },
  ]

  it('prefills form values from project and user data', () => {
    expect(projectToFormValues(baseProject, users)).toEqual({
      projectCode: 'PRJ-42',
      projectName: 'Demo Project',
      coordinatorUserId: 1,
      projectStatus: 'current',
      recordStatus: true,
      memberUserIds: [2],
    })
  })

  it('maps edit data to update payload while dropping removed members and keeping coordinator if selected', () => {
    const editData = {
      ...baseProject,
      proj_records: 'false',
      now_proj_people: [
        { pid: 42, initials: 'JD', com_people: { user: { user_id: 1 } } },
        { pid: 42, initials: 'AS', com_people: { user: { user_id: 2 } }, rowState: 'removed' },
        { pid: 42, initials: 'MS', com_people: { user: { user_id: 3 } }, rowState: 'new' },
      ],
    } as unknown as EditDataType<ProjectDetailsType>

    const payload = mapProjectEditDataToUpdatePayload(editData, [
      { userId: 1, label: 'Doe, Jane', initials: 'JD' },
      { userId: 3, label: 'Smith, Morgan', initials: 'MS' },
    ])

    expect(payload).toEqual({
      pid: 42,
      projectCode: 'PRJ-42',
      projectName: 'Demo Project',
      coordinatorUserId: 1,
      projectStatus: 'current',
      recordStatus: false,
      memberUserIds: [1, 3],
    })
  })

  it('maps boolean-like record status strings correctly', () => {
    const editData = {
      ...baseProject,
      proj_records: 'true',
    } as unknown as EditDataType<ProjectDetailsType>

    const payload = mapProjectEditDataToUpdatePayload(editData, users)

    expect(payload?.recordStatus).toBe(true)
  })

  it('sends an empty member list when all members are removed', () => {
    const editData = {
      ...baseProject,
      now_proj_people: [],
    } as unknown as EditDataType<ProjectDetailsType>

    const payload = mapProjectEditDataToUpdatePayload(editData, [{ userId: 1, label: 'Doe, Jane', initials: 'JD' }])

    expect(payload).toEqual({
      pid: 42,
      projectCode: 'PRJ-42',
      projectName: 'Demo Project',
      coordinatorUserId: 1,
      projectStatus: 'current',
      recordStatus: true,
      memberUserIds: [],
    })
  })

  it('returns null when coordinator cannot be matched to a user', () => {
    const payload = mapProjectEditDataToUpdatePayload(baseProject as EditDataType<ProjectDetailsType>, [
      { userId: 99, label: 'Other, Person', initials: 'XX' },
    ])

    expect(payload).toBeNull()
  })

  it('keeps a single newly added member when building the payload', () => {
    const editData = {
      ...baseProject,
      now_proj_people: [
        { pid: 42, initials: 'JD', com_people: { user: { user_id: 1 } } },
        { pid: 42, initials: 'AS', com_people: { user: { user_id: 2 } }, rowState: 'new' },
      ],
    } as unknown as EditDataType<ProjectDetailsType>

    const payload = mapProjectEditDataToUpdatePayload(editData, users)

    expect(payload?.memberUserIds).toEqual([1, 2])
  })
})
