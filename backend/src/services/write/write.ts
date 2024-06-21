/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  EditDataType,
  LocalityDetailsType,
  SpeciesDetailsType,
  TimeBoundDetailsType,
  TimeUnitDetailsType,
} from '../../../../frontend/src/backendTypes'
import { revertFieldNames } from './writeUtils'

type WriteFunction = (
  data: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>,
  tableName: string,
  oldObject: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>
) => string

const ids = { now_loc: 'lid', now_ls: 'species_id' }

type Item = { column: string; value: any }
type WriteItem = { table: string; type: 'add' | 'update' | 'delete'; items: Item[] }

const getFindFunction = (tableName: string, newItem: any) => (item: any) => {
  const matchFields = (fields: string[]) => {
    return !fields.find(f => newItem[f] !== item[f])
  }
  const matches = { now_ls: ['species_id', 'lid'], now_proj: ['pid'], now_plr: ['lid', 'pid'], now_syn_loc: ['syn_id'] }
  if (!matches[tableName]) console.log('Alert matcher missing for ', tableName)
  return matchFields(matches[tableName])
}

// TODO change ignored fields to allowed fields. form those by taking prisma.model.fields, and adding the accepted relation fields.
const ignoredFields = ['now_lau']
export const write: WriteFunction = (data, tableName, oldObject) => {
  console.log('Write')
  const writeList: WriteItem[] = []
  const writeTable = (obj: object, tableName: string, oldObj: object | null) => {
    console.log(
      `writeTable called tableName: ${tableName}\n'} ${oldObj ? ' oldobj defined ' : ' no old object found '}`
    )
    const allFields = Object.keys(obj).filter(f => !ignoredFields.includes(f))
    const fields = allFields.filter(f => typeof obj[f as keyof object] !== 'object' || obj[f as keyof object] === null)
    const relationFields = allFields.filter(
      f => typeof obj[f as keyof object] === 'object' && obj[f as keyof object] !== null
    )
    console.log('fields: ', JSON.stringify(fields))
    console.log('relations: ', JSON.stringify(relationFields))
    const fieldsToWrite: Item[] = []
    const rowsToDelete: Item[] = []
    for (const field of fields) {
      const newValue = obj[field as keyof object] as any
      const oldValue = oldObj?.[field as keyof object]
      if (newValue === oldValue) continue
      console.log(
        `Field: ${field} Old value: ${oldValue} - ${typeof oldValue} New value: ${newValue} - ${typeof newValue}`
      )
      fieldsToWrite.push({ column: field, value: newValue })
    }

    const columns = fieldsToWrite.map(({ column }) => column)
    const values = fieldsToWrite.map(({ value }) => value)
    const idFieldName = ids[tableName as keyof object] as string
    let id = obj[idFieldName as keyof object] as string
    if (values.length > 0) {
      if (id) {
        query(`UPDATE ${tableName} SET ${columns.map(c => `${c} = ?`).join(', ')} RETURNING ${idFieldName}`, [
          ...values,
        ])
      } else {
        id = query(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (?) RETURNING ${idFieldName}`, values)
      }
    }
    for (const relationField of relationFields) {
      const value = obj[relationField]
      if (Array.isArray(value)) {
        const toBeDeleted: Item[] = value
          .filter(({ rowState }) => rowState === 'removed')
          .map(item => ({ column: relationField, value: item[idFieldName] }))
        rowsToDelete.push(...toBeDeleted)
        for (const item of value.filter(({ rowState }) => rowState !== 'removed')) {
          const itemWithId = { ...item, [ids[tableName]]: id }
          // console.log('item', item, JSON.stringify(item))
          writeTable(itemWithId, relationField, oldObj[relationField].find(getFindFunction(relationField, itemWithId)))
        }
      } else {
        // writing a relation object
        const itemWithId = { ...value, [idFieldName]: id }
        writeTable(itemWithId, relationField, oldObj?.[relationField as keyof object] as any)
      }
    }
    rowsToDelete.map(item => query(`DELETE FROM ? WHERE ? = ?`, [item.column, ids[item.column], item.value])) // NOTE column here is actually table name
    //console.log(JSON.stringify(fieldsToWrite, null, 2))
  }

  console.log('Old object', JSON.stringify(oldObject, null, 2))
  console.log('New object', JSON.stringify(data, null, 2))
  writeTable(revertFieldNames(data), tableName, revertFieldNames(oldObject))
  // console.log(JSON.stringify(writeList, null, 2))
  return 'ok'
}

const query = (queryString: string, values: any[]) => {
  console.log(`${queryString} | values: ${values.join(', ')}`)
  return 'some_id'
}
