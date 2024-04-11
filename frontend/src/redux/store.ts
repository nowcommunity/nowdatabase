import { configureStore, Middleware } from '@reduxjs/toolkit'
import { userReducer } from './userReducer'
import { api } from './api'

const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action)
  const state = store.getState()
  localStorage.setItem('userState', JSON.stringify(state.user))
  return result
}

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('userState')
    if (serializedState === null) {
      return undefined
    }
    const parsedState = JSON.parse(serializedState)
    return { user: parsedState }
  } catch (err) {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware).concat(localStorageMiddleware),
  preloadedState: loadFromLocalStorage(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
