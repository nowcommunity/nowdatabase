/*
  common utility functions for processing saving actions
*/
import { EditDataType } from '../../../frontend/src/backendTypes'

/*
  Returns object where only the "original" fields remain. For example:
  if editedFields = full edited locality type, and modelObject = prisma.now_loc.fields, returns editedFields-object with
*/
export const filterFields = <T>(editedObject: EditDataType<T>, wantedFields: object) => {
  const fields = Object.keys(wantedFields)
  const filteredFields = Object.entries(editedObject)
    .filter(([field]) => fields.includes(field))
    .reduce<Record<string, unknown>>((obj, cur) => {
      obj[cur[0]] = cur[1]
      return obj
    }, {}) as Partial<T>
  return filteredFields
}
