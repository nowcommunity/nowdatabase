// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../util/config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type LoginData = { username: string; password: string }

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: builder => ({
    tryLogin: builder.mutation<{ token: string; username: string }, LoginData>({
      query: ({ username, password }: LoginData) => ({
        url: `/user/login`,
        body: {
          username,
          password,
        },
        method: 'POST',
      }),
    }),
  }),
})

interface UserState {
  token: string | null
  username: string | null
}

const initialState: UserState = {
  token: null,
  username: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ token: string; username: string }>) {
      state.token = action.payload.token
      state.username = action.payload.username
    },
    clearUser(state) {
      state.token = null
      state.username = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export const userReducer = userSlice.reducer
export const { useTryLoginMutation } = userApi
