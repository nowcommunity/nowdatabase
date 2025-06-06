import { Editable } from '../../../../../frontend/src/shared/types'
import { DbWriteItem } from './databaseHandler'
import { DbValue } from './types'

export const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value === '') return true
  return false
}

export const valueIsDifferent = (newValue: unknown, oldValue: unknown) => {
  if (newValue === oldValue) return false
  if (isEmptyValue(newValue) && isEmptyValue(oldValue)) return false
  if (typeof oldValue === 'bigint' && typeof newValue === 'number' && BigInt(newValue) === oldValue) return false
  return true
}

export const getItemList = (object: Record<string, unknown>, skipEmptyValues?: boolean) => {
  const list: DbWriteItem[] = Object.entries(object)
    .map(([field, value]) => ({
      column: field,
      value: value as DbValue,
    }))
    .filter(
      item =>
        // Filter out object fields, except date.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        typeof item.value !== 'object' || item.value === null || typeof (item.value as any).getMonth === 'function'
    )
    .filter(item => item.column !== 'rowState')
  if (skipEmptyValues) return list.filter(item => item.value !== '')
  return list
}

export const fixBoolean = (value: unknown) => {
  if (value === false) return 0
  if (value === true) return 1
  return value as DbValue
}

export const makeListRemoved = (list: Editable<Record<string, unknown>>[]) => {
  for (const item of list) {
    item.rowState = 'removed'
  }
}

export const fixRadioSelection = (value: unknown) => {
  if (typeof value === 'string') {
    return value === 'true' ? true : false
  }
  if (typeof value === 'boolean') return value
  return false
}

//Some types in frontend (such as ReferenceDetailsType) may have helper fields that are not present in the DB
//This function creates a copy of any frontend object that only has the keys that should go into the DB
export const filterAllowedKeys = <T extends Record<string, T[keyof T]>>(reference: T, allowedKeys: string[]) => {
  return allowedKeys
    .filter(key => key in reference)
    .reduce((obj, key) => {
      ;(obj as T)[key as keyof T] = reference[key as keyof T]
      return obj
    }, {} as Partial<T>)
}

//convert yyyy-MM-dd string to a dateobject prisma can automatically handle
export const convertToPrismaDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day) //Month indexes start at 0

  return date
}
