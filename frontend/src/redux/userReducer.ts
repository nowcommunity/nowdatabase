import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/redux/api'
import { FrontendUser } from '@shared/types'
import { PersonDetailsType } from '@/backendTypes'
import { Role } from '@/types'

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
    getAllUsers: builder.query<PersonDetailsType[], void>({
      query: () => ({
        url: `/user/all`,
      }),
    }),
    getUserDetails: builder.query<PersonDetailsType, string>({
      query: id => ({
        url: `/user/${id}`,
      }),
    }),
  }),
})

export interface UserState {
  token: string | null
  username: string | null
  role: Role
}

const initialState: UserState = {
  token: null,
  username: null,
  role: Role.ReadOnly,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ token: string; username: string; role: Role }>) {
      const { token, username, role } = action.payload
      state = { ...state, token, username, role }
    },
    clearUser(state) {
      state.token = null
      state.username = null
      state.role = Role.ReadOnly
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export const userReducer = userSlice.reducer
export const { useTryLoginMutation, useGetAllUsersQuery, useGetUserDetailsQuery } = userApi
