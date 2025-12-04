import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react'

import { useProject } from '@/hooks/useProject'
import { useUsersApi } from '@/hooks/useUsersApi'
import { useGetProjectDetailsQuery } from '@/redux/projectsSlice'
import { mapProjectEditDataToUpdatePayload } from '@/api/projectsApi'
import type { EditDataType, ProjectDetailsType } from '@/shared/types'

jest.mock('@/redux/projectsSlice')
jest.mock('@/hooks/useUsersApi')

const mockUseGetProjectDetailsQuery = useGetProjectDetailsQuery as jest.MockedFunction<typeof useGetProjectDetailsQuery>
const mockUseUsersApi = useUsersApi as jest.MockedFunction<typeof useUsersApi>

describe('useProject', () => {
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

  beforeEach(() => {
    mockUseGetProjectDetailsQuery.mockReset()
    mockUseUsersApi.mockReset()
  })

  it('prefills form values from project and user data', () => {
    mockUseGetProjectDetailsQuery.mockReturnValue({
      data: baseProject,
      isLoading: false,
      isError: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as ReturnType<typeof useGetProjectDetailsQuery>)
    mockUseUsersApi.mockReturnValue({
      users: [
        { userId: 1, label: 'Doe, Jane', initials: 'JD' },
        { userId: 2, label: 'Smith, Alex', initials: 'AS' },
      ],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsersApi>)

    const { result } = renderHook(() => useProject(baseProject.pid))

    expect(result.current.initialValues).toEqual({
      projectCode: 'PRJ-42',
      projectName: 'Demo Project',
      coordinatorUserId: 1,
      projectStatus: 'current',
      recordStatus: true,
      memberUserIds: [2],
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('surfaces loading and error states from either query', () => {
    mockUseGetProjectDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as ReturnType<typeof useGetProjectDetailsQuery>)
    mockUseUsersApi.mockReturnValue({
      users: [],
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useUsersApi>)

    const { result } = renderHook(() => useProject(baseProject.pid))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isError).toBe(true)
    expect(result.current.initialValues).toBeNull()
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

    const payload = mapProjectEditDataToUpdatePayload(editData, [
      { userId: 1, label: 'Doe, Jane', initials: 'JD' },
      { userId: 2, label: 'Smith, Alex', initials: 'AS' },
    ])

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
})
