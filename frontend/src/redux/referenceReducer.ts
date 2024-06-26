import { api } from './api'
import { EditDataType, Reference, ReferenceDetailsType, ReferenceType } from '@/backendTypes'

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllReferences: builder.query<Reference[], void>({
      query: () => ({
        url: `/reference/all`,
      }),
      providesTags: result => (result ? [{ type: 'references' }] : []),
    }),
    getReferenceDetails: builder.query<ReferenceDetailsType, string>({
      query: id => ({
        url: `/reference/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'reference', id: result.rid }] : []),
    }),
    getReferenceTypes: builder.query<ReferenceType[], void>({
      query: () => ({
        url: 'reference/types',
      }),
    }),
    editReference: builder.mutation<ReferenceDetailsType, EditDataType<ReferenceDetailsType>>({
      query: reference => ({
        url: `/reference/`,
        method: 'PUT',
        body: { reference },
      }),
      invalidatesTags: (result, _error, { rid }) => (result ? [{ type: 'reference', id: rid }, 'references'] : []),
    }),
  }),
})

export const {
  useGetAllReferencesQuery,
  useGetReferenceDetailsQuery,
  useGetReferenceTypesQuery,
  useEditReferenceMutation,
} = referencesApi
