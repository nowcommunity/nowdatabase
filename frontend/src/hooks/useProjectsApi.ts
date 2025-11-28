import { useMemo } from 'react'
import { useCreateProjectMutation } from '@/redux/projectReducer'

export type ProjectStatusOption = { value: string; label: string }
export type RecordStatusOption = { value: 'public' | 'private'; label: string }

export const projectStatusOptions: ProjectStatusOption[] = [
  { value: 'current', label: 'Current' },
  { value: 'no_data', label: 'No data' },
  { value: 'finished', label: 'Finished' },
]

export const recordStatusOptions: RecordStatusOption[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
]

export const useProjectsApi = () => {
  const [createProject, result] = useCreateProjectMutation()
  const isSubmitting = useMemo(() => result.isLoading, [result.isLoading])

  return { createProject, isSubmitting, result }
}
