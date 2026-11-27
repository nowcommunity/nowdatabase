import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { UNSAFE_DataRouterContext, useBlocker, type BlockerFunction } from 'react-router-dom'

import { UnsavedChangesDialog } from './UnsavedChangesDialog'
import { UnsavedChangesContext } from './unsavedChangesContext'

type UnsavedChangesProviderProps = {
  children: ReactNode
  defaultMessage?: string
  title?: string
}

const DEFAULT_MESSAGE = 'You have unsaved changes. Do you want to leave this page without saving?'

const unblockedState = {
  state: 'unblocked' as const,
  proceed: undefined,
  reset: undefined,
  location: undefined,
}

type BlockerState = typeof unblockedState | ReturnType<typeof useBlocker>
type BlockerPredicate = Parameters<typeof useBlocker>[0]

const BlockerBridge = ({
  shouldBlock,
  onChange,
}: {
  shouldBlock: BlockerPredicate
  onChange: (blocker: ReturnType<typeof useBlocker>) => void
}) => {
  const blocker = useBlocker(shouldBlock)

  useEffect(() => {
    onChange(blocker)
  }, [blocker, onChange])

  return null
}

export const UnsavedChangesProvider = ({
  children,
  defaultMessage = DEFAULT_MESSAGE,
  title = 'Unsaved changes',
}: UnsavedChangesProviderProps) => {
  const [isDirty, setDirty] = useState(false)
  const [message, setMessage] = useState(defaultMessage)
  const [blocker, setBlocker] = useState<BlockerState>(unblockedState)
  const allowNextNavigationRef = useRef(false)
  const dataRouterContext = useContext(UNSAFE_DataRouterContext)

  const showDialog = blocker.state === 'blocked' && blocker.location?.pathname !== window.location.pathname

  const resetMessage = useCallback(() => {
    setMessage(defaultMessage)
  }, [defaultMessage])

  const allowNextNavigation = useCallback(() => {
    allowNextNavigationRef.current = true
    setDirty(false)
  }, [])

  const shouldBlockNavigation = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      if (!isDirty) return false
      if (currentLocation.pathname === nextLocation.pathname) return false
      if (allowNextNavigationRef.current) {
        allowNextNavigationRef.current = false
        return false
      }
      return true
    },
    [isDirty]
  )

  const handleConfirm = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.proceed?.()
      setDirty(false)
    }
  }, [blocker, setDirty])

  const handleCancel = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.reset?.()
    }
  }, [blocker])

  useEffect(() => {
    if (!dataRouterContext) {
      setBlocker(unblockedState)
    }
  }, [dataRouterContext])

  const value = useMemo(
    () => ({
      isDirty,
      message,
      setDirty,
      setMessage,
      resetMessage,
      allowNextNavigation,
    }),
    [allowNextNavigation, isDirty, message, resetMessage]
  )

  return (
    <UnsavedChangesContext.Provider value={value}>
      {dataRouterContext ? <BlockerBridge shouldBlock={shouldBlockNavigation} onChange={setBlocker} /> : null}
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
