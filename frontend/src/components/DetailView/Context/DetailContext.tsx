/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useState, JSX, useEffect, Context, useContext } from 'react'
import { DropdownOption } from '../common/editingComponents'
import { ValidationObject } from '@/shared/validators/validator'
import { EditDataType } from '@/shared/types'
import {
  TextFieldOptions,
  OptionalRadioSelectionProps,
  FieldsWithErrorsType,
  SetFieldsWithErrorsType,
} from '../DetailView'

const cloneDeep = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isEqualWith = (
  value: unknown,
  other: unknown,
  customizer?: (value: unknown, other: unknown) => boolean | undefined
): boolean => {
  const customizedResult = customizer?.(value, other)
  if (customizedResult !== undefined) return customizedResult

  if (Object.is(value, other)) return true

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false
    return value.every((item, index) => isEqualWith(item, other[index], customizer))
  }

  if (isPlainObject(value) && isPlainObject(other)) {
    const valueKeys = Object.keys(value)
    const otherKeys = Object.keys(other)

    if (valueKeys.length !== otherKeys.length) return false

    return valueKeys.every(key => isEqualWith(value[key], other[key], customizer))
  }

  return false
}

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
    new: true,
    option: 'staging-new',
  },
}

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  setMode: (newMode: ModeOptions) => void
  editData: EditDataType<T>
  setEditData: SetEditDataType<T>
  textField: (field: keyof EditDataType<T>, options?: TextFieldOptions) => JSX.Element
  bigTextField: (field: keyof EditDataType<T>) => JSX.Element
  dropdown: (
    field: keyof EditDataType<T>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean
  ) => JSX.Element
  dropdownWithSearch: (
    field: keyof EditDataType<T>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean,
    label?: string
  ) => JSX.Element
  radioSelection: (
    field: keyof EditDataType<T>,
    options: Array<DropdownOption | string>,
    name: string,
    optionalRadioSelectionProps?: OptionalRadioSelectionProps
  ) => JSX.Element
  validator: (editData: EditDataType<T>, field: keyof EditDataType<T>) => ValidationObject
  fieldsWithErrors: FieldsWithErrorsType
  setFieldsWithErrors: SetFieldsWithErrorsType
  isDirty: boolean
  resetEditData: () => void
}

export type SetEditDataType<T> = (editData: EditDataType<T>) => void

export const DetailContext = createContext<DetailContextType<unknown>>(null!)

export const makeEditData = <T,>(data: T): EditDataType<T> => ({
  ...(cloneDeep(data) as EditDataType<T>),
  references: [],
  comment: '',
})

export const DetailContextProvider = <T extends object>({
  children,
  contextState,
}: {
  children: ReactNode | ReactNode[]
  contextState: Omit<DetailContextType<T>, 'setEditData' | 'isDirty' | 'resetEditData'>
}) => {
  const [initialEditData, setInitialEditData] = useState<EditDataType<T>>(makeEditData(contextState.data))
  const [editData, setEditData] = useState<EditDataType<T>>(makeEditData(contextState.data))
  const [isDirty, setIsDirty] = useState(false)

  const compareValues = (value: unknown, other: unknown) => {
    const isEmpty = (input: unknown) => input === '' || input === null || input === undefined
    if (isEmpty(value) && isEmpty(other)) return true
    return undefined
  }

  useEffect(() => {
    const nextEditData = makeEditData(contextState.data)
    setInitialEditData(nextEditData)
    setEditData(cloneDeep(nextEditData))
    setIsDirty(false)
  }, [contextState.data])

  useEffect(() => {
    setIsDirty(!isEqualWith(editData, initialEditData, compareValues))
  }, [editData, initialEditData])

  const handleSetEditData = (data: unknown) => {
    const newEditData = data as EditDataType<T>
    setEditData(newEditData)
    setIsDirty(!isEqualWith(newEditData, initialEditData, compareValues))
  }

  const resetEditData = () => {
    setEditData(cloneDeep(initialEditData))
    setIsDirty(false)
  }
  return (
    <DetailContext.Provider
      value={{
        ...contextState,
        editData,
        setEditData: handleSetEditData,
        isDirty,
        resetEditData,
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
