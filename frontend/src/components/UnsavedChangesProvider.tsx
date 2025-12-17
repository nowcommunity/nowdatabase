import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import type { Blocker } from '@remix-run/router'
import { useBlocker } from 'react-router-dom'

type UnsavedChangesContextValue = {
  isDirty: boolean
  setDirty: (dirty: boolean) => void
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null)

const shouldShowPrompt = (blocker: Blocker, isDirty: boolean) => blocker.state === 'blocked' && isDirty

export const UnsavedChangesProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setDirty] = useState(false)
  const blocker = useBlocker(isDirty)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    setDialogOpen(shouldShowPrompt(blocker, isDirty))
  }, [blocker, isDirty])

  const handleStay = () => {
    blocker.reset?.()
    setDialogOpen(false)
  }

  const handleLeave = () => {
    setDirty(false)
    blocker.proceed?.()
    setDialogOpen(false)
  }

  const contextValue = useMemo<UnsavedChangesContextValue>(() => ({ isDirty, setDirty }), [isDirty])

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}
      <Dialog
        open={dialogOpen}
        aria-labelledby="unsaved-changes-title"
        aria-describedby="unsaved-changes-description"
        onClose={handleStay}
      >
        <DialogTitle id="unsaved-changes-title">Unsaved changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="unsaved-changes-description">
            You have unsaved changes. If you leave now, your edits will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay} color="primary" variant="outlined">
            Stay on page
          </Button>
          <Button onClick={handleLeave} color="error" variant="contained" autoFocus>
            Leave page
          </Button>
        </DialogActions>
      </Dialog>
    </UnsavedChangesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUnsavedChangesContext = () => {
  const context = useContext(UnsavedChangesContext)
  if (!context) {
    throw new Error('useUnsavedChangesContext must be used within an UnsavedChangesProvider')
  }
  return context
}

export default UnsavedChangesProvider
