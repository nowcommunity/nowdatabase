import { DbValue } from '../write/writeUtils'
import { DbWriteItem } from './databaseHandler'

const isEmptyValue = (value: unknown) => {
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
    .filter(item => typeof item.value !== 'object')
    .filter(item => item.column !== 'rowState')
  if (skipEmptyValues) return list.filter(item => item.value !== '')
  return list
}
