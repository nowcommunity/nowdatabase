/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<any, any>({
      query: () => ({
        url: `/locality/all`,
      }),
    }),
  }),
})

export const { useGetAllLocalitiesQuery } = localitiesApi
