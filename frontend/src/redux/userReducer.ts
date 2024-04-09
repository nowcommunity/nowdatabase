// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../util/config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type LoginData = { username: string; password: string }

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: builder => ({
    tryLogin: builder.mutation<UserState, LoginData>({
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
}

const initialState: UserState = {
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    clearToken(state) {
      state.token = null
    },
  },
})

export const { setToken, clearToken } = userSlice.actions
export const userReducer = userSlice.reducer
export const { useTryLoginMutation } = userApi
