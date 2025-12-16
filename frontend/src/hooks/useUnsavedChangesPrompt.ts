import { useContext, useEffect } from 'react'

import { UnsavedChangesContext } from '@/components/unsavedChangesContext'

type UseUnsavedChangesPromptOptions = {
  message?: string
}

export const useUnsavedChangesPrompt = (isDirty: boolean, { message }: UseUnsavedChangesPromptOptions = {}) => {
  const context = useContext(UnsavedChangesContext)

  if (!context) {
    throw new Error('useUnsavedChangesPrompt must be used within an UnsavedChangesProvider')
  }

  const { setDirty, setMessage, resetMessage } = context

  useEffect(() => {
    setDirty(isDirty)

    return () => {
      setDirty(false)
    }
  }, [isDirty, setDirty])

  useEffect(() => {
    if (!message) {
      return undefined
    }

    setMessage(message)
    return () => resetMessage()
  }, [message, resetMessage, setMessage])

  return context
}
