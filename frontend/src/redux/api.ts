import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from '../util/config'
import { RootState } from './store'
import { clearUser, setToken } from './userReducer'
import { QueryReturnValue } from 'node_modules/@reduxjs/toolkit/dist/query/baseQueryTypes'

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)
  const token = (api.getState() as RootState).user.token
  if (token && result.error?.status === 401) {
    const refreshedToken = (await baseQuery(
      { url: '/refreshToken', method: 'POST', body: { token } },
      api,
      extraOptions
    )) as QueryReturnValue<{ token: string }, FetchBaseQueryError, FetchBaseQueryMeta>
    if (refreshedToken?.data?.token) {
      api.dispatch(setToken(refreshedToken.data.token))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(clearUser())
      localStorage.clear()
      window.location.replace('/login?expired=true')
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  tagTypes: [
    'user',
    'crosssearch',
    'locality',
    'localities',
    'species',
    'specieslist',
    'reference',
    'references',
    'timeunits',
    'timeunit',
    'timebound',
    'timebounds',
    'region',
    'regions',
    'author',
    'geoname',
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})
