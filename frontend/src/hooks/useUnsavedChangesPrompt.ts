import { useEffect } from 'react'

import { useUnsavedChangesContext } from '@/components/UnsavedChangesProvider'

export const useUnsavedChangesPrompt = (isDirty: boolean) => {
  const { setDirty } = useUnsavedChangesContext()

  useEffect(() => {
    setDirty(isDirty)
  }, [isDirty, setDirty])

  return { setDirty }
}

export default useUnsavedChangesPrompt
