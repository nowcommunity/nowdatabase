/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useState, JSX, useEffect, Context, useContext } from 'react'
import { DropdownOption } from '../common/editingComponents'
import { cloneDeep } from 'lodash-es'
import { ValidationObject } from '@/validators/validator'
import { EditDataType } from '@/backendTypes'

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
  editData: EditDataType<T>
  setEditData: (editData: EditDataType<T>) => void
  textField: (field: keyof EditDataType<T>, type?: React.HTMLInputTypeAttribute) => JSX.Element
  bigTextField: (field: keyof EditDataType<T>) => JSX.Element
  dropdown: (
    field: keyof EditDataType<T>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean
  ) => JSX.Element
  radioSelection: (field: keyof EditDataType<T>, options: Array<DropdownOption | string>, name: string) => JSX.Element
  validator: (editData: EditDataType<T>, field: keyof EditDataType<T>) => ValidationObject
}

export const DetailContext = createContext<DetailContextType<unknown>>(null!)

/* This changes data so that all number or bigint fields become string */
export const makeEditData = <T,>(data: T): EditDataType<T> => {
  const editData: EditDataType<T> = {} as EditDataType<T>
  for (const field in data) {
    if (Array.isArray(data[field])) {
      editData[field] = (data[field] as never[]).map(item => makeEditData(item)) as never
    } else if (typeof data[field] === 'object' && data[field] !== null) {
      editData[field] = makeEditData(data[field]) as never
    } else if (typeof data[field] === 'number') {
      editData[field] = ('' + (data[field] as number)) as never
    } else if (typeof data[field] === 'bigint') {
      editData[field] = ('' + (data[field] as bigint)) as never
    } else {
      editData[field] = cloneDeep(data[field]) as never
    }
  }
  return { ...editData, references: [] }
}

export const DetailContextProvider = <T extends object>({
  children,
  contextState,
}: {
  children: ReactNode | ReactNode[]
  contextState: Omit<DetailContextType<T>, 'setEditData'>
}) => {
  const [editData, setEditData] = useState<EditDataType<T>>(makeEditData(contextState.data))

  useEffect(() => setEditData(makeEditData(contextState.data)), [contextState.data])
  return (
    <DetailContext.Provider
      value={{
        ...contextState,
        editData,
        setEditData: (data: unknown) => setEditData(data as EditDataType<T>),
        validator: (editData: unknown, fieldName: keyof EditDataType<T>) =>
          contextState.validator(editData as EditDataType<T>, fieldName),
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
