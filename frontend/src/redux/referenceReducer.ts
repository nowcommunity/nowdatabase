/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { Reference, ReferenceDetails } from '@/backendTypes'

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllReferences: builder.query<Reference[], void>({
      query: () => ({
        url: `/reference/all`,
      }),
    }),
    getReferenceDetails: builder.query<ReferenceDetails, number>({
      query: id => ({
        url: `/reference/${id}`,
      }),
    }),
  }),
})

export const { useGetAllReferencesQuery, useGetReferenceDetailsQuery } = referencesApi
