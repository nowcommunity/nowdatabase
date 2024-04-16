import { ReactNode, createContext, useState } from 'react'

export type ModeType = 'read' | 'new' | 'edit'

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  editData: T
  setEditData: (editData: T) => void
}

export const DetailContext = createContext<DetailContextType<unknown>>(null!)

export const DetailContextProvider = <T extends object>({
  children,
  contextState,
}: {
  children: ReactNode | ReactNode[]
  contextState: Omit<DetailContextType<T>, 'setEditData'>
}) => {
  const [editData, setEditData] = useState<T>(contextState.editData)

  return (
    <DetailContext.Provider
      value={{ ...contextState, editData, setEditData: (data: unknown) => setEditData(data as T) }}
    >
      {children}
    </DetailContext.Provider>
  )
}
