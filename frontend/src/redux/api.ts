import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from '../util/config'
import { RootState } from './store'

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['user', 'localities', 'species', 'specieslist', 'references', 'timeunits', 'timeunit', 'locality'],
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})
