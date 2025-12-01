import { useMemo } from 'react'
import { recordStatusOptions, projectStatusOptions } from '@/constants/projectStatus'
import { useCreateProjectMutation } from '@/redux/projectReducer'

export { projectStatusOptions, recordStatusOptions }

export const useProjectsApi = () => {
  const [createProject, result] = useCreateProjectMutation()
  const isSubmitting = useMemo(() => result.isLoading, [result.isLoading])

  return { createProject, isSubmitting, result }
}
