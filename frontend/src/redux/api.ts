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
import { OccurrenceDetailsType } from '@/shared/types'

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
    'museum',
    'user',
    'crosssearch',
    'locality',
    'localities',
    'species',
    'specieslist',
    'speciessynonyms',
    'reference',
    'references',
    'timeunits',
    'timeunit',
    'timebound',
    'timebounds',
    'region',
    'regions',
    'museum',
    'museums',
    'person',
    'persons',
    'author',
    'project',
    'projects',
    'geoname',
    'occurrence',
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})

const occurrenceApi = api.injectEndpoints({
  endpoints: builder => ({
    getOccurrenceDetails: builder.query<OccurrenceDetailsType, { lid: number; speciesId: number }>({
      query: ({ lid, speciesId }) => ({
        url: `/occurrence/${lid}/${speciesId}`,
      }),
      providesTags: result => (result ? [{ type: 'occurrence', id: `${result.lid}-${result.species_id}` }] : []),
    }),
  }),
})

export const { useGetOccurrenceDetailsQuery } = occurrenceApi
