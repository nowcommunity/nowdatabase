import { ReactNode, createContext, useState, JSX, useEffect } from 'react'
import { DropdownOption } from '../common/editingComponents'
import { cloneDeep } from 'lodash-es'

export type ModeType = 'read' | 'new' | 'edit'

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  editData: T
  setEditData: (editData: T) => void
  textField: (field: keyof T, type?: React.HTMLInputTypeAttribute) => JSX.Element
  bigTextField: (field: keyof T) => JSX.Element
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
  const [editData, setEditData] = useState<T>(cloneDeep(contextState.data))

  useEffect(() => setEditData(cloneDeep(contextState.data)), [contextState.data])

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
