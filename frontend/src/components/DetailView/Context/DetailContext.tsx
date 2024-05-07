import { ReactNode, createContext, useState } from 'react'
import { DropdownOption } from '../common/FormComponents'

export type ModeType = 'read' | 'new' | 'edit'

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  editData: T
  setEditData: (editData: T) => void
  textField: (field: keyof T) => JSX.Element
  dropdown: (field: keyof T, options: Array<DropdownOption | string>, name: string) => JSX.Element
  radioSelection: (field: keyof T, options: string[], name: string) => JSX.Element
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
      value={{
        ...contextState,
        editData,
        setEditData: (data: unknown) => setEditData(data as T),
      }}
    >
      {children}
    </DetailContext.Provider>
  )
}
