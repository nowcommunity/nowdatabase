import { ReactNode, createContext, useState, JSX } from 'react'
import { DropdownOption } from '../common/editingComponents'

export type ModeType = 'read' | 'new' | 'edit'

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  editData: T
  setEditData: (editData: T) => void
  textField: (field: keyof T, type?: React.HTMLInputTypeAttribute) => JSX.Element
  dropdown: (field: keyof T, options: Array<DropdownOption | string>, name: string) => JSX.Element
  radioSelection: (field: keyof T, options: Array<DropdownOption | string>, name: string) => JSX.Element
  validator: (editData: T, field: keyof T) => string | null
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
        validator: (editData: unknown, fieldName: keyof T) => contextState.validator(editData as T, fieldName),
      }}
    >
      {children}
    </DetailContext.Provider>
  )
}
