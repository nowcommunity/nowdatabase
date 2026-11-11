import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { Provider } from 'react-redux'
import { api } from '@/redux/api'
import { useEditLocalityMutation } from '@/redux/localityReducer'
import { setUser, UserState, userReducer } from '@/redux/userReducer'
import { EditDataType, EditMetaData, LocalityDetailsType, Role } from '@/shared/types'

const localityId = 42

const createResponse = (status: number, body: unknown): Response => {
  const response = {
    status,
    statusText: status === 403 ? 'Forbidden' : 'OK',
    ok: status >= 200 && status < 300,
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
    },
    clone: () => createResponse(status, body),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }
  return response as Response
}

const createStore = () => {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      user: userReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
  })
  const user: UserState = {
    token: 'test-token',
    username: 'test-user',
    role: Role.EditRestricted,
    initials: 'TE',
    localities: [localityId],
    isFirstLogin: undefined,
  }
  store.dispatch(setUser(user))
  return store
}

const createLocality = (
  projectLinks: Array<{ pid: number; rowState: 'clean' | 'removed' }>
): EditDataType<LocalityDetailsType> & EditMetaData =>
  ({
    lid: localityId,
    now_plr: projectLinks,
  }) as unknown as EditDataType<LocalityDetailsType> & EditMetaData

const EditLocalityButton = ({
  locality,
  onSettled,
}: {
  locality: EditDataType<LocalityDetailsType> & EditMetaData
  onSettled: (succeeded: boolean) => void
}) => {
  const [editLocality] = useEditLocalityMutation()

  return (
    <button
      onClick={() => {
        void editLocality(locality)
          .unwrap()
          .then(
            () => onSettled(true),
            () => onSettled(false)
          )
      }}
    >
      Save
    </button>
  )
}

const renderEditLocality = (
  locality: EditDataType<LocalityDetailsType> & EditMetaData,
  onSettled: (succeeded: boolean) => void
) => {
  const store = createStore()
  render(
    <Provider store={store}>
      <EditLocalityButton locality={locality} onSettled={onSettled} />
    </Provider>
  )
  return store
}

afterEach(() => {
  jest.restoreAllMocks()
})

describe('editLocality project access state', () => {
  it('removes locality edit access when the server reports editAccess false', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(createResponse(200, { id: localityId, editAccess: false }))
    const onSettled = jest.fn()
    const store = renderEditLocality(createLocality([{ pid: 7, rowState: 'removed' }]), onSettled)

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onSettled).toHaveBeenCalledWith(true))
    expect(store.getState().user.localities).not.toContain(localityId)
  })

  it('keeps locality edit access when the server reports editAccess true', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(createResponse(200, { id: localityId, editAccess: true }))
    const onSettled = jest.fn()
    const store = renderEditLocality(
      createLocality([
        { pid: 7, rowState: 'removed' },
        { pid: 8, rowState: 'clean' },
      ]),
      onSettled
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onSettled).toHaveBeenCalledWith(true))
    expect(store.getState().user.localities).toContain(localityId)
  })

  it('keeps locality edit access when the update fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(createResponse(403, { message: 'Not authorized' }))
    const onSettled = jest.fn()
    const store = renderEditLocality(createLocality([{ pid: 7, rowState: 'removed' }]), onSettled)

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onSettled).toHaveBeenCalledWith(false))
    expect(store.getState().user.localities).toContain(localityId)
  })
})
