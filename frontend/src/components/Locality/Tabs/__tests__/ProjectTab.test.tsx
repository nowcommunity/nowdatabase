import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ProjectTab } from '../ProjectTab'
import { useDetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { useGetAllProjectsQuery } from '@/redux/projectReducer'
import { usePageContext } from '@/components/Page'

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

jest.mock('@/components/Page', () => ({
  usePageContext: jest.fn(),
}))

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  Grouped: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: ({ enableAdvancedTableControls }: { enableAdvancedTableControls?: boolean }) => (
    <div data-testid="editable-table" data-advanced={enableAdvancedTableControls ? 'true' : 'false'} />
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

describe('ProjectTab selection regression', () => {
  const setEditData = jest.fn<(value: unknown) => void>()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePageContext.mockReturnValue({ editRights: { edit: true, new: true } } as never)
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
})
