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

/* Takes in an object and returns only the non-object fields with their field name (column) and value */
export const getItemList = (object: Record<string, unknown>) => {
  const list: DbWriteItem[] = Object.entries(object)
    .map(([field, value]) => ({
      column: field,
      value: value as DbValue,
    }))
    .filter(item => typeof item.value === 'object')
  return list
}
