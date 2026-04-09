import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/redux/api'
import { Role, UserDetailsType } from '@/shared/types'

export type LoginResponse = {
  token: string
  username: string
  role: Role
  initials: string
  localities: Array<number>
  isFirstLogin: undefined | true
}

type LoginData = { username: string; password: string }
type ChangePasswordRequest = { newPassword: string; oldPassword?: string; targetUserId?: number }

const userApi = api.injectEndpoints({
  endpoints: builder => ({
    tryLogin: builder.mutation<LoginResponse, LoginData>({
      query: ({ username, password }: LoginData) => ({
        url: `/user/login`,
        body: {
          username,
          password,
        },
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: ({ newPassword, oldPassword, targetUserId }: ChangePasswordRequest) => ({
        url: 'user/password',
        body: {
          newPassword,
          oldPassword,
          targetUserId,
        },
        method: 'PUT',
      }),
    }),
    createUser: builder.mutation<void, UserDetailsType>({
      query: (user: UserDetailsType) => ({
        url: '/user/new',
        body: user,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { initials }) => [{ type: 'person', id: initials }, 'persons'],
    }),
  }),
})

export interface UserState {
  token: string | null
  username: string | null
  role: Role
  initials: string | null
  localities: number[]
  isFirstLogin: undefined | true
}

const initialState: UserState = {
  token: null,
  username: null,
  role: Role.ReadOnly,
  initials: null,
  localities: [],
  isFirstLogin: undefined,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_state, action: PayloadAction<UserState>) {
      return { ...action.payload }
    },
    setToken(state, action: PayloadAction<string>) {
      return { ...state, token: action.payload }
    },
    addLocality(state, action: PayloadAction<number>) {
      if (state.localities.includes(action.payload)) return state
      return { ...state, localities: [...state.localities, action.payload] }
    },
    removeFirstLogin(state) {
      return { ...state, isFirstLogin: undefined }
    },
    clearUser() {
      return { ...initialState }
    },
  },
})

export const { setUser, setToken, addLocality, clearUser, removeFirstLogin } = userSlice.actions
export const userReducer = userSlice.reducer
export const { useTryLoginMutation, useChangePasswordMutation, useCreateUserMutation } = userApi
