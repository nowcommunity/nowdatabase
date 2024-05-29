/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useState, JSX, useEffect, Context, useContext } from 'react'
import { DropdownOption } from '../common/editingComponents'
import { cloneDeep } from 'lodash-es'

export type ModeOptions = 'read' | 'new' | 'edit' | 'staging-edit' | 'staging-new'

export type ModeType = {
  read: boolean
  staging: boolean
  new: boolean
  option: ModeOptions
}

export const modeOptionToMode: Record<ModeOptions, ModeType> = {
  new: {
    read: false,
    staging: false,
    new: true,
    option: 'new',
  },
  read: {
    read: true,
    staging: false,
    new: false,
    option: 'read',
  },
  edit: {
    read: false,
    staging: false,
    new: false,
    option: 'edit',
  },
  'staging-edit': {
    read: false,
    staging: true,
    new: false,
    option: 'staging-edit',
  },
  'staging-new': {
    read: false,
    staging: true,
    new: false,
    option: 'staging-new',
  },
}

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  setMode: (newMode: ModeOptions) => void
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

export const useDetailContext = <T,>() => {
  const detailContext = useContext<DetailContextType<T>>(DetailContext as unknown as Context<DetailContextType<T>>)
  if (!detailContext) throw new Error('detailContext lacking provider')
  return detailContext
}
