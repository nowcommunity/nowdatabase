import { Editable } from '../../../../../frontend/src/backendTypes'
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
