import { api } from './api'
import { Project, ProjectDetailsType } from '@/backendTypes'

const projectsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllProjects: builder.query<Project[], void>({
      query: () => ({
        url: `/project/all`,
      }),
    }),
    getProjectDetails: builder.query<ProjectDetailsType, string>({
      query: id => ({
        url: `/project/${id}`,
      }),
    }),
  }),
})

export const { useGetAllProjectsQuery, useGetProjectDetailsQuery } = projectsApi
