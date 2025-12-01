import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Role } from '@/shared/types'
import { ProjectNewPage } from '@/pages/ProjectNewPage'
import type { ProjectFormValues } from '@/components/Project/ProjectForm'

const mockUseUser = jest.fn()
const mockUseUsersApi = jest.fn()
const mockUseProjectsApi = jest.fn()
const mockNotify = jest.fn()
const mockNavigate = jest.fn()

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
}))

jest.mock('@/hooks/useUsersApi', () => ({
  useUsersApi: (arg?: unknown) => mockUseUsersApi(arg),
}))

jest.mock('@/hooks/useProjectsApi', () => ({
  useProjectsApi: () => mockUseProjectsApi(),
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

type User = { userId: number; label: string; initials: string }

const userFactory = (overrides: Partial<User> = {}): User => ({
  userId: 1,
  label: 'Doe, Jane',
  initials: 'JD',
  ...overrides,
})

const renderWithRouter = () => {
  const Wrapper = () => {
    const location = useLocation()
    return (
      <>
        <div data-testid="location">{location.pathname}</div>
        <ProjectNewPage />
      </>
    )
  }

  render(
    <MemoryRouter initialEntries={[{ pathname: '/project/new' }]}>
      <Routes>
        <Route path="/project/new" element={<Wrapper />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProjectNewPage', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ token: 'token-123', role: Role.Admin })
    mockUseUsersApi.mockReturnValue({ users: [userFactory()], isLoading: false, isError: false })
    mockUseProjectsApi.mockReturnValue({
      createProject: jest.fn(() => ({ unwrap: () => Promise.resolve({ pid: 42 }) })),
      isSubmitting: false,
    })
    mockNotify.mockReset()
    mockNavigate.mockReset()
  })

  it('blocks visitors without a session', () => {
    mockUseUser.mockReturnValue({ token: null, role: Role.ReadOnly })

    renderWithRouter()

    expect(screen.getByText('Sign in to create a project')).toBeTruthy()
  })

  it('requires required fields before submitting', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.click(screen.getByRole('button', { name: /create project/i }))

    expect(await screen.findByText('Project code is required')).toBeTruthy()
    expect(screen.getByText('Project name is required')).toBeTruthy()
    expect(screen.getByText('Coordinator is required')).toBeTruthy()
    expect(screen.getByText('Project status is required')).toBeTruthy()
    expect(screen.getByText('Record status is required')).toBeTruthy()
  })

  it('submits form data and navigates to the new project', async () => {
    const user = userEvent.setup()
    const createProject = jest.fn((payload: ProjectFormValues) => ({
      unwrap: () => Promise.resolve({ pid: 7, ...payload }),
    }))
    mockUseProjectsApi.mockReturnValue({ createProject, isSubmitting: false })
    const otherUser = userFactory({ userId: 2, label: 'Smith, Alex', initials: 'AS' })
    mockUseUsersApi.mockReturnValue({
      users: [userFactory(), otherUser],
      isLoading: false,
      isError: false,
    })

    renderWithRouter()

    await user.type(screen.getByLabelText('Project Code'), 'PRJ-001')
    await user.type(screen.getByLabelText('Project Name'), 'New Project')

    await user.click(screen.getByLabelText('Coordinator'))
    await user.click(screen.getByText('Doe, Jane'))

    await user.click(screen.getByLabelText('Project Status'))
    await user.click(screen.getByRole('option', { name: 'Current' }))

    await user.click(screen.getByLabelText('Record Status'))
    await user.click(screen.getByRole('option', { name: 'Public' }))

    await user.click(screen.getByLabelText('Members'))
    await user.click(screen.getByText('Smith, Alex'))

    await user.click(screen.getByRole('button', { name: /create project/i }))

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        projectCode: 'PRJ-001',
        projectName: 'New Project',
        coordinatorUserId: 1,
        projectStatus: 'current',
        recordStatus: true,
        memberUserIds: [2],
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/project/7')
    })
  })
})
