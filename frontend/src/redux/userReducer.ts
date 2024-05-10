import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/redux/api'
import { UserFields } from '@shared/types'

type LoginData = { username: string; password: string }

const userApi = api.injectEndpoints({
  endpoints: builder => ({
    tryLogin: builder.mutation<UserFields, LoginData>({
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
