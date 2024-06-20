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
} from '../../../frontend/src/backendTypes'
import { diff } from 'deep-object-diff'
import { isNumeric, printJSON, revertFieldNames } from './writeUtils'
type WriteFunction = (
  data: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>,
  tableName: string,
  oldObject: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>
) => string

const ids = { now_loc: 'lid', now_ls: ['lid', 'species_id'] }

type Item = { column: string; value: any }
type WriteItem = { table: string; type: 'add' | 'update' | 'delete'; items: Item[] }

export const write: WriteFunction = (data, tableName, oldObject) => {
  console.log('Write')
  const writeList: WriteItem[] = []

  const writeTable = (data: object, tableName: string, oldObject: object, parentTable?: string) => {
    console.log(
      `writeTable called tableName: ${tableName}\n, oldObject: ${oldObject === undefined ? 'undefined' : 'is defined'}\n, parentTable: ${parentTable}`
    )
    const rowsToDelete: { table: string; rowId: string }[] = []
    const fieldsToWrite: any[] = []

    for (const field of Object.keys(data)) {
      const value = data[field as keyof object] as string | number | undefined
      console.log(`Field ${field}`)
      if (Array.isArray(value)) {
        console.log('Writing array:')
        for (const [index, item] of value.entries()) {
          console.log(`* Index: ${index} Item: ${printJSON(item)}`)
          const oldArray = oldObject[field]
          const oldItem = oldArray?.[index]
          writeTable(item, field, oldItem, tableName)
        }
        return
      }
      if (isNumeric(field)) {
        console.log('is numeric')
        // We are iterating what was an array in original data
        if (value === undefined) {
          // Mark row to be deleted from join table
          const oldId = oldObject[field as keyof object]
          rowsToDelete.push({ table: tableName, rowId: oldId })
          continue
        }
        if (typeof value === 'object') {
          writeTable(value, tableName, oldObject)
          continue
        }
      } else if (typeof value === 'string' || typeof value === 'number') {
        fieldsToWrite.push({ field, value: data[field] })
      }
      if (typeof value === 'object') {
        writeTable(value, field, oldObject[field], tableName)
      }
    }
    if (fieldsToWrite.length === 0) return
    const oldId = oldObject?.[ids[tableName]]
    const result =
      oldId === undefined
        ? writeList.push({ type: 'add', items: fieldsToWrite, table: tableName }) //query(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (?) RETURNING ${ids[tableName]}`, values)
        : writeList.push({ type: 'update', items: fieldsToWrite, table: tableName }) //query(`UPDATE ${tableName} SET ${columns.map(c => `${c} = ?`).join(', ')} RETURNING ${ids[tableName]}`, [ ...values,])
    return { id: result[ids[tableName]] }
  }

  console.log('Old object', JSON.stringify(oldObject, null, 2))
  console.log('New object', JSON.stringify(data, null, 2))
  const diffData = diff(oldObject, data)
  console.log('diff', printJSON(diffData))
  writeTable(diffData, tableName, oldObject)
  console.log(JSON.stringify(writeList, null, 2))
  return 'ok'
}

const query = (queryString: string, values: unknown[]) => {
  console.log(`${queryString} | values: ${values}`)
  return 'ok'
}

export const testUpdate = () => {
  const oldLoc = {
    lid: 1,
    age_comm: 'old comment',
    now_ls: [
      {
        lid: 2,
        species_id: 2,
        nis: 100,
      },
    ],
  }
  const editedFields = {
    age_comm: 'write-testi',
    max_age: 5000,
    now_ls: [{ lid: 2, species_id: 2, source_name: 'locci' }],
  }
  write(revertFieldNames({ ...oldLoc, ...editedFields }), 'now_loc', oldLoc)
}

export const testWrite = () => {
  console.log('testing update')
  testUpdate()
}
