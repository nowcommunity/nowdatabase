import { api } from './api'
import { PersonDetailsType, EditDataType } from '@/shared/types'

const personsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllPersons: builder.query<PersonDetailsType[], void>({
      query: () => ({
        url: `/person/all`,
      }),
      providesTags: result => (result ? [{ type: 'persons' }] : []),
    }),
    getPersonDetails: builder.query<PersonDetailsType, string>({
      query: id => ({
        url: `/person/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'person', id: result.initials }] : []),
    }),
    getPersonDetailsId: builder.mutation<PersonDetailsType, string>({
      query: id => ({
        url: `/person/${id}`,
      }),
  }),
    editPerson: builder.mutation<PersonDetailsType, EditDataType<PersonDetailsType>>({
      query: person => ({
        url: `/person`,
        method: 'PUT',
        body: { person },
      }),
      invalidatesTags: (result, _error, { initials }) => (result ? [{ type: 'person', id: initials }, 'persons'] : []),
    }),
  }),
})

export const { useGetAllPersonsQuery, useGetPersonDetailsQuery, useEditPersonMutation, useGetPersonDetailsIdMutation } = personsApi
