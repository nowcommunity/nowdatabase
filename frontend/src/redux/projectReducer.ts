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

export type UpdateProjectPayload = CreateProjectPayload & { pid: number }

const projectsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllProjects: builder.query<Project[], void>({
      query: () => ({
        url: `/project/all`,
      }),
      providesTags: result => (result ? [{ type: 'projects' }] : []),
    }),
    getProjectDetails: builder.query<ProjectDetailsType, string>({
      query: id => ({
        url: `/project/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'project', id: result.pid }] : []),
    }),
    createProject: builder.mutation<ProjectDetailsType, CreateProjectPayload>({
      query: body => ({
        url: `/projects`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['projects'],
    }),
    updateProject: builder.mutation<ProjectDetailsType, UpdateProjectPayload>({
      query: ({ pid, ...body }) => ({
        url: `/projects/${pid}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, _error, { pid }) =>
        result ? [{ type: 'project', id: pid }, 'projects'] : ['projects'],
    }),
    deleteProject: builder.mutation<void, number>({
      query: pid => ({
        url: `/project/${pid}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _error, pid) =>
        typeof result !== 'undefined' ? [{ type: 'project', id: pid }, 'projects'] : [],
    }),
  }),
})

export const {
  useGetAllProjectsQuery,
  useGetProjectDetailsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi
