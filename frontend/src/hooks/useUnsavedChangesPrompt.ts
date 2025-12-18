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
  }, [isDirty, setDirty])

  useEffect(() => {
    return () => {
      setDirty(false)
    }
  }, [setDirty])

  useEffect(() => {
    if (!message) {
      return undefined
    }

    setMessage(message)
    return () => resetMessage()
  }, [message, resetMessage, setMessage])

  useEffect(() => {
    if (!isDirty) {
      return undefined
    }

    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = message ?? context.message
    }

    window.addEventListener('beforeunload', beforeUnloadHandler)
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [context.message, isDirty, message])

  return context
}
