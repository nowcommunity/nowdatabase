import React from 'react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { Link, MemoryRouter, Route, RouterProvider, Routes, createMemoryRouter, useLocation } from 'react-router-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Role } from '@/shared/types'
import { ProjectEditPage } from '@/pages/projects/ProjectEditPage'
import type { ProjectFormValues } from '@/components/Project/ProjectForm'

const mockUseUser = jest.fn()
const mockUseProject = jest.fn()
const mockUseUpdateProjectMutation = jest.fn()
const mockNotify = jest.fn()
const mockNavigate = jest.fn()
type UpdateProjectTrigger = (payload: ProjectFormValues) => {
  unwrap: () => Promise<ProjectFormValues & { pid: number }>
}
let updateProjectMock: jest.MockedFunction<UpdateProjectTrigger>

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
}))

jest.mock('@/hooks/useProject', () => ({
  useProject: (arg?: unknown) => mockUseProject(arg),
}))

jest.mock('@/redux/projectReducer', () => ({
  useUpdateProjectMutation: () => mockUseUpdateProjectMutation(),
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

const defaultInitialValues: ProjectFormValues = {
  projectCode: 'PRJ-100',
  projectName: 'Existing Project',
  coordinatorUserId: 1,
  projectStatus: 'current',
  recordStatus: true,
  memberUserIds: [2],
}

const renderWithRouter = () => {
  const Wrapper = () => {
    const location = useLocation()
    return (
      <React.Fragment>
        <div data-testid="location">{location.pathname}</div>
        <ProjectEditPage />
      </React.Fragment>
    )
  }

  render(
    <MemoryRouter initialEntries={['/project/7/edit']}>
      <Routes>
        <Route path="/project/:id/edit" element={<Wrapper />} />
      </Routes>
    </MemoryRouter>
  )
}

const renderWithDataRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/project/:id/edit',
        element: (
          <React.Fragment>
            <ProjectEditPage />
            <Link to="/other">Go elsewhere</Link>
          </React.Fragment>
        ),
      },
      { path: '/other', element: <div>Other page</div> },
    ],
    { initialEntries: ['/project/7/edit'] }
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('ProjectEditPage', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ token: 'token-123', role: Role.Admin })
    mockUseProject.mockReturnValue({
      project: { pid: 7, proj_name: 'Existing Project' },
      initialValues: defaultInitialValues,
      users: [userFactory(), userFactory({ userId: 2, label: 'Smith, Alex', initials: 'AS' })],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    })

    const updateProjectImpl: UpdateProjectTrigger = payload => ({
      unwrap: () => Promise.resolve({ pid: 7, ...payload }),
    })
    updateProjectMock = jest.fn(updateProjectImpl) as jest.MockedFunction<UpdateProjectTrigger>

    mockUseUpdateProjectMutation.mockReturnValue([
      updateProjectMock as unknown as UpdateProjectTrigger,
      { isLoading: false },
    ])
    mockNotify.mockReset()
    mockNavigate.mockReset()
  })

  it('submits form data and navigates to the project detail page', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.clear(screen.getByLabelText('Project Name'))
    await user.type(screen.getByLabelText('Project Name'), 'Updated Project')

    const form = document.querySelector('form')
    expect(form).toBeTruthy()
    act(() => {
      fireEvent.submit(form as HTMLFormElement)
    })

    await waitFor(() => {
      expect(updateProjectMock).toHaveBeenCalledWith(
        expect.objectContaining({
          projectCode: 'PRJ-100',
          projectName: 'Updated Project',
          coordinatorUserId: 1,
          projectStatus: 'current',
          recordStatus: true,
          memberUserIds: [2],
        })
      )
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/project/7')
    })
  })

  it('shows a prompt when attempting to leave a dirty form and stays on cancel', async () => {
    const user = userEvent.setup()
    const router = renderWithDataRouter()

    await user.type(screen.getByLabelText('Project Name'), ' Updated')

    await user.click(screen.getByRole('link', { name: /go elsewhere/i }))

    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: /stay on page/i }))

    expect(router.state.location.pathname).toBe('/project/7/edit')
  })

  it('allows navigation when the user confirms leaving a dirty form', async () => {
    const user = userEvent.setup()
    const router = renderWithDataRouter()

    await user.type(screen.getByLabelText('Project Code'), ' UPDATED')
    await user.click(screen.getByRole('link', { name: /go elsewhere/i }))

    await user.click(await screen.findByRole('button', { name: /leave page/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/other')
    })
  })

  it('navigates without prompting when the form is clean', async () => {
    const user = userEvent.setup()
    const router = renderWithDataRouter()

    await user.click(screen.getByRole('link', { name: /go elsewhere/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/other')
    })
  })
})
