import { api } from './api'
import { Project, ProjectDetails } from '@/backendTypes'

const projectsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllProjects: builder.query<Project[], void>({
      query: () => ({
        url: `/project/all`,
      }),
    }),
    getProjectDetails: builder.query<ProjectDetails, string>({
      query: id => ({
        url: `/project/${id}`,
      }),
    }),
  }),
})

export const { useGetAllProjectsQuery, useGetProjectDetailsQuery } = projectsApi
