import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProjectDetails } from '@/components/Project/ProjectDetails'
import { PageContext, PageContextType } from '@/components/Page'
import { ProjectDetailsType } from '@/shared/types'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  ENV: 'dev',
  BACKEND_URL: 'http://localhost',
  ENABLE_WRITE: true,
}))

// Mock DetailView to avoid loading the full component tree with Redux dependencies
jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: (props: { deleteFunction?: () => Promise<void> }) => {
    const handleDelete = () => {
      if (props.deleteFunction) void props.deleteFunction()
    }
    return (
      <div data-testid="detail-view">
        <button onClick={handleDelete}>Delete</button>
      </div>
    )
  },
}))

const mockUseGetProjectDetailsQuery = jest.fn()
const mockUseDeleteProjectMutation = jest.fn()
const mockNotify = jest.fn()
const mockNavigate = jest.fn()
let deleteProjectMock: jest.Mock

jest.mock('@/redux/projectReducer', () => ({
  useGetProjectDetailsQuery: (id: string) => mockUseGetProjectDetailsQuery(id),
  useDeleteProjectMutation: () => mockUseDeleteProjectMutation(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

jest.mock('react-router-dom', () => {
  const actualRouterDom = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actualRouterDom,
    useNavigate: () => mockNavigate,
  }
})

const baseProject: ProjectDetailsType = {
  pid: 5,
  contact: 'TEST-SU',
  proj_code: 'PRJ-005',
  proj_name: 'Sample Project',
  proj_status: 'current',
  proj_records: false,
  now_proj_people: [],
}

const pageContextValue: PageContextType<unknown> = {
  idList: ['5'],
  setIdList: jest.fn(),
  idFieldName: 'pid',
  viewName: 'project',
  previousTableUrls: [],
  setPreviousTableUrls: jest.fn(),
  createTitle: () => baseProject.proj_name ?? '',
  createSubtitle: () => '',
  editRights: { edit: true, delete: true },
  sqlLimit: 20,
  sqlOffset: 0,
  sqlColumnFilters: [],
  sqlOrderBy: [],
  setSqlLimit: jest.fn(),
  setSqlOffset: jest.fn(),
  setSqlColumnFilters: jest.fn(),
  setSqlOrderBy: jest.fn(),
}

const Wrapper = () => {
  // Ensures useParams returns an id during tests when rendered outside of Page
  useParams()
  return <ProjectDetails />
}

const renderWithProviders = () => {
  render(
    <PageContext.Provider value={pageContextValue}>
      <MemoryRouter initialEntries={['/project/5']}>
        <Routes>
          <Route path="/project/:id" element={<Wrapper />} />
        </Routes>
      </MemoryRouter>
    </PageContext.Provider>
  )
}

describe('ProjectDetails', () => {
  beforeEach(() => {
    mockUseGetProjectDetailsQuery.mockReturnValue({ data: baseProject, isLoading: false, isError: false })
    deleteProjectMock = jest.fn(() => ({ unwrap: () => Promise.resolve() }))
    mockUseDeleteProjectMutation.mockReturnValue([deleteProjectMock, { isLoading: false }])
    mockNotify.mockReset()
    mockNavigate.mockReset()
    window.confirm = jest.fn(() => true) as unknown as typeof window.confirm
  })

  it('deletes the project and navigates back to the list', async () => {
    renderWithProviders()

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await userEvent.click(deleteButton)

    await waitFor(() => {
      expect(deleteProjectMock).toHaveBeenCalledWith(baseProject.pid)
    })

    expect(mockNotify).toHaveBeenCalledWith('Deleted project successfully.')
    expect(mockNavigate).toHaveBeenCalledWith('/project')
  })
})
