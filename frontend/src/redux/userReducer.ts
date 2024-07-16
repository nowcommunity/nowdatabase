import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/redux/api'
import { Role } from '@/types'

export type FrontendUser = {
  token: string
  username: string
  role: Role
  initials: string
  localities: Array<number>
}

type LoginData = { username: string; password: string }

const userApi = api.injectEndpoints({
  endpoints: builder => ({
    tryLogin: builder.mutation<FrontendUser, LoginData>({
      query: ({ username, password }: LoginData) => ({
        url: `/user/login`,
        body: {
          username,
          password,
        },
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation<void, string>({
      query: (password: string) => ({
        url: 'user/password',
        body: {
          newPassword: password,
        },
        method: 'PUT',
      }),
    }),
  }),
})

export interface UserState {
  token: string | null
  username: string | null
  role: Role
  initials: string | null
  localities: number[]
}

const initialState: UserState = {
  token: null,
  username: null,
  role: Role.ReadOnly,
  initials: null,
  localities: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_state, action: PayloadAction<UserState>) {
      return { ...action.payload }
    },
    clearUser() {
      return { ...initialState }
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export const userReducer = userSlice.reducer
export const { useTryLoginMutation, useChangePasswordMutation } = userApi
