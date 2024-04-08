// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../util/config'

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: builder => ({
    tryLogin: builder.mutation<string, string>({
      query: username => ({
        url: `/user/login`,
        body: {
          username,
        },
        method: 'POST',
      }),
    }),
  }),
})

export const { useTryLoginMutation } = userApi
