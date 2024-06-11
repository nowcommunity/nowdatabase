/*
  common utility functions for processing saving actions
*/
import { EditDataType } from '../../../frontend/src/backendTypes'

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
