import { EditDataType, Project, ProjectDetailsType } from '@/shared/types'
import { api } from './api'

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
    editProject: builder.mutation<ProjectDetailsType, EditDataType<ProjectDetailsType>>({
      query: project => ({
        url: `/project`,
        method: 'PUT',
        body: { project },
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

export const { useGetAllProjectsQuery, useGetProjectDetailsQuery, useEditProjectMutation, useDeleteProjectMutation } =
  projectsApi
