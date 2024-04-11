import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../util/config'

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['user', 'localities'],
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: () => ({}),
})
