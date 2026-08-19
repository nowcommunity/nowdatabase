import React from 'react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { Link, MemoryRouter, Route, RouterProvider, Routes, createMemoryRouter, useLocation } from 'react-router-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { ProjectDetailsType, Role } from '@/shared/types'
import { ProjectNewPage } from '@/pages/ProjectNewPage'
import { store } from '@/redux/store'

const mockUseUser = jest.fn()
const mockUseUsersApi = jest.fn()
const mockNotify = jest.fn()
const mockNavigate = jest.fn()
const mockEditProject = jest.fn((_payload: ProjectDetailsType) => ({
  unwrap: () => Promise.resolve({ pid: 7 }),
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
}))

jest.mock('@/hooks/useUsersApi', () => ({
  useUsersApi: (arg?: unknown) => mockUseUsersApi(arg),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

jest.mock('@/redux/projectReducer', () => ({
  useEditProjectMutation: () => [mockEditProject],
}))

jest.mock('@/redux/personReducer', () => ({
  useGetAllPersonsQuery: () => ({
    data: [
      {
        initials: 'JD',
        user: { user_id: 1 },
      },
      {
        initials: 'AS',
        user: { user_id: 2 },
      },
    ],
    isLoading: false,
  }),
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
      <React.Fragment>
        <div data-testid="location">{location.pathname}</div>
        <ProjectNewPage />
      </React.Fragment>
    )
  }

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: '/project/new' }]}>
        <Routes>
          <Route path="/project/new" element={<Wrapper />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

const renderWithDataRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/project/new',
        element: (
          <React.Fragment>
            <ProjectNewPage />
            <Link to="/other">Go elsewhere</Link>
          </React.Fragment>
        ),
      },
      { path: '/other', element: <div>Other page</div> },
    ],
    { initialEntries: ['/project/new'] }
  )

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
  return router
}

describe('ProjectNewPage', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ token: 'token-123', role: Role.Admin })
    mockUseUsersApi.mockReturnValue({ users: [userFactory()], isLoading: false, isError: false })
    mockNotify.mockReset()
    mockNavigate.mockReset()
  })

  it('blocks visitors without a session', async () => {
    mockUseUser.mockReturnValue({ token: null, role: Role.ReadOnly })

    renderWithRouter()
    await waitFor(() => {
      expect(screen.getByText('Sign in to create a project')).toBeTruthy()
    })
  })

  it('requires required fields before submitting', async () => {
    renderWithRouter()

    const form = document.querySelector('form')
    expect(form).toBeTruthy()
    act(() => {
      fireEvent.submit(form as HTMLFormElement)
    })

    await waitFor(() => {
      expect(screen.getByText('Project code is required')).toBeTruthy()
    })
    expect(screen.getByText('Project name is required')).toBeTruthy()
    expect(screen.getByText('Coordinator is required')).toBeTruthy()
    expect(screen.getByText('Project status is required')).toBeTruthy()
    expect(screen.getByText('Record status is required')).toBeTruthy()
  })

  it('submits form data and navigates to the new project', async () => {
    const user = userEvent.setup()
    const otherUser = userFactory({ userId: 2, label: 'Smith, Alex', initials: 'AS' })
    mockUseUsersApi.mockReturnValue({
      users: [userFactory(), otherUser],
      isLoading: false,
      isError: false,
    })

    act(() => {
      renderWithRouter()
    })

    await user.type(screen.getByLabelText('Project Code'), 'PRJ-001')
    await user.type(screen.getByLabelText('Project Name'), 'New Project')

    await user.click(screen.getByTestId('select-coordinator'))
    await user.click(screen.getByText('Doe, Jane'))

    await user.click(screen.getByLabelText('Project Status'))
    await user.click(screen.getByRole('option', { name: 'Current' }))

    await user.click(screen.getByLabelText('Record Status'))
    await user.click(screen.getByRole('option', { name: 'Public' }))

    await user.click(screen.getByTestId('select-members'))
    await user.click(screen.getByText('Smith, Alex'))
    await user.click(screen.getByText('Done'))

    const form = document.querySelector('form')
    expect(form).toBeTruthy()
    act(() => {
      fireEvent.submit(form as HTMLFormElement)
    })

    await waitFor(() => {
      expect(mockEditProject).toHaveBeenCalledWith({
        proj_code: 'PRJ-001',
        proj_name: 'New Project',
        contact: 'JD',
        proj_status: 'current',
        proj_records: true,
        now_proj_people: [{ initials: 'AS', com_people: { initials: 'AS', user: { user_id: 2 } } }],
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/project/7')
    })
  })

  it('shows a prompt when attempting to leave a dirty form and stays on cancel', async () => {
    const user = userEvent.setup()
    const router = renderWithDataRouter()

    await user.type(screen.getByLabelText('Project Code'), 'PRJ-002')

    await user.click(screen.getByRole('link', { name: /go elsewhere/i }))

    await screen.findByRole('dialog')
    expect(screen.getByRole('dialog')).toBeDefined()

    await user.click(screen.getByRole('button', { name: /stay on page/i }))

    expect(router.state.location.pathname).toBe('/project/new')
  })

  it('allows navigation when the user confirms leaving a dirty form', async () => {
    const user = userEvent.setup()
    const router = renderWithDataRouter()

    await user.type(screen.getByLabelText('Project Code'), 'PRJ-003')

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
