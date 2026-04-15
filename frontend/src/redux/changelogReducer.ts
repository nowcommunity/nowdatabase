import { api } from './api'

export type ChangelogEntry = {
  name: string
  tagName: string
  createdAt: string
  url: string
  bodyHtml: string
}

const changelogApi = api.injectEndpoints({
  endpoints: builder => ({
    getChangelog: builder.query<ChangelogEntry[], void>({
      query: () => ({ url: '/changelog' }),
    }),
  }),
})

export const { useGetChangelogQuery } = changelogApi
