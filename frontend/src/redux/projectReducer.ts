import { api } from './api'
import { Project, ProjectDetailsType } from '@/shared/types'

export type CreateProjectPayload = {
  projectCode: string
  projectName: string
  coordinatorUserId: number
  projectStatus: string
  recordStatus: boolean
  memberUserIds?: number[]
}

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
    createProject: builder.mutation<ProjectDetailsType, CreateProjectPayload>({
      query: body => ({
        url: `/projects`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetAllProjectsQuery, useGetProjectDetailsQuery, useCreateProjectMutation } = projectsApi
