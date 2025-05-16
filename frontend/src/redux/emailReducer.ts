import { api } from './api'

const emailApi = api.injectEndpoints({
  endpoints: builder => ({
    email: builder.mutation<void, { message: string; title: string }>({
      query: body => ({
        url: `/email`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useEmailMutation } = emailApi
