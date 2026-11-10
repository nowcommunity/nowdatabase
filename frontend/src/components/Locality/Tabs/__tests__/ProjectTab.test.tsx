import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { skipToken } from '@reduxjs/toolkit/query'
import { ProjectTab } from '../ProjectTab'
import { useDetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { useGetAllProjectsQuery } from '@/redux/projectReducer'
import { usePageContext } from '@/components/Page'
import { useUser } from '@/hooks/user'
import { Role } from '@/shared/types'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
  modeOptionToMode: {
    new: { read: false, staging: false, new: true, option: 'new' },
    read: { read: true, staging: false, new: false, option: 'read' },
    edit: { read: false, staging: false, new: false, option: 'edit' },
    'staging-edit': { read: false, staging: true, new: false, option: 'staging-edit' },
    'staging-new': { read: false, staging: true, new: true, option: 'staging-new' },
  },
}))

jest.mock('@/redux/projectReducer', () => ({
  useGetAllProjectsQuery: jest.fn(),
}))

jest.mock('@/hooks/user', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/components/Page', () => ({
  usePageContext: jest.fn(),
}))

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  Grouped: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: ({
    enableAdvancedTableControls,
    isRowRemovalDisabled,
  }: {
    enableAdvancedTableControls?: boolean
    isRowRemovalDisabled?: (row: { pid: number }) => boolean
  }) => (
    <div
      data-testid="editable-table"
      data-advanced={enableAdvancedTableControls ? 'true' : 'false'}
      data-own-disabled={String(isRowRemovalDisabled?.({ pid: 3 }))}
      data-foreign-disabled={String(isRowRemovalDisabled?.({ pid: 35 }))}
    />
  ),
}))

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: ({ editingAction }: { editingAction: (project: { pid: number; proj_name: string }) => void }) => (
    <button onClick={() => editingAction({ pid: 100, proj_name: 'Project Alpha' })}>select project</button>
  ),
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext>
const mockUseGetAllProjectsQuery = useGetAllProjectsQuery as jest.MockedFunction<typeof useGetAllProjectsQuery>
const mockUsePageContext = usePageContext as jest.MockedFunction<typeof usePageContext>
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>

const createUser = (overrides: Partial<ReturnType<typeof useUser>>) => ({
  token: 'token',
  username: 'user',
  role: Role.EditRestricted,
  initials: 'TE',
  localities: [],
  isFirstLogin: undefined,
  ...overrides,
})

describe('ProjectTab selection regression', () => {
  const setEditData = jest.fn<(value: unknown) => void>()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePageContext.mockReturnValue({ editRights: { edit: true, new: true } } as never)
    mockUseUser.mockReturnValue(createUser({ projects: [3] }))
    mockUseGetAllProjectsQuery.mockReturnValue({ data: [], isError: false } as never)
  })

  it('adds selected projects to pending links', () => {
    mockUseDetailContext.mockReturnValue({
      mode: modeOptionToMode.edit,
      editData: { lid: 1, now_plr: [] },
      setEditData,
    } as never)

    render(<ProjectTab />)

    fireEvent.click(screen.getByRole('button', { name: /select project/i }))

    expect(setEditData).toHaveBeenCalledWith({
      lid: 1,
      now_plr: [{ lid: 1, pid: 100, now_proj: { pid: 100, proj_name: 'Project Alpha' }, rowState: 'new' }],
    })
    expect(screen.getByTestId('editable-table').getAttribute('data-advanced')).toBe('true')
  })

  it('hides edit-only project selector for read-only users', () => {
    mockUsePageContext.mockReturnValue({ editRights: { edit: false, new: false } } as never)
    mockUseDetailContext.mockReturnValue({
      mode: modeOptionToMode.read,
      editData: { lid: 1, now_plr: [] },
      setEditData,
    } as never)

    render(<ProjectTab />)

    expect(screen.queryByRole('button', { name: /select project/i })).toBeNull()
    expect(mockUseGetAllProjectsQuery).toHaveBeenCalledWith(skipToken)
  })

  it('shows duplicate warning when selected project already exists', () => {
    mockUseDetailContext.mockReturnValue({
      mode: modeOptionToMode.edit,
      editData: { lid: 1, now_plr: [{ lid: 1, pid: 100, rowState: 'clean' }] },
      setEditData,
    } as never)

    render(<ProjectTab />)

    fireEvent.click(screen.getByRole('button', { name: /select project/i }))

    expect(screen.getByTestId('project-selection-error').textContent).toContain('already linked')
  })

  const renderEditTab = () => {
    mockUseDetailContext.mockReturnValue({
      mode: modeOptionToMode.edit,
      editData: { lid: 1, now_plr: [] },
      setEditData,
    } as never)
    render(<ProjectTab />)
    return screen.getByTestId('editable-table')
  }

  it('disables removing projects the EditRestricted user is not a member of', () => {
    const table = renderEditTab()

    expect(table.getAttribute('data-own-disabled')).toBe('false')
    expect(table.getAttribute('data-foreign-disabled')).toBe('true')
  })

  it('does not disable removal for sessions without a stored project list', () => {
    mockUseUser.mockReturnValue(createUser({ projects: undefined }))
    const table = renderEditTab()

    expect(table.getAttribute('data-foreign-disabled')).toBe('false')
  })

  it('does not disable removal for unrestricted users', () => {
    mockUseUser.mockReturnValue(createUser({ role: Role.EditUnrestricted, projects: [3] }))
    const table = renderEditTab()

    expect(table.getAttribute('data-foreign-disabled')).toBe('false')
  })
})
