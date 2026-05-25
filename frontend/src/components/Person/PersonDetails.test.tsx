import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PersonDetails } from '@/components/Person/PersonDetails'
import { PersonDetailsType, Role } from '@/shared/types'

jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: (props: { deleteFunction?: () => Promise<void> }) => {
    const handleDelete = () => {
      if (props.deleteFunction) void props.deleteFunction()
    }
    return <button onClick={handleDelete}>Delete</button>
  },
}))

jest.mock('@/components/Person/Tabs/PersonTab', () => ({
  PersonTab: () => <div data-testid="person-tab" />,
}))

const mockUseGetPersonDetailsQuery = jest.fn()
const mockUseGetPersonDetailsIdMutation = jest.fn()
const mockUseEditPersonMutation = jest.fn()
const mockUseDeletePersonMutation = jest.fn()
const mockUseUser = jest.fn()
const mockNotify = jest.fn()
const mockNavigate = jest.fn()
let deletePersonMock: jest.Mock

jest.mock('@/redux/personReducer', () => ({
  useGetPersonDetailsQuery: (id: string, options?: unknown) => mockUseGetPersonDetailsQuery(id, options),
  useGetPersonDetailsIdMutation: () => mockUseGetPersonDetailsIdMutation(),
  useEditPersonMutation: () => mockUseEditPersonMutation(),
  useDeletePersonMutation: () => mockUseDeletePersonMutation(),
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
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

const person: PersonDetailsType = {
  initials: 'DEL-UI',
  first_name: 'Delete',
  surname: 'Ui',
  full_name: 'Delete Ui',
  format: null,
  email: 'delete-ui@example.com',
  user_id: null,
  organization: 'Test organization',
  country: 'Finland',
  password_set: null,
  used_morph: null,
  used_now: null,
  used_gene: null,
  user: null,
  now_user_group: '',
}

const renderPersonDetails = () => {
  render(
    <MemoryRouter initialEntries={['/person/DEL-UI']}>
      <Routes>
        <Route path="/person/:id" element={<PersonDetails />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PersonDetails', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ initials: 'TEST-SU', role: Role.Admin })
    mockUseGetPersonDetailsQuery.mockReturnValue({ data: person, isLoading: false, isError: false })
    mockUseGetPersonDetailsIdMutation.mockReturnValue([jest.fn()])
    mockUseEditPersonMutation.mockReturnValue([jest.fn(), { isLoading: false }])
    deletePersonMock = jest.fn(() => ({ unwrap: () => Promise.resolve() }))
    mockUseDeletePersonMutation.mockReturnValue([deletePersonMock, { isLoading: false }])
    mockNotify.mockReset()
    mockNavigate.mockReset()
  })

  it('deletes the person and navigates back to the list', async () => {
    renderPersonDetails()

    await userEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(deletePersonMock).toHaveBeenCalledWith(person.initials)
    })
    expect(mockNotify).toHaveBeenCalledWith('Deleted person successfully.')
    expect(mockNavigate).toHaveBeenCalledWith('/person')
  })

  it('shows the backend message when deleting is blocked', async () => {
    deletePersonMock.mockReturnValue({
      unwrap: () =>
        Promise.reject(
          Object.assign(new Error('Delete blocked'), {
            status: 409,
            data: { message: 'Person cannot be deleted because they are still linked to database data.' },
          })
        ),
    })

    renderPersonDetails()

    await userEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        'Person cannot be deleted because they are still linked to database data.',
        'error'
      )
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
