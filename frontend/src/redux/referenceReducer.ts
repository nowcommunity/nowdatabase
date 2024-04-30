/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { Reference } from '@/backendTypes'

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllReferences: builder.query<any, any>({
      query: () => ({
        url: `/reference/all`,
      }),
    }),
    getReferenceDetails: builder.query<Reference, any>({
      query: (id: number) => ({
        url: `/reference/${id}`,
      }),
    }),
  }),
})

export const { useGetAllReferencesQuery, useGetReferenceDetailsQuery } = referencesApi
