import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { LocalityDetails } from '@/components/Locality/LocalityDetails'
import { useUser } from '@/hooks/user'
import { useDeleteLocalityMutation, useEditLocalityMutation, useGetLocalityDetailsQuery } from '@/redux/localityReducer'
import { EditDataType, LocalityDetailsType, Role } from '@/shared/types'

jest.mock('@/util/config', () => ({ ENV: 'test', BACKEND_URL: 'http://localhost', ENABLE_WRITE: true }))
jest.mock('@/hooks/user', () => ({ useUser: jest.fn() }))
const mockNotify = jest.fn()

jest.mock('@/hooks/notification', () => ({ useNotify: () => ({ notify: mockNotify }) }))
jest.mock('@/redux/localityReducer', () => ({
  useDeleteLocalityMutation: jest.fn(),
  useEditLocalityMutation: jest.fn(),
  useGetLocalityDetailsQuery: jest.fn(),
}))
jest.mock('@/components/Locality/Tabs/AgeTab', () => ({ AgeTab: () => null }))
jest.mock('@/components/Locality/Tabs/ArchaeologyTab', () => ({ ArchaeologyTab: () => null }))
jest.mock('@/components/Locality/Tabs/ClimateTab', () => ({ ClimateTab: () => null }))
jest.mock('@/components/Locality/Tabs/EcometricsTab', () => ({ EcometricsTab: () => null }))
jest.mock('@/components/Locality/Tabs/LithologyTab', () => ({ LithologyTab: () => null }))
jest.mock('@/components/Locality/Tabs/LocalityTab', () => ({ LocalityTab: () => null }))
jest.mock('@/components/Locality/Tabs/MuseumTab', () => ({ MuseumTab: () => null }))
jest.mock('@/components/Locality/Tabs/OccurrencesTab', () => ({ OccurrencesTab: () => null }))
jest.mock('@/components/Locality/Tabs/ProjectTab', () => ({ ProjectTab: () => null }))
jest.mock('@/components/Locality/Tabs/TaphonomyTab', () => ({ TaphonomyTab: () => null }))
jest.mock('@/components/DetailView/common/UpdateTab', () => ({ UpdateTab: () => null }))
jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: ({
    onWrite,
  }: {
    onWrite: (
      data: EditDataType<LocalityDetailsType>,
      setData: (data: EditDataType<LocalityDetailsType>) => void
    ) => Promise<unknown>
  }) => (
    <button
      onClick={() => {
        void onWrite(
          {
            lid: 42,
            now_plr: [
              { lid: 42, pid: 3, rowState: 'removed' },
              { lid: 42, pid: 35, rowState: 'clean' },
            ],
          } as EditDataType<LocalityDetailsType>,
          jest.fn()
        )
      }}
    >
      Save
    </button>
  ),
}))

const mockEdit = jest.mocked(useEditLocalityMutation)
const mockDetails = jest.mocked(useGetLocalityDetailsQuery)
const mockDelete = jest.mocked(useDeleteLocalityMutation)
const mockUser = jest.mocked(useUser)
const refetch = jest.fn()

const renderLocality = (path = '/locality/42') => {
  const router = createMemoryRouter(
    [
      { path: '/locality', element: <div>Localities list</div> },
      { path: '/locality/:id', element: <LocalityDetails /> },
    ],
    { initialEntries: [path] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe('Locality save navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    mockUser.mockReturnValue({
      token: 'token',
      username: 'test',
      role: Role.EditRestricted,
      initials: 'TE',
      localities: [42],
      projects: [3],
      isFirstLogin: undefined,
    })
    mockDetails.mockReturnValue({
      data: { lid: 42, loc_name: 'Locality' },
      isFetching: false,
      isError: false,
      refetch,
    } as never)
    mockDelete.mockReturnValue([jest.fn(), { isSuccess: false, isError: false }] as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns to the localities list after confirming removal of the last accessible project', async () => {
    const unwrap = jest.fn<() => Promise<{ id: number; editAccess: boolean }>>().mockResolvedValue({
      id: 42,
      editAccess: false,
    })
    mockEdit.mockReturnValue([jest.fn(() => ({ unwrap })), { isLoading: false }] as never)
    const router = renderLocality()

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(window.confirm).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Localities list')).toBeTruthy()
    expect(router.state.location.pathname).toBe('/locality')
    expect(refetch).not.toHaveBeenCalled()
  })

  it('retains the detail route and refreshes when edit access remains', async () => {
    refetch.mockReturnValue(Promise.resolve({ data: { lid: 42, loc_name: 'Updated' } }))
    const unwrap = jest.fn<() => Promise<{ id: number; editAccess: boolean }>>().mockResolvedValue({
      id: 42,
      editAccess: true,
    })
    mockEdit.mockReturnValue([jest.fn(() => ({ unwrap })), { isLoading: false }] as never)
    const router = renderLocality()

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1))
    expect(router.state.location.pathname).toBe('/locality/42')
    expect(screen.queryByText('Localities list')).toBeNull()
  })

  it('does not save or navigate when the warning is declined', () => {
    jest.mocked(window.confirm).mockReturnValue(false)
    const edit = jest.fn()
    mockEdit.mockReturnValue([edit, { isLoading: false }] as never)
    const router = renderLocality()

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(edit).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe('/locality/42')
    expect(refetch).not.toHaveBeenCalled()
  })

  it('does not navigate on a failed save', async () => {
    const unwrap = jest.fn<() => Promise<never>>().mockRejectedValue({ status: 403 })
    mockEdit.mockReturnValue([jest.fn(() => ({ unwrap })), { isLoading: false }] as never)
    const router = renderLocality()

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(mockNotify).toHaveBeenCalledWith('Could not edit item. Error happened.', 'error'))
    expect(router.state.location.pathname).toBe('/locality/42')
    expect(refetch).not.toHaveBeenCalled()
  })

  it('navigates to the new locality after creation', async () => {
    const unwrap = jest.fn<() => Promise<{ id: number }>>().mockResolvedValue({ id: 42 })
    mockEdit.mockReturnValue([jest.fn(() => ({ unwrap })), { isLoading: false }] as never)
    const router = renderLocality('/locality/new')

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/locality/42'))
    expect(window.confirm).not.toHaveBeenCalled()
    expect(refetch).not.toHaveBeenCalled()
  })
})
