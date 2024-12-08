/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useState, JSX, useEffect, Context, useContext } from 'react'
import { DropdownOption } from '../common/editingComponents'
import { cloneDeep } from 'lodash-es'
import { ValidationObject } from '@/validators/validator'
import { EditDataType } from '@/shared/types'
import {
  TextFieldOptions,
  OptionalRadioSelectionProps,
  FieldsWithErrorsType,
  SetFieldsWithErrorsType,
} from '../DetailView'

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
  setEditData: (editData: EditDataType<T>) => void
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
    disabled?: boolean
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
}

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
