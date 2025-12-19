import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useBlocker } from 'react-router-dom'

import { UnsavedChangesDialog } from './UnsavedChangesDialog'
import { UnsavedChangesContext } from './unsavedChangesContext'

type UnsavedChangesProviderProps = {
  children: ReactNode
  defaultMessage?: string
  title?: string
}

const DEFAULT_MESSAGE = 'You have unsaved changes. Do you want to leave this page without saving?'

export const UnsavedChangesProvider = ({
  children,
  defaultMessage = DEFAULT_MESSAGE,
  title = 'Unsaved changes',
}: UnsavedChangesProviderProps) => {
  const [isDirty, setDirty] = useState(false)
  const [message, setMessage] = useState(defaultMessage)

  const blocker = useBlocker(isDirty)
  const isSamePathNavigation = blocker.state === 'blocked' && blocker.location?.pathname === window.location.pathname
  const showDialog = blocker.state === 'blocked' && !isSamePathNavigation

  const resetMessage = useCallback(() => {
    setMessage(defaultMessage)
  }, [defaultMessage])

  const handleConfirm = useCallback(() => {
    if (blocker.state === 'blocked') {
      setDirty(false)
      blocker.proceed?.()
    }
  }, [blocker, setDirty])

  const handleCancel = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.reset?.()
    }
  }, [blocker])

  useEffect(() => {
    const proceed = blocker.proceed as (() => void) | undefined
    if (isSamePathNavigation && proceed) {
      proceed()
    }
  }, [blocker, isSamePathNavigation])

  const value = useMemo(
    () => ({
      isDirty,
      message,
      setDirty,
      setMessage,
      resetMessage,
    }),
    [isDirty, message, resetMessage]
  )

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <UnsavedChangesDialog
        open={showDialog}
        description={message}
        title={title}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </UnsavedChangesContext.Provider>
  )
}
