/*
  common utility functions for processing saving actions
*/
import { EditDataType } from '../../../../frontend/src/backendTypes'

/*
  Returns object where only the "original" fields remain.
*/
export const filterFields = <T extends object>(
  editedObject: EditDataType<T>,
  wantedFields: Record<string, unknown>
) => {
  const fields = Object.keys(wantedFields)
  const filteredFields = Object.entries(editedObject).filter(([field]) => fields.includes(field))
  const filteredObject = filteredFields.reduce<Record<string, unknown>>((obj, cur) => {
    obj[cur[0]] = cur[1]
    return obj
  }, {}) as Partial<T>
  return { filteredFields, filteredObject }
}

export const replaceKey =
  (f: (from: string) => string) =>
  (o: object): object =>
    Array.isArray(o)
      ? o.map(replaceKey(f))
      : Object(o) === o
        ? Object.fromEntries(Object.entries(o).map(([k, v]) => [f(k), replaceKey(f)(v)]))
        : o

export const revertFieldNames = (obj: object) => {
  const fieldsToReplace = { species: 'now_ls' }
  let newObj = obj
  for (const [oldName, newName] of Object.entries(fieldsToReplace)) {
    newObj = replaceKey(key => (key === oldName ? newName : key))(newObj)
  }
  return newObj
}

export const isNumeric = (value: string) => /^-?\d+$/.test(value)

// JSON.stringify doesn't preserve "key: undefined" entries, this prints those as a string instead
export const printJSON = (obj: object) =>
  JSON.stringify(
    obj,
    (k: string | number, v: unknown) => {
      return v === undefined ? 'undefined' : v
    },
    2
  )
