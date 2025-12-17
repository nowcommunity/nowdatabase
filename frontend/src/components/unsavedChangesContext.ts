import { createContext } from 'react'

export type UnsavedChangesContextValue = {
  isDirty: boolean
  message: string
  setDirty: (dirty: boolean) => void
  setMessage: (message: string) => void
  resetMessage: () => void
}

export const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null)
